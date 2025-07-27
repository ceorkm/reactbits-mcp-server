#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ReactBitsService } from './services/ReactBitsService.js';
import { ComponentListOptions, ComponentSearchOptions } from './types/index.js';

const server = new Server(
  {
    name: 'reactbits-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const reactBitsService = new ReactBitsService();

// Define available tools
const tools: Tool[] = [
  {
    name: 'list_components',
    description: 'List all available ReactBits components with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., animations, backgrounds, buttons)',
        },
        style: {
          type: 'string',
          enum: ['css', 'tailwind', 'default'],
          description: 'Filter by styling method',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of components to return',
        },
      },
    },
  },
  {
    name: 'get_component',
    description: 'Get the source code for a specific ReactBits component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the component (e.g., "splash-cursor", "pixel-card")',
        },
        style: {
          type: 'string',
          enum: ['css', 'tailwind', 'default'],
          description: 'Preferred styling method (defaults to available)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'search_components',
    description: 'Search for ReactBits components by name or description',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        category: {
          type: 'string',
          description: 'Filter by category',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_component_demo',
    description: 'Get usage example and demo code for a ReactBits component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the component',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_categories',
    description: 'List all available component categories',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components': {
        const options: ComponentListOptions = {
          category: args?.category as string,
          style: args?.style as any,
          limit: args?.limit as number,
        };
        const components = await reactBitsService.listComponents(options);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(components, null, 2),
            },
          ],
        };
      }

      case 'get_component': {
        const componentName = args?.name as string;
        const style = args?.style as any;
        
        if (!componentName) {
          throw new Error('Component name is required');
        }

        const component = await reactBitsService.getComponent(componentName, style);
        return {
          content: [
            {
              type: 'text',
              text: component,
            },
          ],
        };
      }

      case 'search_components': {
        const searchOptions: ComponentSearchOptions = {
          query: args?.query as string,
          category: args?.category as string,
          limit: args?.limit as number,
        };

        if (!searchOptions.query) {
          throw new Error('Search query is required');
        }

        const results = await reactBitsService.searchComponents(searchOptions);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_component_demo': {
        const componentName = args?.name as string;
        
        if (!componentName) {
          throw new Error('Component name is required');
        }

        const demo = await reactBitsService.getComponentDemo(componentName);
        return {
          content: [
            {
              type: 'text',
              text: demo,
            },
          ],
        };
      }

      case 'list_categories': {
        const categories = await reactBitsService.listCategories();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(categories, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ReactBits MCP Server started successfully');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});