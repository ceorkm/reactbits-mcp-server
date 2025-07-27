# ReactBits MCP Server Usage Examples

This document provides examples of how to use the ReactBits MCP Server with various AI assistants.

## Tool Usage Examples

### 1. List All Components

**Request:**
```
"Show me all available ReactBits components"
```

**Tool Called:** `list_components`

**Response Example:**
```json
[
  {
    "name": "Splash Cursor",
    "slug": "splash-cursor",
    "category": "animations",
    "hasCSS": true,
    "hasTailwind": true
  },
  {
    "name": "Threads",
    "slug": "threads",
    "category": "backgrounds",
    "hasCSS": true,
    "hasTailwind": true
  }
  // ... more components
]
```

### 2. Filter Components by Category

**Request:**
```
"Show me all background animation components"
```

**Tool Called:** `list_components` with `category: "backgrounds"`

**Response:** Lists only components in the backgrounds category

### 3. Get Component Source Code

**Request:**
```
"Show me the code for the glow button component"
```

**Tool Called:** `get_component` with `name: "glow-button"`

**Response:**
```javascript
import React from 'react';

const GlowButton = () => {
  return (
    <button className="relative px-6 py-3 font-bold text-white rounded-lg group">
      <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
      <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
      <span className="relative">Glow Button</span>
    </button>
  );
};

export default GlowButton;
```

### 4. Search for Components

**Request:**
```
"Find all card components with hover effects"
```

**Tool Called:** `search_components` with `query: "card"`

**Response:** Returns all components with "card" in the name or description

### 5. Get Component Demo

**Request:**
```
"Show me how to use the particle background component"
```

**Tool Called:** `get_component_demo` with `name: "particles"`

**Response:**
```javascript
// Demo for particles
import React from 'react';

import React from 'react';

const Particles = () => {
  return (
    <div className="relative p-4 rounded-lg">
      {/* Particles implementation */}
      <p>This is the Particles component from ReactBits</p>
    </div>
  );
};

export default Particles;

// Usage Example:
export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">particles Demo</h1>
      <particles />
    </div>
  );
}
```

### 6. List Categories

**Request:**
```
"What types of components are available?"
```

**Tool Called:** `list_categories`

**Response:**
```json
[
  "Animations",
  "Backgrounds", 
  "Buttons",
  "Cards",
  "Text Animations",
  "Components",
  "Navigation"
]
```

## Common Use Cases

### Building a Landing Page

```
User: "I need components for a modern landing page with animated background and glowing buttons"

Assistant uses:
1. list_components(category: "backgrounds") - to find background options
2. get_component(name: "particles") - to get particle background code
3. get_component(name: "glow-button") - to get glowing button code
```

### Creating an Interactive UI

```
User: "Show me interactive card components with hover effects"

Assistant uses:
1. search_components(query: "card") - to find all card components
2. get_component(name: "hover-card", style: "tailwind") - to get Tailwind version
3. get_component_demo(name: "hover-card") - to show usage example
```

### Exploring Animation Options

```
User: "What text animation effects are available?"

Assistant uses:
1. list_components(category: "text-animations") - to list all text animations
2. get_component(name: "blur-text") - to show specific implementation
```

## Style Preferences

The server supports both CSS and Tailwind versions of components:

### CSS Version
```
get_component(name: "button", style: "css")
```

### Tailwind Version
```
get_component(name: "button", style: "tailwind")
```

### Default (Auto-select)
```
get_component(name: "button")
// Returns Tailwind version if available, otherwise CSS
```

## Integration Tips

1. **Component Discovery**: Start with `list_categories` or `list_components` to explore available options
2. **Filtering**: Use category and style filters to narrow down results
3. **Search**: Use `search_components` for keyword-based discovery
4. **Implementation**: Get source code with `get_component` and demos with `get_component_demo`
5. **Customization**: Components are designed to be easily customizable - modify colors, sizes, and animations as needed