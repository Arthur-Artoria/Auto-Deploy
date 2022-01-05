import { ImmerHook, useImmer } from 'use-immer';
import { DeployTypes } from '../constants';
import { useProjects } from './ProjectsContext';
import { uuid } from '/@/tools/common';

export function useProject(projectName?: string): ImmerHook<Project> {
  const projects = useProjects();
  const DEFAULT_PROJECT_NAME_PREFIX = '未命名';

  const name =
    projectName ??
    `${DEFAULT_PROJECT_NAME_PREFIX}${
      projects.filter((project) => project.baseInfo?.name.startsWith(DEFAULT_PROJECT_NAME_PREFIX)).length + 1
    }`;

  const project = { baseInfo: { name }, id: uuid(), deploys: [{ id: uuid(), type: DeployTypes.OSS }] };

  return useImmer(project);
}
