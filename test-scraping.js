#!/usr/bin/env node
import axios from 'axios';
import * as cheerio from 'cheerio';

async function testScraping() {
  console.log('Testing ReactBits scraping...\n');
  
  try {
    // Test fetching a component page
    const url = 'https://reactbits.dev/components/splash-cursor';
    console.log(`Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ReactBitsMCP/1.0)'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Look for code blocks
    console.log('\nSearching for code blocks...');
    let foundCode = false;
    
    // Strategy 1: Look for pre/code elements
    $('pre code').each((index, element) => {
      const code = $(element).text().trim();
      if (code.length > 50) {
        console.log(`Found code block #${index + 1} (${code.length} chars)`);
        console.log(code.substring(0, 200) + '...\n');
        foundCode = true;
      }
    });
    
    // Strategy 2: Look for script tags with component data
    $('script').each((index, element) => {
      const scriptContent = $(element).html() || '';
      if (scriptContent.includes('component') || scriptContent.includes('code')) {
        console.log(`Found script tag #${index + 1} with potential component data`);
        console.log(scriptContent.substring(0, 200) + '...\n');
      }
    });
    
    // Strategy 3: Look for data attributes
    $('[data-component], [data-code]').each((index, element) => {
      console.log(`Found element with data attribute: ${element.name}`);
      const attrs = Object.keys(element.attribs || {});
      console.log(`Attributes: ${attrs.join(', ')}\n`);
    });
    
    if (!foundCode) {
      console.log('No direct code blocks found. The site might be rendering code client-side.');
      console.log('\nPage structure analysis:');
      
      // Analyze page structure
      console.log(`- Title: ${$('title').text()}`);
      console.log(`- H1 tags: ${$('h1').length}`);
      console.log(`- Main content divs: ${$('div[class*="content"], div[class*="code"], div[class*="component"]').length}`);
      console.log(`- Buttons: ${$('button').length}`);
      console.log(`- Links: ${$('a').length}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testScraping();