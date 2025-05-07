import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../types/config.js';
import { Logger } from '../utils/logger.js';

export class ConfigLoader {
  /**
   * 验证配置文件的必要字段
   */
  private static validateConfig(config: Config): void {
    const requiredFields = {
      'projectName': config.projectName,
      'ssh.host': config.ssh?.host,
      'ssh.port': config.ssh?.port,
      'ssh.username': config.ssh?.username,
      'build.projectPath': config.build?.projectPath,
      'build.buildCommand': config.build?.buildCommand,
      'build.outputDir': config.build?.outputDir,
      'deploy.remotePath': config.deploy?.remotePath,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 验证认证信息
    if (!config.ssh.password && !config.ssh.privateKey) {
      throw new Error('Either password or privateKey must be provided in SSH config');
    }

    // 验证备份配置
    if (config.deploy.backup && !config.deploy.backupDir) {
      throw new Error('backupDir must be provided when backup is enabled');
    }
  }

  /**
   * 加载并验证配置文件
   */
  static loadConfig(configPath: string): Config {
    try {
      Logger.progress('Loading configuration file...');
      
      // 确保文件存在
      if (!fs.existsSync(configPath)) {
        Logger.progressEnd(false);
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      // 读取配置文件
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent) as Config;

      // 验证配置
      this.validateConfig(config);

      // 转换路径为绝对路径
      config.build.projectPath = path.resolve(
        path.dirname(configPath),
        config.build.projectPath
      );
      config.build.outputDir = path.resolve(
        config.build.projectPath,
        config.build.outputDir
      );

      Logger.progressEnd(true);
      return config;
    } catch (error) {
      Logger.progressEnd(false);
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in config file: ${error.message}`);
      }
      throw error;
    }
  }
}