// Generated from validated content at build time; edit content/projects/*.json.
import content from './generated/content.json';
import { assetPath } from './asset-path';

export type ProjectPhoto = { src: string; alt: string; description?: string };
export type Project = {
  id: string;
  sourceJobNumber?: number | null;
  title: string;
  customer: string | null;
  customers?: string[];
  photos: ProjectPhoto[];
  scope: string | null;
  displayOrder: number;
  featured: boolean;
  published: boolean;
};

const published: Project[] = content.projects;
export const PROJECTS: Project[] = published.map(project => ({
  ...project,
  photos: project.photos.map(photo => ({ ...photo, src: assetPath(photo.src) })),
}));
export const PHOTO_COLLECTIONS = PROJECTS.filter(project => project.photos.length);
