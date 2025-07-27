#!/usr/bin/env node
import { GitHubService } from './dist/services/GitHubService.js';

const github = new GitHubService(process.env.GITHUB_TOKEN);

async function testRealComponent() {
  console.log('Testing real component fetching from GitHub...\n');
  
  try {
    // Test fetching the SplashCursor component
    const componentPath = 'src/ts-tailwind/Animations/SplashCursor/SplashCursor.tsx';
    console.log(`Fetching: ${componentPath}`);
    
    const component = await github.getComponentFromGitHub(componentPath);
    
    console.log('\n✅ Successfully fetched component!');
    console.log(`\nComponent Analysis:`);
    console.log(`- Has Tailwind: ${component.hasTailwind}`);
    console.log(`- Has CSS: ${component.hasCSS}`);
    console.log(`- Dependencies: ${component.dependencies.join(', ') || 'none'}`);
    console.log(`- Code length: ${component.code.length} characters`);
    console.log(`- Lines: ${component.code.split('\n').length}`);
    
    console.log('\nFirst 20 lines of code:');
    console.log('='.repeat(60));
    console.log(component.code.split('\n').slice(0, 20).join('\n'));
    console.log('='.repeat(60));
    
    // Check if it's real code
    const isRealCode = component.code.includes('import') && 
                      !component.code.includes('This is the') &&
                      component.code.length > 500;
    
    console.log(`\n✅ Is real component code: ${isRealCode}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealComponent();