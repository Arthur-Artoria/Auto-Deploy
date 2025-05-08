import { SelectedConfig } from '../types/config.js';
import { Logger } from '../utils/logger.js';
import { SSHClient } from '../utils/ssh.js';
import { Builder } from './builder.js';

export class Deployer {
  private config: SelectedConfig;
  private sshClient: SSHClient;
  private builder: Builder;

  constructor(config: SelectedConfig) {
    this.config = config;
    this.sshClient = new SSHClient(config.ssh);
    this.builder = new Builder(config.build);
  }

  /**
   * 执行部署流程
   */
  async deploy(): Promise<void> {
    try {
      Logger.task(`Starting deployment for ${this.config.name}`);

      // 清理并构建项目
      await this.builder.clean();
      await this.builder.build();

      // 连接到远程服务器
      await this.sshClient.connect();

      // 检查远程目录是否存在
      const remotePathExists = await this.sshClient.pathExists(this.config.deploy.remotePath);

      // 如果需要备份且远程目录存在
      if (this.config.deploy.backup && remotePathExists) {
        if (!this.config.deploy.backupDir) {
          throw new Error('Backup directory not specified in config');
        }
        await this.sshClient.backupDirectory(
          this.config.deploy.remotePath,
          this.config.deploy.backupDir
        );
      }

      // 确保远程目录存在
      await this.sshClient.createDirectory(this.config.deploy.remotePath);

      // 上传构建产物
      await this.sshClient.uploadDirectory(
        this.config.build.outputDir,
        this.config.deploy.remotePath
      );

      Logger.success(`Deployment completed successfully for ${this.config.name}`);
    } catch (error) {
      Logger.error(`Deployment failed: ${(error as Error).message}`);
      throw error;
    } finally {
      // 确保 SSH 连接被关闭
      await this.sshClient.disconnect();
    }
  }
}