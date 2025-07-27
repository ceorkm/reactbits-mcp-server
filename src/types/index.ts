export interface ReactBitsComponent {
  name: string;
  slug: string;
  category: string;
  description?: string;
  hasCSS: boolean;
  hasTailwind: boolean;
  dependencies?: string[];
  path?: string;
  quality?: number;
  status?: 'complete' | 'incomplete' | 'placeholder';
}

export interface ComponentCategory {
  name: string;
  slug: string;
  components: ReactBitsComponent[];
}

export type ComponentStyle = 'css' | 'tailwind' | 'default';

export interface ComponentListOptions {
  category?: string;
  style?: ComponentStyle;
  limit?: number;
}

export interface ComponentSearchOptions {
  query: string;
  category?: string;
  style?: ComponentStyle;
  limit?: number;
}

export interface ComponentContent {
  code: string;
  style: ComponentStyle;
  imports?: string[];
  dependencies?: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}