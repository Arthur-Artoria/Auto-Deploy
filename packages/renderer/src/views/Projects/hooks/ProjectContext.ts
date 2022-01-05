import { createContext, useContext } from 'react';
import { Updater } from 'use-immer';

export interface ProjectContextValue {
  project: Project;
  updateProject: Updater<Project>;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error();
  return context;
}
