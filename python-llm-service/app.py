import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass


def get_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        if default is not None:
            return default
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def build_azure_chat_url(endpoint: str, deployment: str, api_version: str) -> str:
    endpoint = endpoint.rstrip("/")
    return f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"


app = Flask(__name__)
# Allow CORS from Java backend default http://localhost:8080
CORS(app, resources={r"/*": {"origins": os.getenv("ALLOWED_ORIGIN", "http://localhost:8080")}})


@app.get("/health")
def health() -> tuple[dict, int]:
    return {"status": "ok"}, 200


@app.post("/generate")
def generate():
    try:
        data = request.get_json(silent=True) or {}
        prompt = (data.get("prompt") or "").strip()
        if not prompt:
            return jsonify({"error": "Field 'prompt' is required"}), 400

        # MOCK mode for local testing without Azure credentials
        if (os.getenv("MOCK", "false").lower() in ("1", "true", "yes")):
            return jsonify({"response": f"Echo: {prompt}"})

        azure_endpoint = get_env("AZURE_OPENAI_ENDPOINT")
        azure_key = get_env("AZURE_OPENAI_KEY")
        deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", os.getenv("AZURE_OPENAI_MODEL", "gpt-4o"))
        api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

        url = build_azure_chat_url(azure_endpoint, deployment, api_version)
        headers = {
            "Content-Type": "application/json",
            "api-key": azure_key,
        }
        body = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "top_p": 0.95,
        }

        resp = requests.post(url, headers=headers, json=body, timeout=60)
        if resp.status_code >= 400:
            try:
                payload = resp.json()
            except Exception:
                payload = {"text": resp.text}
            return jsonify({
                "error": "Azure OpenAI request failed",
                "status": resp.status_code,
                "details": payload,
            }), 502

        payload = resp.json()
        choices = payload.get("choices") or []
        if not choices or not choices[0].get("message"):
            return jsonify({
                "error": "Unexpected response from Azure OpenAI",
                "details": payload,
            }), 502

        content = choices[0]["message"].get("content", "").strip()
        return jsonify({"response": content})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)