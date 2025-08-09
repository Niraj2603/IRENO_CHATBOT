#!/bin/bash

echo "🧪 Testing IRENO Chatbot System Integration..."

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Test counter
TESTS_PASSED=0
TESTS_TOTAL=0

run_test() {
    local test_name="$1"
    local command="$2"
    local expected_status="$3"
    
    echo -e "${BLUE}🔬 Testing: $test_name${NC}"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    # Run the command and capture response
    response=$(eval "$command" 2>/dev/null)
    status=$?
    
    if [ $status -eq $expected_status ]; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        if [ ! -z "$response" ]; then
            echo -e "${YELLOW}   Response: ${response:0:100}...${NC}"
        fi
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        echo -e "${RED}   Expected status: $expected_status, Got: $status${NC}"
        if [ ! -z "$response" ]; then
            echo -e "${RED}   Response: $response${NC}"
        fi
    fi
    echo ""
}

# Check if services are running
echo -e "${BLUE}📋 Checking service status...${NC}"

if ! check_port 5000; then
    echo -e "${RED}❌ Python LLM Service is not running on port 5000${NC}"
    echo -e "${YELLOW}Please run './start-services.sh' first${NC}"
    exit 1
fi

if ! check_port 8080; then
    echo -e "${RED}❌ Java Backend is not running on port 8080${NC}"
    echo -e "${YELLOW}Please run './start-services.sh' first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Both services are running${NC}"
echo ""

# Test Python LLM Service
echo -e "${BLUE}🐍 Testing Python LLM Service...${NC}"
run_test "Python Health Check" "curl -s http://localhost:5000/health" 0
run_test "Python Service Info" "curl -s http://localhost:5000/info" 0

# Only test generation if Azure OpenAI is configured
if [ ! -z "$AZURE_OPENAI_ENDPOINT" ] && [ ! -z "$AZURE_OPENAI_KEY" ]; then
    run_test "Python AI Generation" "curl -s -X POST http://localhost:5000/generate -H 'Content-Type: application/json' -d '{\"prompt\": \"Test prompt\"}'" 0
else
    echo -e "${YELLOW}⚠️  Skipping AI generation test (Azure OpenAI not configured)${NC}"
    echo ""
fi

# Test Java Backend
echo -e "${BLUE}☕ Testing Java Backend...${NC}"
run_test "Java Health Check" "curl -s http://localhost:8080/api/health" 0
run_test "Java Status Check" "curl -s http://localhost:8080/api/status" 0

# Test authentication
echo -e "${BLUE}🔐 Testing Authentication...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS: Login successful${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Extract token for further tests
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${YELLOW}   Token: ${TOKEN:0:20}...${NC}"
    
    # Test protected endpoints
    echo -e "${BLUE}🔒 Testing Protected Endpoints...${NC}"
    
    run_test "Get Chat History" "curl -s -H 'Authorization: Bearer $TOKEN' http://localhost:8080/api/history" 0
    run_test "Get Assets Data" "curl -s -H 'Authorization: Bearer $TOKEN' http://localhost:8080/api/assets" 0
    run_test "Get Outages Data" "curl -s -H 'Authorization: Bearer $TOKEN' http://localhost:8080/api/outages" 0
    
    # Test chat endpoint (only if Python service is working)
    if [ ! -z "$AZURE_OPENAI_ENDPOINT" ] && [ ! -z "$AZURE_OPENAI_KEY" ]; then
        run_test "Chat Integration" "curl -s -X POST http://localhost:8080/api/chat \
          -H 'Content-Type: application/json' \
          -H 'Authorization: Bearer $TOKEN' \
          -d '{\"query\": \"Test chat integration\"}'" 0
    else
        echo -e "${YELLOW}⚠️  Skipping chat integration test (Azure OpenAI not configured)${NC}"
        echo ""
    fi
    
else
    echo -e "${RED}❌ FAIL: Login failed${NC}"
    echo -e "${RED}   Response: $LOGIN_RESPONSE${NC}"
    echo ""
fi

TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test unauthorized access
echo -e "${BLUE}🚫 Testing Unauthorized Access...${NC}"
UNAUTHORIZED_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "unauthorized test"}' -o /dev/null)

if [ "$UNAUTHORIZED_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ PASS: Unauthorized access properly blocked${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Unauthorized access not blocked (status: $UNAUTHORIZED_RESPONSE)${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

# Final results
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "=================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Total:  ${BLUE}$TESTS_TOTAL${NC}"

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ IRENO Chatbot System is working correctly${NC}"
    exit 0
else
    TESTS_FAILED=$((TESTS_TOTAL - TESTS_PASSED))
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi