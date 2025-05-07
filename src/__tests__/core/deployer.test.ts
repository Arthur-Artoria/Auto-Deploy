import { Deployer } from '../../core/deployer';
import { Builder } from '../../core/builder';
import { SSHClient } from '../../utils/ssh';
import { Config } from '../../types/config';

// 模拟依赖模块
jest.mock('../../core/builder');
jest.mock('../../utils/ssh');

describe('Deployer', () => {
  // 模拟配置
  const mockConfig: Config = {
    projectName: 'test-project',
    ssh: {
      host: 'test.example.com',
      port: 22,
      username: 'test',
      password: 'test123'
    },
    build: {
      projectPath: '/test/project',
      buildCommand: 'npm run build',
      outputDir: '/test/project/dist'
    },
    deploy: {
      remotePath: '/var/www/test',
      backup: true,
      backupDir: '/var/www/backups'
    }
  };

  let deployer: Deployer;
  let mockBuilder: jest.Mocked<Builder>;
  let mockSSHClient: jest.Mocked<SSHClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    // 重置模拟实现
    (Builder as jest.Mock).mockImplementation(() => ({
      clean: jest.fn().mockResolvedValue(undefined),
      build: jest.fn().mockResolvedValue(undefined)
    }));

    (SSHClient as jest.Mock).mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      pathExists: jest.fn().mockResolvedValue(false),
      createDirectory: jest.fn().mockResolvedValue(undefined),
      backupDirectory: jest.fn().mockResolvedValue(undefined),
      uploadDirectory: jest.fn().mockResolvedValue(undefined)
    }));

    deployer = new Deployer(mockConfig);
    mockBuilder = (Builder as jest.Mock).mock.instances[0] as jest.Mocked<Builder>;
    mockSSHClient = (SSHClient as jest.Mock).mock.instances[0] as jest.Mocked<SSHClient>;
  });

  describe('deploy', () => {
    it('should execute full deployment process successfully', async () => {
      await deployer.deploy();

      // 验证构建过程
      expect(mockBuilder.clean).toHaveBeenCalled();
      expect(mockBuilder.build).toHaveBeenCalled();

      // 验证SSH连接
      expect(mockSSHClient.connect).toHaveBeenCalled();

      // 验证远程目录创建
      expect(mockSSHClient.createDirectory).toHaveBeenCalledWith(mockConfig.deploy.remotePath);

      // 验证文件上传
      expect(mockSSHClient.uploadDirectory).toHaveBeenCalledWith(
        mockConfig.build.outputDir,
        mockConfig.deploy.remotePath
      );

      // 验证SSH连接断开
      expect(mockSSHClient.disconnect).toHaveBeenCalled();

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.task).toHaveBeenCalledWith(
        `Starting deployment for ${mockConfig.projectName}`
      );
      expect(Logger.success).toHaveBeenCalledWith(
        `Deployment completed successfully for ${mockConfig.projectName}`
      );
    });

    it('should log progress during deployment', async () => {
      await deployer.deploy();

      const { Logger } = require('../../utils/logger');
      expect(Logger.progress).toHaveBeenCalledWith('Connecting to remote server...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
      expect(Logger.progress).toHaveBeenCalledWith('Uploading dist to remote server...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should perform backup when remote path exists and backup is enabled', async () => {
      // 模拟远程路径存在
      mockSSHClient.pathExists = jest.fn().mockResolvedValue(true);

      await deployer.deploy();

      expect(mockSSHClient.backupDirectory).toHaveBeenCalledWith(
        mockConfig.deploy.remotePath,
        mockConfig.deploy.backupDir
      );

      // 验证备份日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.progress).toHaveBeenCalledWith('Creating backup of existing files...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should log backup timestamp', async () => {
      mockSSHClient.pathExists = jest.fn().mockResolvedValue(true);
      
      await deployer.deploy();
      
      const { Logger } = require('../../utils/logger');
      expect(Logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Backup created at')
      );
    });

    it('should skip backup when backup is disabled', async () => {
      const configWithoutBackup = {
        ...mockConfig,
        deploy: {
          ...mockConfig.deploy,
          backup: false
        }
      };

      const deployerWithoutBackup = new Deployer(configWithoutBackup);
      await deployerWithoutBackup.deploy();

      expect(mockSSHClient.backupDirectory).not.toHaveBeenCalled();
      
      // 验证没有备份相关的日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.progress).not.toHaveBeenCalledWith(
        'Creating backup of existing files...'
      );
    });

    it('should throw error when backup enabled but backupDir not provided', async () => {
      const invalidConfig = {
        ...mockConfig,
        deploy: {
          ...mockConfig.deploy,
          backup: true,
          backupDir: undefined
        }
      };
      
      mockSSHClient.pathExists = jest.fn().mockResolvedValue(true);
      const invalidDeployer = new Deployer(invalidConfig);

      await expect(invalidDeployer.deploy()).rejects.toThrow(
        'Backup directory not specified in config'
      );
    });

    it('should handle build failure', async () => {
      mockBuilder.build = jest.fn().mockRejectedValue(new Error('Build failed'));

      await expect(deployer.deploy()).rejects.toThrow('Build failed');

      // 验证SSH连接没有建立
      expect(mockSSHClient.connect).not.toHaveBeenCalled();

      // 验证错误日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Build failed')
      );
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
    });

    it('should handle SSH connection failure', async () => {
      mockSSHClient.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

      await expect(deployer.deploy()).rejects.toThrow('Connection failed');

      // 验证构建过程已完成
      expect(mockBuilder.build).toHaveBeenCalled();
      // 验证没有进行文件上传
      expect(mockSSHClient.uploadDirectory).not.toHaveBeenCalled();

      // 验证错误日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Connection failed')
      );
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
    });

    it('should handle upload failure', async () => {
      mockSSHClient.uploadDirectory = jest.fn().mockRejectedValue(new Error('Upload failed'));

      await expect(deployer.deploy()).rejects.toThrow('Upload failed');

      // 验证SSH连接被正确关闭
      expect(mockSSHClient.disconnect).toHaveBeenCalled();

      // 验证错误日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Upload failed')
      );
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
    });

    it('should ensure SSH connection is closed even on failure', async () => {
      mockSSHClient.uploadDirectory = jest.fn().mockRejectedValue(new Error('Upload failed'));

      await expect(deployer.deploy()).rejects.toThrow('Upload failed');

      // 验证SSH连接被正确关闭
      expect(mockSSHClient.disconnect).toHaveBeenCalled();
    });

    it('should handle upload failure', async () => {
      mockSSHClient.uploadDirectory = jest.fn().mockRejectedValue(new Error('Upload failed'));

      await expect(deployer.deploy()).rejects.toThrow('Upload failed');

      // 验证SSH连接被正确关闭
      expect(mockSSHClient.disconnect).toHaveBeenCalled();
    });

    it('should handle backup failure', async () => {
      // 模拟远程路径存在和备份失败
      mockSSHClient.pathExists = jest.fn().mockResolvedValue(true);
      mockSSHClient.backupDirectory = jest.fn().mockRejectedValue(new Error('Backup failed'));

      await expect(deployer.deploy()).rejects.toThrow('Backup failed');

      // 验证没有进行文件上传
      expect(mockSSHClient.uploadDirectory).not.toHaveBeenCalled();
      // 验证SSH连接被正确关闭
      expect(mockSSHClient.disconnect).toHaveBeenCalled();
    });

    it('should ensure SSH connection is closed even on failure', async () => {
      // 模拟上传过程中的失败
      mockSSHClient.uploadDirectory = jest.fn().mockRejectedValue(new Error('Upload failed'));

      await expect(deployer.deploy()).rejects.toThrow('Upload failed');

      // 验证SSH连接被正确关闭
      expect(mockSSHClient.disconnect).toHaveBeenCalled();
    });
  });
});