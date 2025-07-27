# Testing ReactBits MCP Server with Real Clients

## 1. Claude Desktop

### Setup Instructions:

1. **Copy the configuration** to Claude Desktop's config location:
   ```bash
   cp claude-desktop-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Update the GitHub token** (optional but recommended):
   - Edit the config file and replace `your_github_token_here` with your actual token
   - Or remove the env section to use without a token (60 requests/hour limit)

3. **Restart Claude Desktop** to load the new configuration

### Test Commands to Try:

Once configured, try these prompts in Claude Desktop:

```
"Use the ReactBits MCP server to show me all available animation components"
```

```
"Get the source code for the splash-cursor component from ReactBits"
```

```
"Search for all text animation components in ReactBits"
```

```
"Show me how to use the aurora background component"
```

## 2. VS Code with Continue Extension

### Setup Instructions:

1. Install the Continue extension in VS Code
2. Add to your VS Code settings.json:

```json
{
  "continue.server": {
    "mcpServers": {
      "reactbits": {
        "command": "node",
        "args": ["/Users/femi/reactbits-mcp-server/dist/index.js"],
        "env": {
          "GITHUB_TOKEN": "your_github_token_here"
        }
      }
    }
  }
}
```

## 3. Cursor IDE

### Setup Instructions:

Add to your Cursor settings or `.cursorrules`:

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "node",
      "args": ["/Users/femi/reactbits-mcp-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

## Testing Checklist

- [ ] Claude Desktop recognizes the MCP server
- [ ] Can list all components
- [ ] Can fetch component source code
- [ ] Can search for components
- [ ] Can get component demos
- [ ] Error handling works properly
- [ ] Rate limiting messages appear when needed

## Expected Behaviors

### Successful Connection:
- The MCP server should appear in the client's available tools
- Commands should return formatted component data

### Rate Limiting:
- Without GitHub token: Limited to 60 requests/hour
- With GitHub token: Up to 5,000 requests/hour
- Server falls back to web scraping when rate limited

### Component Data:
- All 135 components should be accessible
- Components show correct metadata (name, category, style support)
- Source code retrieval works (when not rate limited)