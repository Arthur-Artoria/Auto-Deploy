/**
 * SSH 连接配置
 */
export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
}

/**
 * 构建配置
 */
export interface BuildConfig {
  /** 项目路径 */
  projectPath: string;
  /** 构建命令 */
  buildCommand: string;
  /** 构建输出目录 */
  outputDir: string;
}

/**
 * 部署配置
 */
export interface DeployConfig {
  /** 远程服务器路径 */
  remotePath: string;
  /** 是否备份已存在的文件 */
  backup?: boolean;
  /** 备份目录，如果启用备份则必须提供 */
  backupDir?: string;
}

/**
 * 单个项目配置接口
 */
export interface ProjectConfig {
  /** 项目名称 */
  name: string;
  /** SSH 连接配置 */
  ssh: SSHConfig;
  /** 构建配置 */
  build: BuildConfig;
  /** 部署配置 */
  deploy: DeployConfig;
}

/**
 * 完整配置文件接口
 */
export interface Config {
  /** 项目配置映射 */
  projects: {
    [key: string]: ProjectConfig;
  };
}

/**
 * 选中的项目配置
 */
export interface SelectedConfig extends ProjectConfig {
  /** 项目ID（配置中的key） */
  id: string;
}