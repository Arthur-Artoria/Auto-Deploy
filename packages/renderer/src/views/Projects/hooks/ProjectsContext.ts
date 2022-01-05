import { createContext, Dispatch, useContext } from 'react';
import { Action, initialProjects } from './ProjectsReducer';

export const ProjectsContext = createContext<Project[]>(initialProjects);

export const ProjectsDispatchContext = createContext<Dispatch<Action> | null>(null);

export function useProjects() {
  return useContext(ProjectsContext);
}

export function useProjectsDispathc() {
  return useContext(ProjectsDispatchContext);
}
