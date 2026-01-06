#!/bin/bash

# Dev Tools Module - Installation Script
# This script installs the dev-tools module into your project

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Installing Dev Tools Module...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Check if dev-tools module exists
if [ ! -d "src/modules/dev-tools" ]; then
  echo -e "${RED}Error: src/modules/dev-tools directory not found.${NC}"
  exit 1
fi

# Install @faker-js/faker as dev dependency
echo -e "${YELLOW}Installing @faker-js/faker...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm add -D @faker-js/faker
elif command -v yarn &> /dev/null; then
  yarn add -D @faker-js/faker
else
  npm install -D @faker-js/faker
fi

# Check if app-layout.tsx exists and needs modification
LAYOUT_FILE="src/modules/app/components/layouts/app-layout.tsx"

if [ -f "$LAYOUT_FILE" ]; then
  # Check if DevToolsProvider is already imported
  if grep -q "DevToolsProvider" "$LAYOUT_FILE"; then
    echo -e "${GREEN}DevToolsProvider already integrated in app-layout.tsx${NC}"
  else
    echo -e "${YELLOW}Note: You need to manually integrate DevToolsProvider in your layout.${NC}"
    echo ""
    echo "Add to your layout file:"
    echo ""
    echo "  import { DevToolsProvider, DevToolbar } from '@/modules/dev-tools';"
    echo ""
    echo "  // Wrap your layout content:"
    echo "  <DevToolsProvider>"
    echo "    {/* your layout content */}"
    echo "    <DevToolbar />"
    echo "  </DevToolsProvider>"
  fi
fi

echo ""
echo -e "${GREEN}✓ Dev Tools Module installed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Create faker configs in src/modules/dev-tools/faker-configs/"
echo "  2. Register forms using useDevFormRegistry hook"
echo "  3. Run your dev server to see the floating toolbar"
echo ""
