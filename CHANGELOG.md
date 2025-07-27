# Changelog

## [1.1.1] - 2025-07-27

### Fixed
- Fixed runtime error "component-health.json not found" by inlining the data
- MCP server now starts correctly with npx

## [1.1.0] - 2025-07-27

### Added
- Component health status system with quality scores
- Warning messages for incomplete components (buttons, forms, loaders)
- Dependency information for each component
- Component status in list_components response
- Comprehensive quality documentation in README

### Changed
- Updated component responses to include quality and status information
- Enhanced error messages for placeholder components
- Improved documentation with component quality warnings

### Fixed
- Binary name consistency in package.json

## [1.0.0] - 2025-07-27

### Initial Release
- 135 ReactBits components mapped across 7 categories
- 5 MCP tools: list_components, get_component, search_components, get_component_demo, list_categories
- GitHub API integration for real-time component fetching
- Intelligent caching system
- TypeScript support
- Full documentation and examples
EOF < /dev/null