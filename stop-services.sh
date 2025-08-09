#!/bin/bash

echo "🛑 Stopping IRENO Chatbot Services..."

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

echo -e "${BLUE}🔍 Checking running services...${NC}"

# Stop Python service
if check_port 5000; then
    echo -e "${YELLOW}🐍 Stopping Python LLM Service (port 5000)...${NC}"
    pkill -f "python.*app.py" 2>/dev/null
    sleep 2
    
    if check_port 5000; then
        echo -e "${RED}⚠️  Force killing Python service...${NC}"
        pkill -9 -f "python.*app.py" 2>/dev/null
        sleep 1
    fi
    
    if ! check_port 5000; then
        echo -e "${GREEN}✅ Python LLM Service stopped${NC}"
    else
        echo -e "${RED}❌ Failed to stop Python service${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  Python LLM Service is not running${NC}"
fi

# Stop Java backend
if check_port 8080; then
    echo -e "${YELLOW}☕ Stopping Java Backend (port 8080)...${NC}"
    pkill -f "spring-boot:run" 2>/dev/null
    pkill -f "ireno-advisor-backend" 2>/dev/null
    sleep 3
    
    if check_port 8080; then
        echo -e "${RED}⚠️  Force killing Java backend...${NC}"
        pkill -9 -f "spring-boot:run" 2>/dev/null
        pkill -9 -f "ireno-advisor-backend" 2>/dev/null
        sleep 1
    fi
    
    if ! check_port 8080; then
        echo -e "${GREEN}✅ Java Backend stopped${NC}"
    else
        echo -e "${RED}❌ Failed to stop Java backend${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  Java Backend is not running${NC}"
fi

# Clean up log files
echo -e "${BLUE}🧹 Cleaning up log files...${NC}"
rm -f python-service.log java-backend.log

# Check final status
echo ""
echo -e "${BLUE}📊 Final Status:${NC}"

if ! check_port 5000 && ! check_port 8080; then
    echo -e "${GREEN}✅ All services stopped successfully${NC}"
    echo -e "${GREEN}🎉 IRENO Chatbot Services are now offline${NC}"
else
    echo -e "${RED}⚠️  Some services may still be running:${NC}"
    if check_port 5000; then
        echo -e "${RED}  - Python service still on port 5000${NC}"
    fi
    if check_port 8080; then
        echo -e "${RED}  - Java backend still on port 8080${NC}"
    fi
    echo ""
    echo -e "${YELLOW}You may need to manually kill remaining processes:${NC}"
    echo "  sudo lsof -i :5000"
    echo "  sudo lsof -i :8080"
fi

echo ""