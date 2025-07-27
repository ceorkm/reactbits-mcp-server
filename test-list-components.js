#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Testing ReactBits MCP Server Component Listing...\n');

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env
  }
});

// Collect stderr for debugging
let errorLog = '';
server.stderr.on('data', (data) => {
  errorLog += data.toString();
});

// Handle server stdout
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
          console.log('\n✅ List components successful!');
          const components = JSON.parse(message.result.content[0].text);
          console.log(`\nTotal components: ${components.length}`);
          console.log('\nFirst 10 components:');
          console.log('=' .repeat(50));
          components.slice(0, 10).forEach(comp => {
            console.log(`• ${comp.name} (${comp.category})`);
            console.log(`  Slug: ${comp.slug}`);
            console.log(`  Styles: ${comp.hasTailwind ? 'Tailwind' : ''} ${comp.hasCSS ? 'CSS' : ''}`);
          });
          console.log('=' .repeat(50));
        } else if (message.id === 3) {
          console.log('\n✅ List categories successful!');
          const categories = JSON.parse(message.result.content[0].text);
          console.log('\nAvailable categories:');
          categories.forEach(cat => console.log(`• ${cat}`));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
});

// Initialize
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
  console.log('🔍 Testing list_components (all components)...');
  const listRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'list_components',
      arguments: {}
    },
    id: 2
  };
  server.stdin.write(JSON.stringify(listRequest) + '\n');
}, 500);

// Test list_categories
setTimeout(() => {
  console.log('\n🔍 Testing list_categories...');
  const categoriesRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'list_categories',
      arguments: {}
    },
    id: 3
  };
  server.stdin.write(JSON.stringify(categoriesRequest) + '\n');
}, 1000);

// Clean up
setTimeout(() => {
  console.log('\n📋 Debug Log:');
  console.log('-'.repeat(50));
  console.log(errorLog);
  console.log('-'.repeat(50));
  console.log('\nTest complete!');
  server.kill();
  process.exit(0);
}, 2000);