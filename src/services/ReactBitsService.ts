import { CacheManager } from '../utils/CacheManager.js';
import { ReactBitsScraper } from './ReactBitsScraper.js';
import { GitHubService } from './GitHubService.js';
import { componentRegistry, componentPathMap } from '../data/component-mappings.js';
import type { ReactBitsComponent } from '../types/index.js';
// Inline component health data to avoid runtime file reading issues
const componentHealth = {
  "componentHealth": {
    "animations": {
      "status": "complete",
      "quality": 9.5,
      "components": {
        "animated-content": "complete",
        "blob-cursor": "complete",
        "click-spark": "complete",
        "crosshair": "complete",
        "cubes": "complete",
        "fade-content": "complete",
        "glare-hover": "complete",
        "image-trail": "complete",
        "magnet": "complete",
        "magnet-lines": "complete",
        "parallax": "complete",
        "splash-cursor": "complete",
        "spotlight": "complete",
        "text-glitch": "complete",
        "typewriter": "complete"
      }
    },
    "backgrounds": {
      "status": "complete",
      "quality": 9.8,
      "components": {
        "aurora": "complete",
        "beams": "complete",
        "circular-noise": "complete",
        "dotted": "complete",
        "grid": "complete",
        "particles": "complete",
        "pixelated": "complete",
        "ripple": "complete",
        "smoky": "complete",
        "static-noise": "complete",
        "wave": "complete",
        "word-pull": "complete"
      }
    },
    "buttons": {
      "status": "incomplete",
      "quality": 2.0,
      "components": {
        "button-1": "placeholder",
        "button-2": "placeholder",
        "button-3": "placeholder",
        "button-4": "placeholder",
        "button-5": "placeholder",
        "button-6": "placeholder",
        "button-7": "placeholder",
        "button-8": "placeholder"
      }
    },
    "forms": {
      "status": "incomplete",
      "quality": 2.0,
      "components": {
        "form-1": "placeholder",
        "form-2": "placeholder",
        "form-3": "placeholder"
      }
    },
    "loaders": {
      "status": "incomplete", 
      "quality": 2.0,
      "components": {
        "loader-1": "placeholder",
        "loader-2": "placeholder",
        "loader-3": "placeholder",
        "loader-4": "placeholder",
        "loader-5": "placeholder",
        "loader-6": "placeholder",
        "loader-7": "placeholder",
        "loader-8": "placeholder",
        "loader-9": "placeholder"
      }
    },
    "text-animations": {
      "status": "complete",
      "quality": 9.0,
      "components": {
        "ascii-text": "complete",
        "blur-text": "complete",
        "circular-text": "complete",
        "count-up": "complete",
        "cover-text": "complete",
        "gradient-text": "complete",
        "jumbled-text": "complete",
        "marquee": "complete",
        "moving-text": "complete",
        "random-text": "complete",
        "staggered-text": "complete",
        "transition-text": "complete",
        "wavering-text": "complete"
      }
    },
    "components": {
      "status": "mostly-complete",
      "quality": 8.0,
      "components": {
        "accordion": "complete",
        "animated-list": "complete",
        "badge": "complete",
        "bento": "complete",
        "calendar": "complete",
        "command": "complete",
        "dialog": "complete",
        "dock": "complete",
        "drawer": "complete",
        "dropdown": "complete",
        "glassmorphism": "complete",
        "gradient-border": "complete",
        "keyboard": "complete",
        "noise": "complete",
        "otp": "complete",
        "pagination": "complete",
        "pixel-card": "complete",
        "progress": "complete",
        "scroll-indicator": "complete",
        "sticky-scroll": "complete"
      }
    }
  },
  "dependencies": {
    "framer-motion": ["text-animations", "animations"],
    "gsap": ["blob-cursor", "magnet", "magnet-lines"],
    "three": ["beams", "ascii-text"],
    "ogl": ["aurora"],
    "@react-three/fiber": ["beams"],
    "@react-three/drei": ["beams"]
  }
};

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

  private getComponentDependencies(slug: string): string[] {
    const deps: string[] = [];
    
    for (const [dep, categories] of Object.entries(componentHealth.dependencies)) {
      if ((categories as string[]).some((cat: string) => {
        const categoryData = (componentHealth.componentHealth as any)[cat];
        return categoryData?.components && slug in categoryData.components;
      })) {
        deps.push(dep);
      }
    }
    
    return deps;
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
        const categoryHealth = (componentHealth.componentHealth as any)[category.slug] || {};
        
        components.push(...category.components.map(comp => {
          const componentStatus = categoryHealth.components?.[comp.slug] || 'unknown';
          const dependencies = this.getComponentDependencies(comp.slug);
          
          return {
            ...comp,
            description: `A ${comp.name} component from ReactBits`,
            quality: categoryHealth.quality,
            status: componentStatus,
            dependencies
          };
        }));
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
    const slug = componentName.toLowerCase().replace(/\s+/g, '-');
    
    // Check component health status
    const categoryEntry = Object.entries(componentHealth.componentHealth).find(([_, category]) => 
      (category as any).components && slug in (category as any).components
    );
    
    if (categoryEntry) {
      const [categoryName, category] = categoryEntry;
      const componentStatus = ((category as any).components as any)[slug];
      
      if (componentStatus === 'placeholder' || componentStatus === 'incomplete') {
        const warningMessage = `
// ⚠️ WARNING: This component has incomplete implementation
// Component: ${componentName} (${slug})
// Category: ${categoryName}
// Status: ${componentStatus}
// Quality Score: ${(category as any).quality}/10
//
// This is a known issue with ReactBits. The following components are incomplete:
// - All Button components (Button 1-8)
// - All Form components (Form 1-3)  
// - All Loader components (Loader 1-9)
//
// For production use, please implement your own version or use components from:
// - Backgrounds (9.8/10 quality)
// - Animations (9.5/10 quality)
// - Text Animations (9.0/10 quality)

export default function ${componentName.replace(/\s+/g, '')}() {
  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <p className="text-gray-600">⚠️ {Component "${componentName}" has incomplete implementation}</p>
      <p className="text-sm text-gray-500 mt-2">Please check ReactBits.dev for updates</p>
    </div>
  );
}`;
        return warningMessage;
      }
    }
    
    // Check cache first
    const cacheKey = `component:${slug}:${style || 'default'}`;
    const cached = this.cache.get<string>(cacheKey);
    if (cached) return cached;

    // Use the component path map
    const componentPath = componentPathMap[slug];
    
    if (!componentPath) {
      throw new Error(`Component "${componentName}" not found in registry`);
    }

    try {
      console.error(`Fetching ${slug} from GitHub at ${componentPath}...`);
      const githubComponent = await this.github.getComponentFromGitHub(componentPath);
      
      if (githubComponent.code) {
        this.cache.set(cacheKey, githubComponent.code, 3600000);
        return githubComponent.code;
      }
    } catch (error) {
      console.error(`Failed to fetch ${slug} from GitHub:`, error);
      
      // Fallback to web scraping
      try {
        console.error(`Attempting to scrape ${slug} from ReactBits.dev...`);
        const componentContent = await this.scraper.getComponentCode(slug, style);
        const code = componentContent.code;
        this.cache.set(cacheKey, code, 3600000);
        return code;
      } catch (scraperError) {
        console.error(`Scraping failed for ${slug}:`, scraperError);
      }
    }

    // Last resort: return a helpful error message
    throw new Error(`Unable to fetch component "${componentName}". Please check your internet connection and try again.`);
  }

  async getComponentDemo(componentName: string): Promise<string> {
    const component = await this.getComponent(componentName);
    
    // Extract component name from the code
    const componentNameMatch = component.match(/(?:export\s+default\s+function|const)\s+(\w+)/);
    const extractedName = componentNameMatch ? componentNameMatch[1] : componentName.replace(/\s+/g, '');
    
    // Create a demo wrapper
    return `// Demo for ${componentName}
import React from 'react';

${component}

// Usage Example:
export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">${componentName} Demo</h1>
      <${extractedName} />
    </div>
  );
}`;
  }
}
