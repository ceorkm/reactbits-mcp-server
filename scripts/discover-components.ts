#!/usr/bin/env node
import { GitHubService } from '../src/services/GitHubService.js';
import fs from 'fs/promises';
import path from 'path';

interface ComponentInfo {
  name: string;
  slug: string;
  category: string;
  path: string;
  hasCSS: boolean;
  hasTailwind: boolean;
  hasTypeScript: boolean;
  dependencies: string[];
}

interface CategoryInfo {
  name: string;
  slug: string;
  components: ComponentInfo[];
}

class ComponentDiscovery {
  private github: GitHubService;
  private discoveredComponents: Map<string, CategoryInfo> = new Map();

  constructor(githubToken?: string) {
    this.github = new GitHubService(githubToken);
  }

  private normalizeComponentName(fileName: string): string {
    // Remove file extension
    const name = fileName.replace(/\.(tsx?|jsx?)$/, '');
    // Convert PascalCase to Title Case
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\s+/g, ' ');
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private extractCategory(path: string): string {
    const parts = path.split('/');
    // Find category from path structure
    if (parts.includes('Animations')) return 'animations';
    if (parts.includes('Backgrounds')) return 'backgrounds';
    if (parts.includes('Buttons')) return 'buttons';
    if (parts.includes('Cards')) return 'cards';
    if (parts.includes('TextAnimations')) return 'text-animations';
    if (parts.includes('Components')) return 'components';
    if (parts.includes('Navigation')) return 'navigation';
    if (parts.includes('Forms')) return 'forms';
    if (parts.includes('Layouts')) return 'layouts';
    if (parts.includes('Effects')) return 'effects';
    if (parts.includes('Loaders')) return 'loaders';
    return 'uncategorized';
  }

  private getCategoryName(slug: string): string {
    const mapping: Record<string, string> = {
      'animations': 'Animations',
      'backgrounds': 'Backgrounds',
      'buttons': 'Buttons',
      'cards': 'Cards',
      'text-animations': 'Text Animations',
      'components': 'Components',
      'navigation': 'Navigation',
      'forms': 'Forms',
      'layouts': 'Layouts',
      'effects': 'Effects',
      'loaders': 'Loaders',
      'uncategorized': 'Uncategorized'
    };
    return mapping[slug] || slug;
  }

  private detectStyleSupport(path: string): { hasCSS: boolean; hasTailwind: boolean; hasTypeScript: boolean } {
    const hasTypeScript = path.includes('/ts-') || path.endsWith('.tsx');
    const hasTailwind = path.includes('tailwind') || path.includes('ts-tailwind');
    const hasCSS = path.includes('css') || path.includes('ts-default') || (!hasTailwind && !path.includes('tailwind'));
    
    return { hasCSS, hasTailwind, hasTypeScript };
  }

  async discoverComponents(): Promise<void> {
    console.log('🔍 Starting component discovery...\n');

    const directories = [
      'src/ts-tailwind/TextAnimations',
      'src/ts-tailwind/Buttons',
      'src/ts-tailwind/Loaders',
      'src/ts-tailwind/Forms',
      'src/ts-tailwind',
      'src/ts-default',
      'src/tailwind',
      'src/default',
      'src/Buttons',
      'src/Forms',
      'src/Loaders',
      'src'
    ];

    for (const dir of directories) {
      console.log(`\n📂 Scanning ${dir}...`);
      try {
        await this.scanDirectory(dir);
      } catch (error: any) {
        console.log(`  ⚠️  Directory not found or error: ${error.message}`);
      }
    }

    console.log('\n✅ Discovery complete!');
    console.log(`📊 Found ${this.getTotalComponentCount()} components across ${this.discoveredComponents.size} categories\n`);
  }

  private async scanDirectory(dirPath: string, depth: number = 0): Promise<void> {
    if (depth > 3) return; // Limit recursion depth

    try {
      const contents = await this.github.listFiles(dirPath);
      
      for (const item of contents) {
        if (item.type === 'dir') {
          // Check if this directory contains component files
          const subContents = await this.github.listFiles(item.path);
          const hasComponentFiles = subContents.some(f => 
            f.type === 'file' && 
            (f.name.endsWith('.tsx') || f.name.endsWith('.jsx')) &&
            !f.name.includes('.test.') &&
            !f.name.includes('.spec.')
          );

          if (hasComponentFiles) {
            // This is likely a component directory
            await this.processComponentDirectory(item.path, subContents);
          } else {
            // Continue scanning subdirectories
            await this.scanDirectory(item.path, depth + 1);
          }
        }
      }
    } catch (error) {
      // Silently skip directories that can't be accessed
    }
  }

