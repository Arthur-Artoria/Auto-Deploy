// 首先声明 mockExec
const mockExec = jest.fn((command: string, options: { cwd?: string }, callback: (error: null, result: { stdout: string, stderr: string }) => void) => {
  // 默认模拟成功执行
  callback(null, { stdout: 'success', stderr: '' });
});

// 然后设置模拟
jest.mock('child_process', () => ({
  exec: (command: string, options: { cwd?: string }, callback: Function) => 
    mockExec(command, options, callback)
}), { virtual: true });

jest.mock('util', () => ({
  promisify: () => (command: string, options: { cwd?: string }) => 
    new Promise((resolve, reject) => {
      mockExec(command, options, (err: null, result: { stdout: string, stderr: string }) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
}), { virtual: true });

// 模拟 Logger
jest.mock('../../utils/logger', () => ({
  Logger: {
    info: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    task: jest.fn(),
    progress: jest.fn(),
    progressEnd: jest.fn()
  }
}), { virtual: true });

// 模拟 fs 模块
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  rmSync: jest.fn()
}), { virtual: true });

// 然后导入模块
import { Builder } from '../../core/builder';
import * as fs from 'fs';
import { exec } from 'child_process';
import { Logger } from '../../utils/logger';

describe('Builder', () => {
  const mockConfig = {
    projectPath: '/test/project',
    buildCommand: 'npm run build',
    outputDir: '/test/project/dist',
  };

  let builder: Builder;

  beforeEach(() => {
    jest.clearAllMocks();
    builder = new Builder(mockConfig);
  });

  describe('build', () => {
    it('should execute build command successfully', async () => {
      // 模拟文件系统检查
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)  // projectPath exists
        .mockReturnValueOnce(true)  // package.json exists
        .mockReturnValueOnce(true); // outputDir exists

      // 模拟命令执行
      mockExec.mockImplementation((cmd: string, opts: any, callback: Function) => {
        callback(null, { stdout: 'Build successful', stderr: '' });
      });

      await builder.build();

      // 验证路径检查
      expect(fs.existsSync).toHaveBeenCalledWith(mockConfig.projectPath);
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('package.json'));

      // 验证构建命令执行
      expect(exec).toHaveBeenCalledWith(
        mockConfig.buildCommand,
        { cwd: mockConfig.projectPath },
        expect.any(Function)
      );

      // 验证日志调用
      const { Logger } = require('../../utils/logger');
      expect(Logger.task).toHaveBeenCalledWith('Building project');
      expect(Logger.info).toHaveBeenCalledWith(`Project path: ${mockConfig.projectPath}`);
      expect(Logger.info).toHaveBeenCalledWith(`Build command: ${mockConfig.buildCommand}`);
      expect(Logger.progress).toHaveBeenCalledWith('Executing build command...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
      expect(Logger.success).toHaveBeenCalledWith(
        `Build completed successfully. Output directory: ${mockConfig.outputDir}`
      );
    });

    it('should handle build warnings correctly', async () => {
      // 模拟文件系统检查
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);

      // 模拟带有警告的构建
      mockExec.mockImplementation((cmd, opts, callback) => {
        callback(null, { stdout: 'Build successful', stderr: 'warning: something' });
      });

      await builder.build();

      // 验证警告被正确处理
      const { Logger } = require('../../utils/logger');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should throw error when project path does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(builder.build()).rejects.toThrow('Project path does not exist');
      
      const { Logger } = require('../../utils/logger');
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Project path does not exist')
      );
    });

    it('should throw error when package.json is missing', async () => {
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)  // projectPath exists
        .mockReturnValueOnce(false); // package.json missing

      await expect(builder.build()).rejects.toThrow('package.json not found');
      
      // 验证错误日志
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('package.json not found')
      );
    });

    it('should throw error when build command fails', async () => {
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);

      mockExec.mockImplementationOnce((cmd, opts, callback) => {
        callback(null, { stdout: '', stderr: 'Build failed' });
      });

      await expect(builder.build()).rejects.toThrow('Build failed');
      
      // 验证错误日志
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Build failed')
      );
    });

    it('should throw error when output directory is missing', async () => {
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      mockExec.mockImplementationOnce((cmd, opts, callback) => {
        callback(null, { stdout: 'Build successful', stderr: '' });
      });

      await expect(builder.build()).rejects.toThrow('Build output directory not found');
      
      // 验证错误日志
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Build output directory not found')
      );
    });
  });

  describe('clean', () => {
    it('should clean output directory if it exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await builder.clean();

      expect(fs.rmSync).toHaveBeenCalledWith(
        mockConfig.outputDir,
        { recursive: true, force: true }
      );

      const { Logger } = require('../../utils/logger');
      expect(Logger.progress).toHaveBeenCalledWith('Cleaning build output directory...');
      expect(Logger.progressEnd).toHaveBeenCalledWith(true);
    });

    it('should not attempt to clean if output directory does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await builder.clean();

      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(Logger.progress).not.toHaveBeenCalled();
    });

    it('should throw error when clean operation fails', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.rmSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await expect(builder.clean()).rejects.toThrow('Failed to clean output directory');

      const { Logger } = require('../../utils/logger');
      expect(Logger.progressEnd).toHaveBeenCalledWith(false);
      expect(Logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to clean output directory')
      );
    });

    it('should log warning when output directory does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await builder.clean();

      const { Logger } = require('../../utils/logger');
      expect(Logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Output directory does not exist')
      );
    });
  });
});