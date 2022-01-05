import React, { ReactNode } from 'react';
import { ProjectContext, ProjectContextValue } from './hooks/ProjectContext';

interface ProjectProviderProperties {
  children: ReactNode;
  initialValue: ProjectContextValue;
}

export function ProjectProvider({ children, initialValue }: ProjectProviderProperties) {
  return <ProjectContext.Provider value={initialValue}>{children}</ProjectContext.Provider>;
}
