import { createContext } from 'react';
import { useCustomContext } from '/@/tools/common';

interface ProjectDeployContextValue {
  deploy: ProjectDeploy;
  index: number;
}

export const ProjectDeployContext =
  createContext<ProjectDeployContextValue | null>(null);

export const useProjectDeployContext = () =>
  useCustomContext(ProjectDeployContext);
