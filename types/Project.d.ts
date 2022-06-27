type DeployTypes =
  typeof import('../packages/renderer/src/views/Projects/constants')['DeployTypes'];

interface Deploy<T extends DeployTypes, C> {
  id: string;
  type: T;
  content: C;
}

declare interface OSSEnvironment {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  roleArn: string;
}

declare interface SSHEnvironment {
  host: string;
  username: string;
}

declare type ProjectDeploy =
  | Deploy<DeployTypes['OSS'], OSSEnvironment>
  | Deploy<DeployTypes['SSH'], SSHEnvironment>;

declare interface Project {
  id: string;

  baseInfo: {
    name: string;
    localPath?: string;
  };

  build?: {
    command: string;
  };

  deploys: ProjectDeploy[];

  filePaths: string[];

  remotePath: string;

  remoteShell?: string;
}
