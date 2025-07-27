#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🚀 Quick ReactBits MCP Server Test\n');

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

let messageBuffer = '';
let testsPassed = 0;
const totalTests = 3;

server.stdout.on('data', (data) => {
  messageBuffer += data.toString();
  const lines = messageBuffer.split('\n');
  messageBuffer = lines.pop() || '';
  
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const message = JSON.parse(line);
        if (message.result) {
          testsPassed++;
          console.log(`✅ Test ${testsPassed}/${totalTests} passed`);
          
          if (testsPassed === totalTests) {
            console.log('\n🎉 All tests passed! Server is ready for MCP clients.');
            server.kill();
            process.exit(0);
          }
        }
      } catch (e) {}
    }
  });
});

server.stderr.on('data', (data) => {
  if (data.toString().includes('started successfully')) {
    console.log('✅ Server started successfully\n');
  }
});

// Send test commands
const commands = [
  { method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } }, id: 1 },
  { method: 'tools/list', params: {}, id: 2 },
  { method: 'tools/call', params: { name: 'list_categories', arguments: {} }, id: 3 }
];

commands.forEach((cmd, index) => {
  setTimeout(() => {
    server.stdin.write(JSON.stringify(cmd) + '\n');
  }, 500 * (index + 1));
});

setTimeout(() => {
  console.log('\n❌ Test timed out');
  server.kill();
  process.exit(1);
}, 5000);