#!/usr/bin/env node
import { spawn } from 'child_process';
import { createInterface } from 'readline';

console.log('Testing ReactBits MCP Server...\n');

// Start the MCP server
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle server stderr (logs)
server.stderr.on('data', (data) => {
  console.error(`[Server Log] ${data.toString().trim()}`);
});

// Handle server stdout (JSON-RPC messages)
server.stdout.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('Response:', JSON.stringify(message, null, 2));
  } catch (e) {
    // Handle non-JSON output
    console.log('Server output:', data.toString());
  }
});

// Send initialization request
const initRequest = {
  jsonrpc: '2.0',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  },
  id: 1
};

console.log('Sending initialization request...');
server.stdin.write(JSON.stringify(initRequest) + '\n');

// After initialization, send a test request
setTimeout(() => {
  console.log('\nSending list_tools request...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  };
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1000);

// Send a test tool call
setTimeout(() => {
  console.log('\nTesting list_categories tool...');
  const toolCallRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'list_categories',
      arguments: {}
    },
    id: 3
  };
  server.stdin.write(JSON.stringify(toolCallRequest) + '\n');
}, 2000);

// Clean up
setTimeout(() => {
  console.log('\nTest complete. Shutting down server...');
  server.kill();
  rl.close();
  process.exit(0);
}, 3000);

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});