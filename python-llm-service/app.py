#!/usr/bin/env python3
"""
Flask microservice for Azure OpenAI integration
Handles LLM calls from Java backend and returns AI responses
"""

import os
import json
import requests
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])  # Allow Java backend

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT')
AZURE_OPENAI_KEY = os.getenv('AZURE_OPENAI_KEY')
AZURE_OPENAI_API_VERSION = os.getenv('AZURE_OPENAI_API_VERSION', '2024-02-15-preview')
AZURE_OPENAI_DEPLOYMENT = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Azure OpenAI LLM Service',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/generate', methods=['POST'])
def generate_response():
    """
    Generate AI response using Azure OpenAI
    Expected JSON: {"prompt": "user query"}
    Returns: {"response": "AI response"}
    """
    start_time = time.time()
    
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Missing "prompt" field in request'}), 400
        
        user_prompt = data['prompt']
        logger.info(f"Received prompt: {user_prompt[:100]}...")
        
        # Check Azure OpenAI configuration
        if not AZURE_OPENAI_ENDPOINT or not AZURE_OPENAI_KEY:
            logger.error("Azure OpenAI configuration missing")
            return jsonify({
                'response': 'I apologize, but the AI service is not properly configured. Please contact your administrator.',
                'error': 'Azure OpenAI configuration missing'
            }), 500
        
        # Prepare Azure OpenAI request
        headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_OPENAI_KEY
        }
        
        # Create system prompt for IRENO context
        system_prompt = """You are IRENO AI Assistant, a specialized utility grid management assistant. 
You help utility operators with:
- Grid monitoring and alerts
- Outage management
- Asset status inquiries
- Performance analytics
- Maintenance scheduling

Provide clear, actionable responses focused on utility grid operations. Be concise and professional."""
        
        payload = {
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            'max_tokens': 1000,
            'temperature': 0.7,
            'top_p': 0.9
        }
        
        # Construct the full URL
        url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
        
        logger.info(f"Calling Azure OpenAI at: {url}")
        
        # Make request to Azure OpenAI
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            response_data = response.json()
            ai_response = response_data['choices'][0]['message']['content']
            
            processing_time = time.time() - start_time
            logger.info(f"Successfully generated response in {processing_time:.2f}s")
            
            return jsonify({
                'response': ai_response,
                'processing_time': round(processing_time, 2)
            }), 200
        
        else:
            error_msg = f"Azure OpenAI API error: {response.status_code}"
            if response.text:
                error_msg += f" - {response.text}"
            
            logger.error(error_msg)
            return jsonify({
                'response': 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
                'error': error_msg
            }), 500
            
    except requests.exceptions.Timeout:
        logger.error("Request to Azure OpenAI timed out")
        return jsonify({
            'response': 'The AI service is taking longer than expected. Please try again.',
            'error': 'Request timeout'
        }), 500
        
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Azure OpenAI")
        return jsonify({
            'response': 'Unable to connect to AI service. Please check your connection.',
            'error': 'Connection error'
        }), 500
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'response': 'An unexpected error occurred. Please try again later.',
            'error': str(e)
        }), 500

@app.route('/info', methods=['GET'])
def service_info():
    """Service information endpoint"""
    return jsonify({
        'service': 'IRENO Azure OpenAI LLM Service',
        'version': '1.0.0',
        'endpoints': {
            'generate': '/generate',
            'health': '/health',
            'info': '/info'
        },
        'azure_endpoint_configured': bool(AZURE_OPENAI_ENDPOINT),
        'azure_key_configured': bool(AZURE_OPENAI_KEY),
        'model': AZURE_OPENAI_DEPLOYMENT
    }), 200

if __name__ == '__main__':
    logger.info("Starting IRENO Azure OpenAI LLM Service...")
    logger.info(f"Azure OpenAI Endpoint: {AZURE_OPENAI_ENDPOINT}")
    logger.info(f"Model Deployment: {AZURE_OPENAI_DEPLOYMENT}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)