# Publishing Guide

## Prerequisites

1. **npm Account**: Create one at https://www.npmjs.com/signup
2. **Login**: Run `npm login` and enter your credentials
3. **GitHub Repository**: Push code to GitHub repository
4. **GitHub Token**: Set up NPM_TOKEN secret in GitHub repository settings

## First-Time Setup

1. **Check npm availability**:
   ```bash
   npm view reactbits-dev-mcp-server
   ```
   If the package doesn't exist, you're good to go!

2. **Verify build**:
   ```bash
   npm run clean
   npm run build
   npm test
   ```

3. **Dry run** (see what will be published):
   ```bash
   npm publish --dry-run --access public
   ```

## Publishing Process

### Manual Publishing

1. **Update version** in package.json
2. **Update CHANGELOG.md** with changes
3. **Run publish preparation**:
   ```bash
   ./prepare-publish.sh
   ```
4. **Publish to npm**:
   ```bash
   npm publish --access public
   ```

### Automated Publishing (GitHub Actions)

1. **Create a release** on GitHub
2. GitHub Actions will automatically:
   - Build the project
   - Run tests
   - Publish to npm

## Post-Publish

1. **Verify installation works**:
   ```bash
   npx reactbits-dev-mcp-server
   ```

2. **Test with MCP client**:
   - Update Claude Desktop config
   - Restart Claude
   - Test the tools

3. **Announce** (optional):
   - Tweet about it
   - Post in MCP community
   - Update ReactBits.dev

## Version Guidelines

- **Major (1.0.0)**: Breaking changes
- **Minor (1.1.0)**: New features, backward compatible
- **Patch (1.0.1)**: Bug fixes, backward compatible