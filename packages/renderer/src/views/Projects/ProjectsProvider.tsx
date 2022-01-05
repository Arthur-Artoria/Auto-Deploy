import React, { ReactElement, ReactNode, useReducer } from 'react';
import { ProjectsContext, ProjectsDispatchContext } from './hooks/ProjectsContext';
import { initialProjects, projectsReducer } from './hooks/ProjectsReducer';

export function ProjectsProvider({ children }: { children: ReactNode }): ReactElement {
  const [state, dispatch] = useReducer(projectsReducer, initialProjects);

  return (
    <ProjectsContext.Provider value={state}>
      <ProjectsDispatchContext.Provider value={dispatch}>{children}</ProjectsDispatchContext.Provider>
    </ProjectsContext.Provider>
  );
}
