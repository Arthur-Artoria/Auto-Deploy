import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Config, ProjectConfig, SelectedConfig } from '../types/config.js';
import { Logger } from '../utils/logger.js';

export class ConfigLoader {
  /**
   * 验证单个项目配置
   */
  private static validateProjectConfig(id: string, config: ProjectConfig): void {
    const requiredFields = {
      'name': config.name,
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
      throw new Error(`Missing required fields for project ${id}: ${missingFields.join(', ')}`);
    }

    // 验证认证信息
    if (!config.ssh.password && !config.ssh.privateKey) {
      throw new Error(`Either password or privateKey must be provided in SSH config for project ${id}`);
    }

    // 验证备份配置
    if (config.deploy.backup && !config.deploy.backupDir) {
      throw new Error(`backupDir must be provided when backup is enabled for project ${id}`);
    }
  }

  /**
   * 验证配置文件
   */
  private static validateConfig(config: any): void {
    // 验证是否有项目配置
    if (!config.projects && !config.projectName) {
      throw new Error('No projects defined in config');
    }

    // 如果是新格式配置，验证每个项目
    if (config.projects) {
      Object.entries(config.projects).forEach(([id, project]: [string, any]) => {
        this.validateProjectConfig(id, project);
      });
    }
    // 如果是旧格式配置，验证单个项目配置
    else {
      this.validateProjectConfig(config.projectName, {
        name: config.projectName,
        ssh: config.ssh,
        build: config.build,
        deploy: config.deploy
      });
    }
  }

  /**
   * 选择要部署的项目
   */
  private static async selectProject(config: Config): Promise<SelectedConfig> {
    const projects = Object.entries(config.projects);

    // 如果只有一个项目，直接返回
    if (projects.length === 1) {
      const [id, project] = projects[0];
      Logger.info(`Only one project found: ${project.name}, selecting automatically.`);
      return { ...project, id };
    }

    // 显示项目列表
    Logger.info('\nAvailable projects:');
    projects.forEach(([id, project], index) => {
      Logger.info(`${index + 1}. ${project.name} (${id})`);
    });

    // 创建命令行接口
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 获取用户选择
    const answer = await new Promise<string>((resolve) => {
      rl.question('\nSelect a project (enter number): ', resolve);
    });
    rl.close();

    // 验证选择
    const index = parseInt(answer) - 1;
    if (isNaN(index) || index < 0 || index >= projects.length) {
      throw new Error('Invalid project selection');
    }

    const [id, project] = projects[index];
    Logger.success(`Selected project: ${project.name}`);
    
    return { ...project, id };
  }

  /**
   * 加载并验证配置文件，然后选择项目
   */
  static async loadConfig(configPath: string): Promise<SelectedConfig> {
    try {
      Logger.progress('Loading configuration file...');
      
      // 确保文件存在
      if (!fs.existsSync(configPath)) {
        Logger.progressEnd(false);
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      // 读取配置文件
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      // 如果是旧格式配置，转换为新格式
      if (!config.projects && config.projectName) {
        Logger.warn('Using legacy config format, converting to new format...');
        config.projects = {
          [config.projectName]: {
            name: config.projectName,
            build: config.build,
            deploy: config.deploy,
            ssh: config.ssh
          }
        };
      }

      // 验证配置
      this.validateConfig(config);

      // 选择项目
      const selectedProject = await this.selectProject(config);

      // 转换路径为绝对路径
      selectedProject.build.projectPath = path.resolve(
        path.dirname(configPath),
        selectedProject.build.projectPath
      );
      selectedProject.build.outputDir = path.resolve(
        selectedProject.build.projectPath,
        selectedProject.build.outputDir
      );

      Logger.progressEnd(true);
      return selectedProject;
    } catch (error) {
      Logger.progressEnd(false);
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in config file: ${error.message}`);
      }
      throw error;
    }
  }
}