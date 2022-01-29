import { createContext, Dispatch } from 'react';
import { ProjectsReducerAction } from './ProjectsReducer';
import { useCustomContext } from '/@/tools/common';

export const ProjectsContext = createContext<Project[] | null>(null);

export const ProjectsDispatchContext =
  createContext<Dispatch<ProjectsReducerAction> | null>(null);

export function useProjects() {
  return useCustomContext(ProjectsContext);
}

export function useProjectsDispatch() {
  return useCustomContext(ProjectsDispatchContext);
}
