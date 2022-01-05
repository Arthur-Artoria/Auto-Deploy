type DeployTypes = typeof DeployTypes;

interface Deploy<T extends DeployTypes, C> {
  id: string;
  type: T;
  content?: C;
}

declare interface OSSEnvironment {
  accessKeyId: string;
}

declare interface SSHEnvironment {
  host: string;
  username: string;
}

declare interface Project {
  id: string;

  baseInfo: {
    name: string;
    localPath?: string;
  };

  build?: {
    command: string;
  };
  deploys: (Deploy<DeployTypes['OSS'], OSSEnvironment> | Deploy<DeployTypes['SSH'], SSHEnvironment>)[];
}
