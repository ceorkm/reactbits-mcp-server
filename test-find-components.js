#!/usr/bin/env node
import { GitHubService } from './dist/services/GitHubService.js';

const github = new GitHubService(process.env.GITHUB_TOKEN);

async function findComponents() {
  console.log('Finding ReactBits components...\n');
  
  try {
    // Check the different component directories
    const componentDirs = ['src/tailwind', 'src/ts-tailwind', 'src/ts-default'];
    
    for (const dir of componentDirs) {
      console.log(`\nExploring ${dir}:`);
      try {
        const contents = await github.listFiles(dir);
        const subdirs = contents.filter(f => f.type === 'dir');
        
        console.log(`Found ${subdirs.length} subdirectories:`);
        subdirs.forEach(subdir => {
          console.log(`  - ${subdir.name}/`);
        });
        
        // Check one level deeper
        for (const subdir of subdirs.slice(0, 3)) {
          console.log(`\n  Contents of ${subdir.path}:`);
          const files = await github.listFiles(subdir.path);
          files.slice(0, 5).forEach(f => {
            console.log(`    - ${f.name}`);
          });
        }
      } catch (e) {
        console.log(`  Error: ${e.message}`);
      }
    }
    
    // Look specifically for splash-cursor
    console.log('\n\nSearching for splash-cursor:');
    const paths = [
      'src/tailwind/Animations/SplashCursor',
      'src/ts-tailwind/Animations/SplashCursor',
      'src/components/animations/splash-cursor',
      'src/demo/animations/splash-cursor'
    ];
    
    for (const path of paths) {
      try {
        const files = await github.listFiles(path);
        console.log(`\nFound ${path}:`);
        files.forEach(f => console.log(`  - ${f.name}`));
      } catch (e) {
        console.log(`${path}: Not found`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findComponents();