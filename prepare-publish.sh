#!/bin/bash

echo "🚀 Preparing ReactBits MCP Server for npm publish"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
node test-list-components.js > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "⚠️  Tests failed but continuing..."
fi

# Check npm login
echo ""
echo "📦 Checking npm authentication..."
npm whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Not logged in to npm. Please run: npm login"
    exit 1
else
    echo "✅ Logged in as: $(npm whoami)"
fi

echo ""
echo "✅ Ready to publish!"
echo ""
echo "To publish, run:"
echo "  npm publish --access public"
echo ""
echo "Or to do a dry run first:"
echo "  npm publish --dry-run --access public"