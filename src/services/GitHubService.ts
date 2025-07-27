import axios, { AxiosInstance } from 'axios';
import { CacheManager } from '../utils/CacheManager.js';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

interface GitHubRepo {
  owner: string;
  repo: string;
}

export class GitHubService {
  private api: AxiosInstance;
  private cache: CacheManager;
  private repo: GitHubRepo;

  constructor(token?: string) {
    this.cache = new CacheManager();
    
    // Configure axios instance with GitHub API
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(token ? { 'Authorization': `token ${token}` } : {})
      }
    });

    // ReactBits repository details
    this.repo = {
      owner: 'DavidHDev',
      repo: 'react-bits'
    };
  }

  async getFileContent(path: string): Promise<string> {
    const cacheKey = `github:file:${path}`;
    const cached = this.cache.get<string>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.get<GitHubFile>(
        `/repos/${this.repo.owner}/${this.repo.repo}/contents/${path}`
      );

      const file = response.data;
      
      if (file.type !== 'file') {
        throw new Error(`Path ${path} is not a file`);
      }

      // Decode base64 content
      const content = file.content ? 
        Buffer.from(file.content, 'base64').toString('utf-8') : '';
      
      this.cache.set(cacheKey, content, 3600000); // Cache for 1 hour
      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`File not found: ${path}`);
        }
        if (error.response?.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
      }
      throw error;
    }
  }

  async listFiles(path: string = ''): Promise<GitHubFile[]> {
    const cacheKey = `github:list:${path}`;
    const cached = this.cache.get<GitHubFile[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.get<GitHubFile[]>(
        `/repos/${this.repo.owner}/${this.repo.repo}/contents/${path}`
      );

      const files = response.data;
      this.cache.set(cacheKey, files, 3600000); // Cache for 1 hour
      return files;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Directory not found: ${path}`);
        }
        if (error.response?.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
      }
      throw error;
    }
  }

  async searchComponents(query: string): Promise<string[]> {
    const cacheKey = `github:search:${query}`;
    const cached = this.cache.get<string[]>(cacheKey);
    if (cached) return cached;

    try {
      // Search for component files in the repository
      const response = await this.api.get('/search/code', {
        params: {
          q: `${query} in:file extension:tsx extension:jsx repo:${this.repo.owner}/${this.repo.repo}`,
          per_page: 30
        }
      });

      const componentPaths = response.data.items.map((item: any) => item.path);
      this.cache.set(cacheKey, componentPaths, 3600000);
      return componentPaths;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw error;
    }
  }

  async getComponentFromGitHub(componentPath: string): Promise<{
    code: string;
    dependencies: string[];
    hasCSS: boolean;
    hasTailwind: boolean;
  }> {
    const content = await this.getFileContent(componentPath);
    
    // Analyze the component
    const hasTailwind = content.includes('className=') && 
      (content.includes('tailwind') || content.includes('tw-') || /className=["'][^"']*\s/.test(content));
    const hasCSS = content.includes('style=') || content.includes('.css');
    
    // Extract dependencies
    const dependencies: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const dep = match[1];
      if (!dep.startsWith('.') && !dep.startsWith('/')) {
        dependencies.push(dep);
      }
    }

    return {
      code: content,
      dependencies: [...new Set(dependencies)],
      hasCSS,
      hasTailwind
    };
  }

  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
  }> {
    try {
      const response = await this.api.get('/rate_limit');
      const core = response.data.rate;
      
      return {
        limit: core.limit,
        remaining: core.remaining,
        reset: new Date(core.reset * 1000)
      };
    } catch (error) {
      throw new Error('Failed to get rate limit information');
    }
  }
}