import axios from 'axios';
import * as cheerio from 'cheerio';
import { ComponentContent, ComponentStyle } from '../types/index.js';

export class ReactBitsScraper {
  private baseUrl = 'https://reactbits.dev';
  
  async fetchComponentPage(componentSlug: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/components/${componentSlug}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ReactBitsMCP/1.0)'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Try alternative paths
        const altPaths = [
          `/text-animations/${componentSlug}`,
          `/animations/${componentSlug}`,
          `/backgrounds/${componentSlug}`,
          `/buttons/${componentSlug}`,
          `/cards/${componentSlug}`,
          `/navigation/${componentSlug}`,
          `/${componentSlug}`
        ];
        
        for (const path of altPaths) {
          try {
            const response = await axios.get(`${this.baseUrl}${path}`);
            return response.data;
          } catch (e) {
            // Continue trying other paths
          }
        }
      }
      throw new Error(`Component "${componentSlug}" not found`);
    }
  }

  async getComponentCode(componentSlug: string, style?: ComponentStyle): Promise<ComponentContent> {
    const html = await this.fetchComponentPage(componentSlug);
    const $ = cheerio.load(html);
    
    // ReactBits stores code in script tags with specific IDs
    // Look for code blocks in the page
    const codeBlocks: { [key: string]: string } = {};
    
    // Find all code elements
    $('pre code').each((index, element) => {
      const code = $(element).text().trim();
      const parent = $(element).parent();
      const prevText = parent.prev().text().toLowerCase();
      
      // Try to identify if this is CSS or JS/TS code
      if (prevText.includes('css') || code.includes('.css') || code.includes('style')) {
        codeBlocks.css = code;
      } else if (prevText.includes('tailwind') || code.includes('className=')) {
        codeBlocks.tailwind = code;
      } else if (code.includes('import React') || code.includes('export default')) {
        if (!codeBlocks.default) {
          codeBlocks.default = code;
        }
      }
    });

    // If no code blocks found, try parsing from inline scripts
    $('script').each((index, element) => {
      const scriptContent = $(element).html() || '';
      if (scriptContent.includes('__COMPONENT_CODE__') || scriptContent.includes('componentCode')) {
        try {
          // Extract code from script variables
          const matches = scriptContent.match(/(?:const|let|var)\s+\w+\s*=\s*`([^`]+)`/g);
          if (matches) {
            matches.forEach(match => {
              const code = match.match(/`([^`]+)`/)?.[1] || '';
              if (code.includes('className=')) {
                codeBlocks.tailwind = code;
              } else if (code.includes('.css') || code.includes('style=')) {
                codeBlocks.css = code;
              }
            });
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });

    // Fallback: Create a basic component structure
    if (Object.keys(codeBlocks).length === 0) {
      const componentName = componentSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      codeBlocks.default = `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="relative">
      {/* Implementation for ${componentName} */}
      {/* Visit https://reactbits.dev/components/${componentSlug} for full implementation */}
    </div>
  );
};

export default ${componentName};`;
    }

    // Determine which version to return
    const preferredStyle = style || 'default';
    const code = codeBlocks[preferredStyle] || codeBlocks.tailwind || codeBlocks.css || codeBlocks.default || '';

    // Extract imports and dependencies
    const imports = this.extractImports(code);
    const dependencies = this.extractDependencies(code);

    return {
      code,
      style: preferredStyle,
      imports,
      dependencies
    };
  }

  private extractImports(code: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      if (match[1] && !match[1].startsWith('.')) {
        imports.push(match[1]);
      }
    }
    
    return [...new Set(imports)];
  }

  private extractDependencies(code: string): string[] {
    const dependencies: string[] = [];
    const imports = this.extractImports(code);
    
    // Common React ecosystem packages
    const knownPackages = [
      'framer-motion',
      'react-spring',
      'gsap',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'clsx',
      'tailwind-merge'
    ];
    
    imports.forEach(imp => {
      if (knownPackages.some(pkg => imp.startsWith(pkg))) {
        dependencies.push(imp.split('/')[0]);
      }
    });
    
    return [...new Set(dependencies)];
  }

  async getComponentMetadata(componentSlug: string): Promise<any> {
    const html = await this.fetchComponentPage(componentSlug);
    const $ = cheerio.load(html);
    
    // Extract component title
    const title = $('h1').first().text().trim() || componentSlug;
    
    // Extract description
    const description = $('p').first().text().trim() || '';
    
    // Extract props table if available
    const props: any[] = [];
    $('table').each((index, table) => {
      const headers = $(table).find('th').map((i, el) => $(el).text().trim()).get();
      if (headers.includes('Property') || headers.includes('Prop')) {
        $(table).find('tbody tr').each((i, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            props.push({
              name: $(cells[0]).text().trim(),
              type: $(cells[1]).text().trim(),
              default: cells.length > 2 ? $(cells[2]).text().trim() : undefined,
              description: cells.length > 3 ? $(cells[3]).text().trim() : undefined
            });
          }
        });
      }
    });
    
    return {
      title,
      description,
      props,
      slug: componentSlug,
      url: `${this.baseUrl}/components/${componentSlug}`
    };
  }
}