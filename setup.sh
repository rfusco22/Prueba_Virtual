#!/bin/bash

# Output Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}     FuscoNotes - Notes App${NC}"
echo -e "${BLUE}==================================${NC}\n"

# 1. Check/Install Homebrew (Required to install MySQL automatically)
if ! command -v brew &> /dev/null; then
    echo -e "${BLUE}Installing Homebrew to manage MySQL...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# 2. Check/Install MySQL
echo -e "${BLUE}Verifying MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${BLUE}Installing MySQL Server...${NC}"
    brew install mysql
    brew services start mysql
    echo -e "${GREEN}✓ MySQL installed and running${NC}"
else
    echo -e "${GREEN}✓ MySQL is already installed${NC}"
    brew services start mysql
fi

# Wait for MySQL to wake up
echo -e "${BLUE}Waiting for MySQL to be ready...${NC}"
sleep 5

# 3. Configure Database automatically
echo -e "${BLUE}Configuring 'notes_app' Database...${NC}"
# Attempting to create the database (assuming root has no password by default on new installs)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS notes_app; GRANT ALL PRIVILEGES ON notes_app.* TO 'root'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database configured successfully${NC}\n"
else
    echo -e "${RED}⚠ Note: If you have a MySQL password, please create the DB manually:${NC}"
    echo "mysql -u root -p -e 'CREATE DATABASE notes_app;'"
fi

# 4. Backend Setup
echo -e "${BLUE}=== Configuring Backend ===${NC}"
if [ -d "backend" ]; then
    cd backend
    npm install --legacy-peer-deps
    cd ..
else
    echo -e "${RED}❌ 'backend' folder not found${NC}"
    exit 1
fi

# 5. Frontend Setup
echo -e "${BLUE}=== Configuring Frontend ===${NC}"
if [ -d "Frontend" ]; then
    cd Frontend
    npm install --legacy-peer-deps
    cd ..
else
    echo -e "${RED}❌ 'Frontend' folder not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}   ✓ EVERYTHING IS READY TO START${NC}"
echo -e "${GREEN}==================================${NC}\n"

echo -e "${BLUE}To run the App:${NC}"
echo -e "1. Backend: ${GREEN}cd backend && npm run start:dev${NC}"
echo -e "2. Frontend: ${GREEN}cd Frontend && npm run dev${NC}"
