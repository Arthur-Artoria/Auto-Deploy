import { NodeSSH } from 'node-ssh';
import { SSHConfig } from '../types/config.js';
import { Logger } from './logger.js';
import * as path from 'path';

export class SSHClient {
  private ssh: NodeSSH;
  private config: SSHConfig;

  constructor(config: SSHConfig) {
    this.ssh = new NodeSSH();
    this.config = config;
  }

  /**
   * 连接到远程服务器
   */
  async connect(): Promise<void> {
    try {
      Logger.progress('Connecting to remote server...');
      await this.ssh.connect({
        host: this.config.host,
        port: this.config.port,
        username: this.config.username,
        password: this.config.password,
        privateKey: this.config.privateKey,
      });
      Logger.progressEnd(true);
    } catch (error) {
      Logger.progressEnd(false);
      throw new Error(`Failed to connect to SSH: ${(error as Error).message}`);
    }
  }

  /**
   * 执行远程命令
   */
  async execCommand(command: string): Promise<string> {
    try {
      const result = await this.ssh.execCommand(command);
      if (result.stderr) {
        throw new Error(result.stderr);
      }
      return result.stdout;
    } catch (error) {
      throw new Error(`Command execution failed: ${(error as Error).message}`);
    }
  }

  /**
   * 上传目录到远程服务器
   */
  async uploadDirectory(localPath: string, remotePath: string): Promise<void> {
    try {
      Logger.progress(`Uploading ${path.basename(localPath)} to remote server...`);
      await this.ssh.putDirectory(localPath, remotePath, {
        recursive: true,
        concurrency: 10,
        validate: (itemPath) => {
          const baseName = path.basename(itemPath);
          return !baseName.startsWith('.') && !baseName.includes('node_modules');
        },
      });
      Logger.progressEnd(true);
    } catch (error) {
      Logger.progressEnd(false);
      throw new Error(`Failed to upload directory: ${(error as Error).message}`);
    }
  }

  /**
   * 检查远程路径是否存在
   */
  async pathExists(remotePath: string): Promise<boolean> {
    try {
      await this.execCommand(`test -e "${remotePath}"`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 创建远程目录
   */
  async createDirectory(remotePath: string): Promise<void> {
    await this.execCommand(`mkdir -p "${remotePath}"`);
  }

  /**
   * 备份远程目录
   */
  async backupDirectory(sourcePath: string, backupPath: string): Promise<void> {
    try {
      Logger.progress('Creating backup of existing files...');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = `${backupPath}/${timestamp}`;
      await this.createDirectory(backupDir);
      await this.execCommand(`cp -r "${sourcePath}"/* "${backupDir}"/`);
      Logger.progressEnd(true);
    } catch (error) {
      Logger.progressEnd(false);
      throw new Error(`Backup failed: ${(error as Error).message}`);
    }
  }

  /**
   * 关闭 SSH 连接
   */
  async disconnect(): Promise<void> {
    try {
      if (this.ssh && this.ssh.connection) {
        await this.ssh.connection.end();
        Logger.debug('SSH connection closed');
      }
    } catch (error) {
      // 忽略断开连接时的错误
      Logger.debug(`SSH disconnect error: ${(error as Error).message}`);
    }
  }
}