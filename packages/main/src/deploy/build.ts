import shell from 'shelljs';
import jsonFile from 'jsonfile';
import { PROJECTS_CONFIG_PATH } from '../constants';

export const buildProject = async (projectID: Project['id']) => {
  const { build, baseInfo } = await getProjectByID(projectID);

  if (!build) return;

  const { command } = build;
  const { localPath } = baseInfo;

  if (!localPath) throw Error('localPath 为空！');

  return execBuildCommand(command, localPath);
};

async function getProjectByID(id: Project['id']): Promise<Project> {
  const projects = (await jsonFile.readFile(PROJECTS_CONFIG_PATH)) as Project[];

  const project = projects.find((project) => project.id === id);

  if (!project) throw new Error('invalid project ID');

  return project;
}

/**
 * TODO 使用子进程执行构建脚本
 * @param command
 * @param localPath
 */
function execBuildCommand(command: string, localPath: string) {
  // shell.cd(localPath);
  // shell.exec(command)
}
