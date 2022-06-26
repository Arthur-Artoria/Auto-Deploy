import { DeployTypes } from '../constants';
import { useProjects } from './ProjectsContext';
import { uuid } from '/@/tools/common';

const getSerialNumber = (projects: Project[], prefix: string) =>
  projects.filter((project) => {
    const name = project.baseInfo.name;
    return name.startsWith(prefix);
  }).length;

function getDefaultProject(projects: Project[]): Project {
  const DEFAULT_PROJECT_NAME_PREFIX = '未命名';
  const serial = getSerialNumber(projects, DEFAULT_PROJECT_NAME_PREFIX);
  const name = `${DEFAULT_PROJECT_NAME_PREFIX}${serial}`;

  const project: Project = {
    baseInfo: { name },
    id: uuid(),
    build: { command: 'yarn build' },
    deploys: [
      { id: uuid(), type: DeployTypes.SSH, content: { host: '', username: '' } }
    ],
    filePaths: []
  };

  return project;
}

/**
 * 获取缺省的 Project
 */
export function useProject(): Project;
/**
 * 根据id获取对应Project
 * @param id - Project id
 */
export function useProject(id: string): Project | null;
export function useProject(id?: string): Project | null {
  const projects = useProjects();

  if (id) {
    const project = projects.find((project) => project.id === id);

    if (!project) return null;
    return project;
  }

  return getDefaultProject(projects);
}
