#!/bin/bash

echo "🚀 Setting up ReactBits MCP Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build
if [ -d "dist" ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To test the server, run:"
echo "  node test-server.js"
echo ""
echo "To use with Claude Desktop, add this to your config:"
echo '  {
    "mcpServers": {
      "reactbits": {
        "command": "node",
        "args": ["'$(pwd)'/dist/index.js"]
      }
    }
  }'
echo ""
echo "For more information, see README.md"