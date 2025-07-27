# ReactBits MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to [ReactBits.dev](https://reactbits.dev) components - a collection of 135+ animated React components for creative developers.

> ⚠️ **Important Note**: Some ReactBits components (buttons, forms, loaders) currently have incomplete implementations. See [Component Quality Status](#component-quality-status) below.

## Features

- 🎨 **Component Discovery**: Browse and search through all ReactBits components
- 🔍 **Smart Search**: Find components by name, category, or description
- 💅 **Style Options**: Access both CSS and Tailwind versions of components
- 📁 **Category Navigation**: Filter components by categories (animations, backgrounds, buttons, etc.)
- 🚀 **Fast Performance**: Built-in caching for optimal response times
- 📝 **Demo Generation**: Get usage examples and demo code for any component

## Installation

```bash
# Install globally
npm install -g reactbits-dev-mcp-server

# Or run directly with npx (no installation required)
npx reactbits-dev-mcp-server

# Or install as a dependency
npm install reactbits-dev-mcp-server
```

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/reactbits-mcp-server
cd reactbits-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## Configuration

### Claude Desktop

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "npx",
      "args": ["reactbits-dev-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### VS Code (with Continue extension)

Add to your VS Code settings:

```json
{
  "continue.server": {
    "mcpServers": {
      "reactbits": {
        "command": "npx",
        "args": ["reactbits-dev-mcp-server"]
      }
    }
  }
}
```

### Cursor

Add to your Cursor settings or `.cursorrules`:

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "npx",
      "args": ["reactbits-dev-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/reactbits-mcp-server
cd reactbits-mcp-server
npm install

# Build
npm run build

# Test locally
node test-list-components.js
```

## Available Tools

### `list_components`
List all available ReactBits components with optional filtering.

**Parameters:**
- `category` (optional): Filter by category (e.g., "animations", "backgrounds", "buttons")
- `style` (optional): Filter by styling method ("css", "tailwind", "default")
- `limit` (optional): Maximum number of components to return

**Example:**
```
"List all animation components with Tailwind support"
```

### `get_component`
Get the source code for a specific ReactBits component.

**Parameters:**
- `name` (required): Name of the component (e.g., "splash-cursor", "pixel-card")
- `style` (optional): Preferred styling method ("css", "tailwind", "default")

**Example:**
```
"Show me the source code for the splash cursor component"
```

### `search_components`
Search for ReactBits components by name or description.

**Parameters:**
- `query` (required): Search query
- `category` (optional): Filter by category
- `limit` (optional): Maximum number of results

**Example:**
```
"Find all components related to cards"
```

### `get_component_demo`
Get usage example and demo code for a ReactBits component.

**Parameters:**
- `name` (required): Name of the component

**Example:**
```
"Show me how to use the glow button component"
```

### `list_categories`
List all available component categories.

**Example:**
```
"What categories of components are available?"
```

## Usage Examples

### With AI Assistants

Once configured, you can ask your AI assistant questions like:

- "Show me all the background animation components from ReactBits"
- "I need a glowing button component - what's available?"
- "How do I implement the particle background effect?"
- "Find all text animation components that support Tailwind"
- "Show me the code for the glass morphism card component"

### Component Categories

ReactBits components are organized into the following categories:

- **Animations**: Dynamic cursor effects and interactive animations
- **Backgrounds**: Animated and static background patterns
- **Buttons**: Interactive button components with various effects
- **Cards**: Card components with hover effects and animations
- **Text Animations**: Animated text effects and reveals
- **Components**: General UI components and layouts
- **Navigation**: Navigation menus and interfaces

## Development

### Project Structure

```
reactbits-mcp-server/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── services/
│   │   └── ReactBitsService.ts   # Component fetching logic
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   └── utils/
│       └── CacheManager.ts # Caching utility
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Testing

```bash
# Run the MCP inspector for debugging
npx @modelcontextprotocol/inspector
```

## GitHub API Token (Optional but Recommended)

The server can work without a GitHub token but will be limited to 60 requests per hour. With a token, you get up to 5,000 requests per hour.

### Setting up a GitHub Token

1. Create a GitHub personal access token at https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - No special scopes needed (public repository access only)
   - Copy the generated token

2. Set it as an environment variable:

```bash
# Option 1: Export in your shell
export GITHUB_TOKEN=your_token_here

# Option 2: Create a .env file (copy from .env.example)
cp .env.example .env
# Edit .env and add your token

# Option 3: Pass when running the server
GITHUB_TOKEN=your_token_here npx reactbits-dev-mcp-server
```

**⚠️ Security Note**: Never commit your GitHub token to version control. Always use environment variables.

## Component Quality Status

Based on comprehensive testing, here's the current quality status of ReactBits components:

### ✅ Excellent Quality (9.0-10/10)
- **Backgrounds** (9.8/10): Aurora, Beams, Particles, etc. - Production-ready WebGL effects
- **Animations** (9.5/10): BlobCursor, SplashCursor, Magnet, etc. - Professional animations
- **Text Animations** (9.0/10): BlurText, CountUp, CircularText, etc. - Complete Framer Motion

### ⚠️ Incomplete Components (2.0/10)
- **Buttons**: All 8 button components return placeholder code
- **Forms**: All 3 form components are incomplete  
- **Loaders**: All 9 loader components are incomplete

### 📦 Dependencies

The MCP server now includes dependency information for each component:
- `framer-motion`: Text animations and interactive components
- `gsap`: Cursor animations and advanced interactions
- `three.js` / `@react-three/fiber`: 3D backgrounds and effects
- `ogl`: WebGL rendering (Aurora component)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ReactBits.dev](https://reactbits.dev) for the amazing component collection
- [Anthropic](https://anthropic.com) for the Model Context Protocol specification
- The MCP community for inspiration and examples

## Support

- 🐛 [Report Issues](https://github.com/yourusername/reactbits-mcp-server/issues)
- 💬 [Discussions](https://github.com/yourusername/reactbits-mcp-server/discussions)
- 📧 Contact: your-email@example.com