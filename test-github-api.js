#!/usr/bin/env node
import { GitHubService } from './dist/services/GitHubService.js';

const github = new GitHubService(process.env.GITHUB_TOKEN);

async function test() {
  console.log('Testing GitHub API directly...\n');
  
  try {
    // Test rate limit
    console.log('1. Checking GitHub API rate limit:');
    const rateLimit = await github.getRateLimit();
    console.log(`   Limit: ${rateLimit.limit}`);
    console.log(`   Remaining: ${rateLimit.remaining}`);
    console.log(`   Reset: ${rateLimit.reset}\n`);
    
    // Test listing files
    console.log('2. Listing root directory:');
    const files = await github.listFiles('');
    console.log(`   Found ${files.length} items:`);
    files.slice(0, 10).forEach(file => {
      console.log(`   - ${file.name} (${file.type})`);
    });
    console.log('\n');
    
    // Try to find components directory
    console.log('3. Looking for components directory:');
    const componentsDirs = files.filter(f => 
      f.type === 'dir' && 
      (f.name.includes('component') || f.name === 'src' || f.name === 'app')
    );
    console.log(`   Found directories: ${componentsDirs.map(d => d.name).join(', ')}\n`);
    
    // Search for splash-cursor
    console.log('4. Searching for splash-cursor component:');
    const searchResults = await github.searchComponents('splash-cursor');
    console.log(`   Found ${searchResults.length} results:`);
    searchResults.forEach(path => {
      console.log(`   - ${path}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

test();