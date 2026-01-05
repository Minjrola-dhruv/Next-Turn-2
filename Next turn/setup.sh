#!/bin/bash

# 🚀 Next Turn - Automated Setup Script
# This script sets up everything automatically!

echo "🎉 Next Turn - Zero Headache Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if already initialized
if [ -d .git ]; then
    echo -e "${YELLOW}⚠️  Git repository already exists${NC}"
else
    echo -e "${BLUE}🔧 Step 2: Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Next Turn platform with automated deployment"
    git branch -M main
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi
echo ""

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Create a GitHub repository at: https://github.com/new"
echo "   Name: nextturn (or whatever you like)"
echo ""
echo "2. Connect to GitHub:"
echo -e "${YELLOW}   git remote add origin https://github.com/YOUR_USERNAME/nextturn.git${NC}"
echo -e "${YELLOW}   git push -u origin main${NC}"
echo ""
echo "3. Follow the guide in ZERO_SETUP.md to:"
echo "   - Add GitHub secrets"
echo "   - Set up automatic deployment"
echo ""
echo -e "${GREEN}After that, just 'git push' and everything works automatically! 🚀${NC}"
echo ""
