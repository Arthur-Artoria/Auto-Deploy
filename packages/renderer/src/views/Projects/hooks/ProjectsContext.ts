import { createContext, Dispatch } from 'react';
import { ProjectsReducerAction, initialProjects } from './ProjectsReducer';
import { useCustomContext } from '/@/tools/common';

export const ProjectsContext = createContext<Project[]>(initialProjects);

export const ProjectsDispatchContext =
  createContext<Dispatch<ProjectsReducerAction> | null>(null);

export function useProjects() {
  return useCustomContext(ProjectsContext);
}

export function useProjectsDispatch() {
  return useCustomContext(ProjectsDispatchContext);
}
