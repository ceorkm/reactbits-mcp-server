#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Testing ReactBits MCP Server Component Retrieval...\n');

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Handle server stderr (logs)
server.stderr.on('data', (data) => {
  console.error(`[Server Log] ${data.toString().trim()}`);
});

// Handle server stdout (JSON-RPC messages)
let messageBuffer = '';
server.stdout.on('data', (data) => {
  messageBuffer += data.toString();
  const lines = messageBuffer.split('\n');
  messageBuffer = lines.pop() || '';
  
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const message = JSON.parse(line);
        if (message.id === 2) {
          console.log('\nComponent List (first 5):');
          const components = JSON.parse(message.result.content[0].text);
          components.slice(0, 5).forEach(comp => {
            console.log(`- ${comp.name} (${comp.category})`);
          });
        } else if (message.id === 3) {
          console.log('\nComponent Code:');
          console.log(message.result.content[0].text);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
});

// Send initialization
const initRequest = {
  jsonrpc: '2.0',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' }
  },
  id: 1
};

server.stdin.write(JSON.stringify(initRequest) + '\n');

// Test list_components
setTimeout(() => {
  console.log('Testing list_components with category filter...');
  const listRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'list_components',
      arguments: { category: 'backgrounds', limit: 5 }
    },
    id: 2
  };
  server.stdin.write(JSON.stringify(listRequest) + '\n');
}, 500);

// Test get_component
setTimeout(() => {
  console.log('\nTesting get_component for "glow-button"...');
  const getRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'get_component',
      arguments: { name: 'glow-button', style: 'tailwind' }
    },
    id: 3
  };
  server.stdin.write(JSON.stringify(getRequest) + '\n');
}, 1000);

// Clean up
setTimeout(() => {
  console.log('\nTest complete!');
  server.kill();
  process.exit(0);
}, 2000);