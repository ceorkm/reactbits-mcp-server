#!/usr/bin/env node
import { GitHubService } from './dist/services/GitHubService.js';

const github = new GitHubService(process.env.GITHUB_TOKEN);

async function explore() {
  console.log('Exploring ReactBits GitHub repository structure...\n');
  
  try {
    // List src directory
    console.log('1. Contents of /src directory:');
    const srcFiles = await github.listFiles('src');
    srcFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.type})`);
    });
    
    // Look for components
    const componentsDirs = srcFiles.filter(f => 
      f.type === 'dir' && f.name.toLowerCase().includes('component')
    );
    
    if (componentsDirs.length > 0) {
      console.log('\n2. Found components directories:');
      for (const dir of componentsDirs) {
        console.log(`\n   Contents of ${dir.path}:`);
        const contents = await github.listFiles(dir.path);
        contents.slice(0, 10).forEach(file => {
          console.log(`   - ${file.name}`);
        });
      }
    }
    
    // Check for common component locations
    console.log('\n3. Checking common locations:');
    const locations = ['src/components', 'components', 'lib/components'];
    for (const loc of locations) {
      try {
        const files = await github.listFiles(loc);
        console.log(`\n   Found ${loc}:`);
        files.slice(0, 5).forEach(f => console.log(`   - ${f.name}`));
      } catch (e) {
        console.log(`   ${loc}: Not found`);
      }
    }
    
    // Search for any .tsx or .jsx files
    console.log('\n4. Searching for component files:');
    const searchResults = await github.searchComponents('tsx OR jsx');
    console.log(`   Found ${searchResults.length} component files`);
    searchResults.slice(0, 10).forEach(path => {
      console.log(`   - ${path}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

explore();