import { CacheEntry } from '../types/index.js';

export class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number = 3600000; // 1 hour

  constructor() {
    this.cache = new Map();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    this.cleanup(); // Clean up expired entries first
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}