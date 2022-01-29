import React, { ReactElement, ReactNode, useEffect, useReducer } from 'react';
import {
  ProjectsContext,
  ProjectsDispatchContext
} from './hooks/ProjectsContext';
import {
  initialProjects,
  ProjectsRecucerActionType,
  projectsReducer
} from './hooks/ProjectsReducer';

export function ProjectsProvider({
  children
}: {
  children: ReactNode;
}): ReactElement {
  const [state, dispatch] = useReducer(projectsReducer, initialProjects);

  useEffect(() => {
    (async () => {
      const projects = await window.nodeCrypto.getProjects();

      dispatch({ type: ProjectsRecucerActionType.INIT, payload: projects });
    })();
  }, []);

  return (
    <ProjectsContext.Provider value={state}>
      <ProjectsDispatchContext.Provider value={dispatch}>
        {children}
      </ProjectsDispatchContext.Provider>
    </ProjectsContext.Provider>
  );
}
