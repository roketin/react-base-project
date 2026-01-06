#!/bin/bash

# Dev Tools Module - Uninstallation Script
# This script removes the dev-tools module from your project

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Uninstalling Dev Tools Module...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Remove @faker-js/faker dependency
echo -e "${YELLOW}Removing @faker-js/faker...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm remove @faker-js/faker 2>/dev/null || true
elif command -v yarn &> /dev/null; then
  yarn remove @faker-js/faker 2>/dev/null || true
else
  npm uninstall @faker-js/faker 2>/dev/null || true
fi

# Find and list files that import from dev-tools
echo ""
echo -e "${YELLOW}Searching for files that import from dev-tools...${NC}"
echo ""

IMPORT_FILES=$(grep -rl "@/modules/dev-tools\|from ['\"].*dev-tools" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "src/modules/dev-tools" || true)

if [ -n "$IMPORT_FILES" ]; then
  echo -e "${YELLOW}The following files import from dev-tools and need manual cleanup:${NC}"
  echo ""
  echo "$IMPORT_FILES" | while read -r file; do
    echo "  - $file"
  done
  echo ""
  echo "Please remove the following from these files:"
  echo "  - import { DevToolsProvider, DevToolbar } from '@/modules/dev-tools';"
  echo "  - import { useDevFormRegistry } from '@/modules/dev-tools';"
  echo "  - <DevToolsProvider> wrapper"
  echo "  - <DevToolbar /> component"
  echo "  - useDevFormRegistry() hook calls"
else
  echo -e "${GREEN}No files found importing from dev-tools outside the module.${NC}"
fi

echo ""
read -p "Do you want to delete the dev-tools module directory? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -d "src/modules/dev-tools" ]; then
    rm -rf src/modules/dev-tools
    echo -e "${GREEN}✓ Deleted src/modules/dev-tools${NC}"
  fi
else
  echo -e "${YELLOW}Skipped deleting dev-tools directory.${NC}"
fi

echo ""
echo -e "${GREEN}✓ Dev Tools Module uninstallation complete!${NC}"
echo ""
echo "Remember to:"
echo "  1. Remove DevToolsProvider and DevToolbar from your layout"
echo "  2. Remove useDevFormRegistry calls from your forms"
echo "  3. Run your build to verify no broken imports"
echo ""
