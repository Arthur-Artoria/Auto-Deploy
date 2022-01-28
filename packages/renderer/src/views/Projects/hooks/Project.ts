import { DeployTypes } from '../constants';
import { useProjects } from './ProjectsContext';
import { uuid } from '/@/tools/common';

const getSerialNumber = (projects: Project[], prefix: string) =>
  projects.filter((project) => {
    const name = project.baseInfo.name;
    return name.startsWith(prefix);
  }).length;

export function useProject(): Project;
export function useProject(id: string): Project | null;
export function useProject(id?: string): Project | null {
  const projects = useProjects();

  if (id) {
    const project = projects.find((project) => project.id === id);

    if (!project) return null;
    return project;
  }

  const DEFAULT_PROJECT_NAME_PREFIX = '未命名';
  const serial = getSerialNumber(projects, DEFAULT_PROJECT_NAME_PREFIX);
  const name = `${DEFAULT_PROJECT_NAME_PREFIX}${serial}`;

  const project: Project = {
    baseInfo: { name },
    id: uuid(),
    build: { command: 'yarn build' },
    deploys: [
      { id: uuid(), type: DeployTypes.SSH, content: { host: '', username: '' } }
    ]
  };

  return project;
}
