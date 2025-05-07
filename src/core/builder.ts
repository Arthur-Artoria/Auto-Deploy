import { exec } from 'child_process';
import { promisify } from 'util';
import { BuildConfig } from '../types/config.js';
import { Logger } from '../utils/logger.js';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

export class Builder {
  private config: BuildConfig;

  constructor(config: BuildConfig) {
    this.config = config;
  }

  /**
   * 验证项目路径
   */
  private async validateProjectPath(): Promise<void> {
    if (!fs.existsSync(this.config.projectPath)) {
      throw new Error(`Project path does not exist: ${this.config.projectPath}`);
    }

    const packageJsonPath = path.join(this.config.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found in project path: ${this.config.projectPath}`);
    }
  }

  /**
   * 执行构建命令
   */
  async build(): Promise<void> {
    try {
      // 验证项目路径
      await this.validateProjectPath();

      Logger.task('Building project');
      Logger.info(`Project path: ${this.config.projectPath}`);
      Logger.info(`Build command: ${this.config.buildCommand}`);

      // 执行构建命令
      Logger.progress('Executing build command...');
      const { stdout, stderr } = await execAsync(this.config.buildCommand, {
        cwd: this.config.projectPath,
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.progressEnd(false);
        throw new Error(`Build failed: ${stderr}`);
      }

      Logger.progressEnd(true);
      if (stdout) {
        Logger.debug(stdout);
      }

      // 验证构建输出目录
      if (!fs.existsSync(this.config.outputDir)) {
        throw new Error(`Build output directory not found: ${this.config.outputDir}`);
      }

      Logger.success(`Build completed successfully. Output directory: ${this.config.outputDir}`);
    } catch (error) {
      throw new Error(`Build failed: ${(error as Error).message}`);
    }
  }

  /**
   * 清理构建输出目录
   */
  async clean(): Promise<void> {
    try {
      if (fs.existsSync(this.config.outputDir)) {
        Logger.progress('Cleaning build output directory...');
        fs.rmSync(this.config.outputDir, { recursive: true, force: true });
        Logger.progressEnd(true);
      }
    } catch (error) {
      Logger.progressEnd(false);
      throw new Error(`Failed to clean output directory: ${(error as Error).message}`);
    }
  }
}