  private async processComponentDirectory(dirPath: string, contents: any[]): Promise<void> {
    // Find the main component file
    const componentFiles = contents.filter(f => 
      f.type === 'file' && 
      (f.name.endsWith('.tsx') || f.name.endsWith('.jsx')) &&
      !f.name.includes('.test.') &&
      !f.name.includes('.spec.') &&
      !f.name.includes('.stories.')
    );

    if (componentFiles.length === 0) return;

    // Prefer files that match the directory name
    const dirName = path.basename(dirPath);
    let mainFile = componentFiles.find(f => 
      f.name.replace(/\.(tsx?|jsx?)$/, '') === dirName
    ) || componentFiles[0];

    const componentName = this.normalizeComponentName(mainFile.name);
    const slug = this.generateSlug(componentName);
    const category = this.extractCategory(dirPath);
    const styleSupport = this.detectStyleSupport(dirPath);

    console.log(`  ✅ Found: ${componentName} (${category})`);

    const componentInfo: ComponentInfo = {
      name: componentName,
      slug: slug,
      category: category,
      path: mainFile.path,
      ...styleSupport,
      dependencies: [] // TODO: Extract from file content
    };

    // Add to category
    if (!this.discoveredComponents.has(category)) {
      this.discoveredComponents.set(category, {
        name: this.getCategoryName(category),
        slug: category,
        components: []
      });
    }

    // Check if component already exists (avoid duplicates)
    const categoryInfo = this.discoveredComponents.get(category)!;
    const existingComponent = categoryInfo.components.find(c => c.slug === slug);
    
    if (existingComponent) {
      // Merge style support
      existingComponent.hasCSS = existingComponent.hasCSS || componentInfo.hasCSS;
      existingComponent.hasTailwind = existingComponent.hasTailwind || componentInfo.hasTailwind;
      existingComponent.hasTypeScript = existingComponent.hasTypeScript || componentInfo.hasTypeScript;
    } else {
      categoryInfo.components.push(componentInfo);
    }
  }

  private getTotalComponentCount(): number {
    let total = 0;
    for (const category of this.discoveredComponents.values()) {
      total += category.components.length;
    }
    return total;
  }

  async generateComponentRegistry(): Promise<void> {
    const registry = {
      lastUpdated: new Date().toISOString(),
      totalComponents: this.getTotalComponentCount(),
      categories: Array.from(this.discoveredComponents.values()).map(category => ({
        ...category,
        components: category.components.sort((a, b) => a.name.localeCompare(b.name))
      })).sort((a, b) => a.name.localeCompare(b.name))
    };

    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'src', 'data', 'component-registry.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(registry, null, 2));

    console.log(`\n📝 Component registry saved to: ${outputPath}`);

    // Generate TypeScript mappings
    await this.generateTypeScriptMappings(registry);
  }

  private async generateTypeScriptMappings(registry: any): Promise<void> {
    const mappings: Record<string, string> = {};
    
    for (const category of registry.categories) {
      for (const component of category.components) {
        mappings[component.slug] = component.path;
      }
    }

    const tsContent = `// Auto-generated component mappings
// Last updated: ${new Date().toISOString()}

export const componentPathMap: Record<string, string> = ${JSON.stringify(mappings, null, 2)};

export const componentRegistry = ${JSON.stringify(registry, null, 2)};
`;

    const outputPath = path.join(process.cwd(), 'src', 'data', 'component-mappings.ts');
    await fs.writeFile(outputPath, tsContent);

    console.log(`📝 TypeScript mappings saved to: ${outputPath}`);
  }

  async generateReport(): Promise<void> {
    console.log('\n📊 Component Discovery Report');
    console.log('═'.repeat(50));
    
    for (const [categorySlug, category] of this.discoveredComponents) {
      console.log(`\n${category.name} (${category.components.length} components)`);
      console.log('─'.repeat(40));
      
      for (const component of category.components) {
        const styles = [];
        if (component.hasTypeScript) styles.push('TS');
        if (component.hasTailwind) styles.push('TW');
        if (component.hasCSS) styles.push('CSS');
        
        console.log(`  • ${component.name} [${styles.join(', ')}]`);
        console.log(`    Path: ${component.path}`);
      }
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log(`Total: ${this.getTotalComponentCount()} components`);
  }
}

// Main execution
async function main() {
  const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  
  if (!githubToken) {
    console.warn('⚠️  No GitHub token found. API rate limits will apply (60 requests/hour)');
    console.log('💡 Set GITHUB_TOKEN environment variable for higher limits\n');
  }

  const discovery = new ComponentDiscovery(githubToken);
  
  try {
    await discovery.discoverComponents();
    await discovery.generateComponentRegistry();
    await discovery.generateReport();
  } catch (error) {
    console.error('\n❌ Error during discovery:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ComponentDiscovery };