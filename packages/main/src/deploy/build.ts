import shell from 'shelljs';

export function buildProject({ build, baseInfo }: Project) {
  if (!build) return;

  const { command } = build;
  const { localPath } = baseInfo;

  if (!localPath) throw Error('localPath 为空！');

  return execBuildCommand(command, localPath)
}

/**
 * TODO 使用子进程执行构建脚本
 * @param command 
 * @param localPath 
 */
function execBuildCommand(command: string, localPath: string) {
  shell.cd(localPath);
  shell.exec(command)
}
