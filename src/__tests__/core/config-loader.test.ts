import * as path from 'path';
import { ConfigLoader } from '../../core/config-loader';

describe('ConfigLoader', () => {
  const fixturesDir = path.join(__dirname, '..', 'fixtures');
  const validConfigPath = path.join(fixturesDir, 'valid-config.json');

  describe('loadConfig', () => {
    it('should load valid configuration file', () => {
      const config = ConfigLoader.loadConfig(validConfigPath);
      
      expect(config).toBeDefined();
      expect(config.projectName).toBe('test-project');
      expect(config.ssh).toBeDefined();
      expect(config.build).toBeDefined();
      expect(config.deploy).toBeDefined();
    });

    it('should convert relative paths to absolute', () => {
      const config = ConfigLoader.loadConfig(validConfigPath);
      
      expect(config.build.projectPath).toBe(
        path.resolve(fixturesDir, 'test-project')
      );
      expect(config.build.outputDir).toBe(
        path.resolve(fixturesDir, 'test-project', 'dist')
      );
    });

    it('should throw error when config file does not exist', () => {
      const nonExistentPath = path.join(fixturesDir, 'non-existent.json');
      
      expect(() => {
        ConfigLoader.loadConfig(nonExistentPath);
      }).toThrow('Configuration file not found');
    });

    it('should throw error when JSON is invalid', () => {
      // 创建临时的无效 JSON 配置文件
      const invalidConfigPath = path.join(fixturesDir, 'invalid-config.json');
      require('fs').writeFileSync(invalidConfigPath, '{ invalid json }');
      
      expect(() => {
        ConfigLoader.loadConfig(invalidConfigPath);
      }).toThrow('Invalid JSON in config file');

      // 清理临时文件
      require('fs').unlinkSync(invalidConfigPath);
    });

    it('should throw error when required fields are missing', () => {
      // 创建临时的缺失字段配置文件
      const missingFieldsPath = path.join(fixturesDir, 'missing-fields.json');
      const incompleteConfig = {
        projectName: 'test-project',
        // 缺少 ssh 配置
        build: {
          projectPath: './test-project',
          buildCommand: 'npm run build',
          outputDir: 'dist'
        }
      };
      
      require('fs').writeFileSync(
        missingFieldsPath,
        JSON.stringify(incompleteConfig)
      );
      
      expect(() => {
        ConfigLoader.loadConfig(missingFieldsPath);
      }).toThrow('Missing required fields');

      // 清理临时文件
      require('fs').unlinkSync(missingFieldsPath);
    });

    it('should throw error when neither password nor privateKey is provided', () => {
      // 创建临时的无认证信息配置文件
      const noAuthPath = path.join(fixturesDir, 'no-auth.json');
      const configWithoutAuth = {
        projectName: 'test-project',
        ssh: {
          host: 'example.com',
          port: 22,
          username: 'test'
          // 缺少 password 和 privateKey
        },
        build: {
          projectPath: './test-project',
          buildCommand: 'npm run build',
          outputDir: 'dist'
        },
        deploy: {
          remotePath: '/var/www/test'
        }
      };
      
      require('fs').writeFileSync(
        noAuthPath,
        JSON.stringify(configWithoutAuth)
      );
      
      expect(() => {
        ConfigLoader.loadConfig(noAuthPath);
      }).toThrow('Either password or privateKey must be provided');

      // 清理临时文件
      require('fs').unlinkSync(noAuthPath);
    });

    it('should throw error when backup is enabled but backupDir is not provided', () => {
      // 创建临时的无备份目录配置文件
      const noBackupDirPath = path.join(fixturesDir, 'no-backup-dir.json');
      const configWithoutBackupDir = {
        projectName: 'test-project',
        ssh: {
          host: 'example.com',
          port: 22,
          username: 'test',
          password: 'test'
        },
        build: {
          projectPath: './test-project',
          buildCommand: 'npm run build',
          outputDir: 'dist'
        },
        deploy: {
          remotePath: '/var/www/test',
          backup: true
          // 缺少 backupDir
        }
      };
      
      require('fs').writeFileSync(
        noBackupDirPath,
        JSON.stringify(configWithoutBackupDir)
      );
      
      expect(() => {
        ConfigLoader.loadConfig(noBackupDirPath);
      }).toThrow('backupDir must be provided when backup is enabled');

      // 清理临时文件
      require('fs').unlinkSync(noBackupDirPath);
    });
  });
});