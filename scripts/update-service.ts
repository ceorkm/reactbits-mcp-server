#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

/**
 * Updates the ReactBitsService to use the auto-generated component registry
 */
async function updateServiceWithRegistry() {
  console.log('🔧 Updating ReactBitsService with component registry...\n');

  const servicePath = path.join(process.cwd(), 'src', 'services', 'ReactBitsService.ts');
  
  // Read the current service file
  const currentContent = await fs.readFile(servicePath, 'utf-8');
  
  // Create the updated service content
  const updatedContent = `import { CacheManager } from '../utils/CacheManager.js';
import { ReactBitsScraper } from './ReactBitsScraper.js';
import { GitHubService } from './GitHubService.js';
import { componentRegistry, componentPathMap } from '../data/component-mappings.js';
import type { ReactBitsComponent } from '../types/index.js';

export class ReactBitsService {
  private cache: CacheManager;
  private scraper: ReactBitsScraper;
  private github: GitHubService;

  constructor() {
    this.cache = new CacheManager();
    this.scraper = new ReactBitsScraper();
    
    // Use GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN || 
                       process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    this.github = new GitHubService(githubToken);
  }

  async listCategories(): Promise<string[]> {
    return componentRegistry.categories.map(cat => cat.name);
  }

  async listComponents(options: {
    category?: string;
    style?: 'css' | 'tailwind' | 'default';
    limit?: number;
  } = {}): Promise<ReactBitsComponent[]> {
    let components: ReactBitsComponent[] = [];

    // Use the auto-generated registry
    for (const category of componentRegistry.categories) {
      if (!options.category || category.slug === options.category) {
        components.push(...category.components.map(comp => ({
          ...comp,
          description: \`A \${comp.name} component from ReactBits\`
        })));
      }
    }

    // Filter by style if specified
    if (options.style) {
      components = components.filter(comp => {
        if (options.style === 'css') return comp.hasCSS;
        if (options.style === 'tailwind') return comp.hasTailwind;
        return true;
      });
    }

    // Apply limit
    if (options.limit && options.limit > 0) {
      components = components.slice(0, options.limit);
    }

    return components;
  }

  async searchComponents(options: {
    query: string;
    category?: string;
    limit?: number;
  }): Promise<ReactBitsComponent[]> {
    const query = options.query?.toLowerCase() || '';
    let components = await this.listComponents({ category: options.category });

    // Filter by search query
    components = components.filter(comp =>
      comp.name.toLowerCase().includes(query) ||
      comp.slug.toLowerCase().includes(query) ||
      comp.description?.toLowerCase().includes(query) ||
      comp.category.toLowerCase().includes(query)
    );

    // Apply limit
    if (options.limit && options.limit > 0) {
      components = components.slice(0, options.limit);
    }

    return components;
  }

  async getComponent(componentName: string, style?: 'css' | 'tailwind' | 'default'): Promise<string> {
    // Normalize component name to slug format
    const slug = componentName.toLowerCase().replace(/\\s+/g, '-');
    
    // Check cache first
    const cacheKey = \`component:\${slug}:\${style || 'default'}\`;
    const cached = this.cache.get<string>(cacheKey);
    if (cached) return cached;

    // Use the component path map
    const componentPath = componentPathMap[slug];
    
    if (!componentPath) {
      throw new Error(\`Component "\${componentName}" not found in registry\`);
    }

    try {
      console.error(\`Fetching \${slug} from GitHub at \${componentPath}...\`);
      const githubComponent = await this.github.getComponentFromGitHub(componentPath);
      
      if (githubComponent.code) {
        this.cache.set(cacheKey, githubComponent.code, 3600000);
        return githubComponent.code;
      }
    } catch (error) {
      console.error(\`Failed to fetch \${slug} from GitHub:\`, error);
      
      // Fallback to web scraping
      try {
        console.error(\`Attempting to scrape \${slug} from ReactBits.dev...\`);
        const componentContent = await this.scraper.getComponentCode(slug, style);
        const code = componentContent.code;
        this.cache.set(cacheKey, code, 3600000);
        return code;
      } catch (scraperError) {
        console.error(\`Scraping failed for \${slug}:\`, scraperError);
      }
    }

    // Last resort: return a helpful error message
    throw new Error(\`Unable to fetch component "\${componentName}". Please check your internet connection and try again.\`);
  }

  async getComponentDemo(componentName: string): Promise<string> {
    const component = await this.getComponent(componentName);
    
    // Extract component name from the code
    const componentNameMatch = component.match(/(?:export\\s+default\\s+function|const)\\s+(\\w+)/);
    const extractedName = componentNameMatch ? componentNameMatch[1] : componentName.replace(/\\s+/g, '');
    
    // Create a demo wrapper
    return \`// Demo for \${componentName}
import React from 'react';

\${component}

// Usage Example:
export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">\${componentName} Demo</h1>
      <\${extractedName} />
    </div>
  );
}\`;
  }
}
`;

  // Write the updated service
  await fs.writeFile(servicePath, updatedContent);
  console.log('✅ ReactBitsService updated successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateServiceWithRegistry().catch(console.error);
}

export { updateServiceWithRegistry };