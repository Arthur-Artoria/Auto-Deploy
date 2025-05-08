#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { ConfigLoader } from './core/config-loader.js';
import { Deployer } from './core/deployer.js';
import { Logger } from './utils/logger.js';

const program = new Command();

program
  .name('auto-deploy')
  .description('CLI tool for automated project building and deployment via SSH')
  .version('1.0.0')
  .option('-c, --config <path>', 'path to configuration file', 'deploy.config.json')
  .option('-d, --debug', 'enable debug output')
  .action(async (options) => {
    try {
      // 设置调试模式
      if (options.debug) {
        process.env.DEBUG = 'true';
        Logger.debug('Debug mode enabled');
      }

      // 解析配置文件路径
      const configPath = path.resolve(process.cwd(), options.config);
      Logger.debug(`Using config file: ${configPath}`);

      // 加载配置并选择项目
      const config = await ConfigLoader.loadConfig(configPath);
      Logger.info(`Loaded configuration for project: ${config.name}`);

      // 创建部署器并执行部署
      const deployer = new Deployer(config);
      await deployer.deploy();

    } catch (error) {
      Logger.error((error as Error).message);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();