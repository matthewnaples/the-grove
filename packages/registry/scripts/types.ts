export interface RegistryFile {
  path: string;
  content?: string;
  type: 'registry:ui' | 'registry:page' | 'registry:block';
}

export interface RegistryEntry {
  name: string;
  type: 'registry:ui' | 'registry:page' | 'registry:block';
  category: 'core' | 'convex' | 'clerk' | 'convex-clerk';
  description?: string;
  tags?: string[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  files: RegistryFile[];
}
