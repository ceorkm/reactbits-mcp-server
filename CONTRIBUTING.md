# Contributing to ReactBits MCP Server

We love your input! We want to make contributing to ReactBits MCP Server as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/reactbits-mcp-server.git
cd reactbits-mcp-server

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test
```

## Project Structure

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
├── dist/                  # Compiled output (git-ignored)
├── test/                  # Test files
├── docs/                  # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Adding New Components

When ReactBits.dev adds new components, update the component metadata in `src/services/ReactBitsService.ts`:

```typescript
private componentMetadata: ComponentCategory[] = [
  {
    name: 'New Category',
    slug: 'new-category',
    components: [
      { 
        name: 'New Component', 
        slug: 'new-component', 
        category: 'new-category', 
        hasCSS: true, 
        hasTailwind: true 
      },
    ]
  },
  // ... existing categories
];
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Test with actual MCP clients when possible

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the package.json version following [SemVer](http://semver.org/).
3. The PR will be merged once you have the sign-off of at least one maintainer.

## Any contributions you make will be under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report bugs using GitHub's [issues](https://github.com/yourusername/reactbits-mcp-server/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/reactbits-mcp-server/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License.