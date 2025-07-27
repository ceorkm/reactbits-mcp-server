#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Testing ReactBits MCP Server with Real Data...\n');

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
          console.log('\n✅ Tool call successful!');
          const code = message.result.content[0].text;
          console.log('\nComponent Code Preview:');
          console.log('=' .repeat(50));
          console.log(code.split('\n').slice(0, 20).join('\n'));
          console.log('...');
          console.log('=' .repeat(50));
          console.log(`\nTotal lines: ${code.split('\n').length}`);
          console.log(`Contains "import React": ${code.includes('import React')}`);
          console.log(`Contains "className": ${code.includes('className')}`);
          console.log(`Is mock data: ${code.includes('This is the') && code.includes('component from ReactBits')}`);
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

// Test get_component with a real component
setTimeout(() => {
  console.log('🔍 Testing get_component for "splash-cursor"...');
  const getRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'get_component',
      arguments: { 
        name: 'splash-cursor',
        style: 'tailwind'
      }
    },
    id: 2
  };
  server.stdin.write(JSON.stringify(getRequest) + '\n');
}, 500);

// Clean up and show logs
setTimeout(() => {
  console.log('\n📋 Debug Log:');
  console.log('-'.repeat(50));
  console.log(errorLog);
  console.log('-'.repeat(50));
  console.log('\nTest complete!');
  server.kill();
  process.exit(0);
}, 3000);