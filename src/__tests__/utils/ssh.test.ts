import { SSHClient } from '../../utils/ssh';
import { NodeSSH } from 'node-ssh';
import { Logger } from '../../utils/logger';

// 模拟 node-ssh
const mockSSHInstance = {
  connect: jest.fn().mockResolvedValue(undefined),
  execCommand: jest.fn(),
  putDirectory: jest.fn(),
  connection: {
    end: jest.fn().mockResolvedValue(undefined)
  }
};

jest.mock('node-ssh', () => ({
  NodeSSH: jest.fn().mockImplementation(() => mockSSHInstance)
}));

describe('SSHClient', () => {
  const mockConfig = {
    host: 'test.example.com',
    port: 22,
    username: 'testuser',
    password: 'testpass',
  };

  let sshClient: SSHClient;

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    sshClient = new SSHClient(mockConfig);
  });

  describe('connect', () => {
    it('should connect successfully with password', async () => {
      await sshClient.connect();

      expect(mockSSHInstance.connect).toHaveBeenCalledWith({
        host: mockConfig.host,
        port: mockConfig.port,
        username: mockConfig.username,
        password: mockConfig.password,
      });

      expect(Logger.progress).toHaveBeenCalledWith('Connecting to remote server...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should connect successfully with private key', async () => {
      const keyConfig = {
        ...mockConfig,
        password: undefined,
        privateKey: 'test-key'
      };
      const sshClientWithKey = new SSHClient(keyConfig);

      await sshClientWithKey.connect();

      expect(mockSSHInstance.connect).toHaveBeenCalledWith({
        host: mockConfig.host,
        port: mockConfig.port,
        username: mockConfig.username,
        privateKey: 'test-key',
      });
    });

    it('should throw error on connection failure', async () => {
      mockSSHInstance.connect.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(sshClient.connect()).rejects.toThrow('Failed to connect to SSH');

      expect(Logger.progress).toHaveBeenCalledWith('Connecting to remote server...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
    });

    it('should throw error when neither password nor privateKey provided', async () => {
      const invalidConfig = {
        ...mockConfig,
        password: undefined,
        privateKey: undefined
      };
      const invalidClient = new SSHClient(invalidConfig);

      await expect(invalidClient.connect()).rejects.toThrow(
        'Either password or privateKey must be provided'
      );
    });
  });

  describe('execCommand', () => {
    it('should execute command successfully', async () => {
      // 模拟成功的命令执行
      const mockSSHInstance = {
        execCommand: jest.fn().mockResolvedValue({
          stdout: 'command output',
          stderr: ''
        })
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      const result = await sshClient.execCommand('test command');

      expect(result).toBe('command output');
      expect(mockSSHInstance.execCommand).toHaveBeenCalledWith('test command');
    });

    it('should throw error when command fails', async () => {
      // 模拟失败的命令执行
      const mockSSHInstance = {
        execCommand: jest.fn().mockResolvedValue({
          stdout: '',
          stderr: 'command failed'
        })
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      await expect(sshClient.execCommand('test command'))
        .rejects.toThrow('command failed');
    });

    it('should throw error when execCommand throws', async () => {
      // 模拟 execCommand 方法抛出异常
      const mockSSHInstance = {
        execCommand: jest.fn().mockRejectedValue(new Error('Execution error'))
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      await expect(sshClient.execCommand('test command'))
        .rejects.toThrow('Execution error');
    });
  });

  describe('uploadDirectory', () => {
    it('should upload directory successfully', async () => {
      (mockSSH.putDirectory as jest.Mock).mockResolvedValue(true);

      await sshClient.uploadDirectory('/local/path', '/remote/path');

      expect(mockSSH.putDirectory).toHaveBeenCalledWith(
        '/local/path',
        '/remote/path',
        expect.objectContaining({
          recursive: true,
          concurrency: 10,
          validate: expect.any(Function)
        })
      );

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.progress).toHaveBeenCalledWith(
        'Uploading path to remote server...'
      );
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should filter out node_modules and dot files', async () => {
      const mockPutDirectory = jest.fn().mockResolvedValue(true);
      (mockSSH.putDirectory as jest.Mock) = mockPutDirectory;

      await sshClient.uploadDirectory('/local/path', '/remote/path');

      // 获取验证函数
      const validateFn = mockPutDirectory.mock.calls[0][2].validate;
      
      // 测试验证函数
      expect(validateFn('/local/path/node_modules/file')).toBe(false);
      expect(validateFn('/local/path/.git/file')).toBe(false);
      expect(validateFn('/local/path/normal/file')).toBe(true);
    });

    it('should throw error when upload fails', async () => {
      (mockSSH.putDirectory as jest.Mock).mockRejectedValue(new Error('Upload failed'));

      await expect(
        sshClient.uploadDirectory('/local/path', '/remote/path')
      ).rejects.toThrow('Failed to upload directory');

      // 验证错误日志
      const { Logger } = require('../../utils/logger');
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to upload directory')
      );
    });

    it('should log upload progress', async () => {
      (mockSSH.putDirectory as jest.Mock).mockImplementation((local, remote, options) => {
        options.tick?.(local + '/file1');
        options.tick?.(local + '/file2');
        return Promise.resolve(true);
      });

      await sshClient.uploadDirectory('/local/path', '/remote/path');

      const { Logger } = require('../../utils/logger');
      expect(Logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Uploading file: /local/path/file1')
      );
    });
  });

  describe('pathExists', () => {
    it('should return true when path exists', async () => {
      // 模拟路径存在的情况
      const mockSSHInstance = {
        execCommand: jest.fn().mockResolvedValue({ stdout: '', stderr: '' })
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      const exists = await sshClient.pathExists('/test/path');

      expect(exists).toBe(true);
      expect(mockSSHInstance.execCommand)
        .toHaveBeenCalledWith('test -e "/test/path"');

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Checking path exists: /test/path')
      );
    });

    it('should return false when path does not exist', async () => {
      // 模拟路径不存在的情况
      const mockSSHInstance = {
        execCommand: jest.fn().mockRejectedValue(new Error('Not found'))
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      const exists = await sshClient.pathExists('/test/path');

      expect(exists).toBe(false);
      expect(mockSSHInstance.execCommand)
        .toHaveBeenCalledWith('test -e "/test/path"');
    });

    it('should return false when command execution fails', async () => {
      // 模拟命令执行失败
      const mockSSHInstance = {
        execCommand: jest.fn().mockResolvedValue({ stdout: '', stderr: 'Error' })
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      const exists = await sshClient.pathExists('/test/path');

      expect(exists).toBe(false);
    });

    it('should handle empty stderr with non-zero exit code', async () => {
      const mockSSHInstance = {
        execCommand: jest.fn().mockResolvedValue({
          stdout: '',
          stderr: '',
          code: 1
        })
      };
      (NodeSSH as jest.Mock).mockImplementation(() => mockSSHInstance);

      const exists = await sshClient.pathExists('/test/path');

      expect(exists).toBe(false);
    });
  });

  describe('backupDirectory', () => {
    it('should create backup successfully', async () => {
      (mockSSH.execCommand as jest.Mock).mockResolvedValue({ stdout: '', stderr: '' });

      await sshClient.backupDirectory('/source/path', '/backup/path');

      expect(mockSSH.execCommand).toHaveBeenCalledWith(expect.stringContaining('mkdir -p'));
      expect(mockSSH.execCommand).toHaveBeenCalledWith(expect.stringContaining('cp -r'));
    });

    it('should throw error when backup fails', async () => {
      (mockSSH.execCommand as jest.Mock).mockRejectedValue(new Error('Backup failed'));

      await expect(
        sshClient.backupDirectory('/source/path', '/backup/path')
      ).rejects.toThrow('Backup failed');
    });
  });

  describe('disconnect', () => {
    beforeEach(() => {
      // 重置所有模拟
      jest.clearAllMocks();
      mockSSHInstance.connection.end.mockResolvedValue(undefined);
    });

    it('should end SSH connection', async () => {
      await sshClient.disconnect();

      expect(mockSSHInstance.connection.end).toHaveBeenCalled();

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('SSH connection closed')
      );
    });

    it('should not throw if already disconnected', async () => {
      mockSSHInstance.connection.end.mockRejectedValue(
        new Error('Already disconnected')
      );

      await expect(sshClient.disconnect()).resolves.not.toThrow();

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('SSH disconnect error: Already disconnected')
      );
    });

    it('should be called in finally block even if operations fail', async () => {
      // 模拟连接失败
      mockSSHInstance.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(sshClient.connect()).rejects.toThrow('Connection failed');
      
      // 验证 disconnect 仍然被调用
      expect(mockSSHInstance.connection.end).toHaveBeenCalled();
    });
  });
});