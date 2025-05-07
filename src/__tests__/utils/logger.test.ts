import { Logger } from '../../utils/logger';

describe('Logger', () => {
  const originalConsole = {
    log: console.log,
    error: console.error
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    delete process.env.DEBUG;
  });

  afterAll(() => {
    // 恢复原始的 console 方法
    console.log = originalConsole.log;
    console.error = originalConsole.error;
  });

  describe('log levels', () => {
    it('should log info messages', () => {
      Logger.info('test info');
      expect(Logger.info).toHaveBeenCalledWith('test info');
    });

    it('should log success messages', () => {
      Logger.success('test success');
      expect(Logger.success).toHaveBeenCalledWith('test success');
    });

    it('should log warning messages', () => {
      Logger.warn('test warning');
      expect(Logger.warn).toHaveBeenCalledWith('test warning');
    });

    it('should log error messages', () => {
      Logger.error('test error');
      expect(Logger.error).toHaveBeenCalledWith('test error');
    });

    it('should log task messages', () => {
      Logger.task('test task');
      expect(Logger.task).toHaveBeenCalledWith('test task');
    });
  });

  describe('debug mode', () => {
    it('should log debug messages when debug mode is enabled', () => {
      process.env.DEBUG = 'true';
      Logger.debug('test debug');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG: test debug')
      );
      delete process.env.DEBUG;
    });

    it('should not log debug messages when debug mode is disabled', () => {
      process.env.DEBUG = 'false';
      Logger.debug('test debug');
      expect(console.log).not.toHaveBeenCalled();
      delete process.env.DEBUG;
    });

    it('should not log debug messages when debug mode is not set', () => {
      delete process.env.DEBUG;
      Logger.debug('test debug');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('progress reporting', () => {
    const mockStdoutWrite = jest.fn();
    const originalStdoutWrite = process.stdout.write;

    beforeEach(() => {
      process.stdout.write = mockStdoutWrite;
      jest.clearAllMocks();
    });

    afterAll(() => {
      process.stdout.write = originalStdoutWrite;
    });

    it('should show progress message', () => {
      Logger.progress('loading');
      expect(mockStdoutWrite).toHaveBeenCalledWith(expect.stringContaining('loading'));
    });

    it('should end progress with success', () => {
      Logger.progressEnd(true);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✓'));
    });

    it('should end progress with failure', () => {
      Logger.progressEnd(false);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✗'));
    });
  });
});