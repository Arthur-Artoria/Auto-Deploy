// 设置 Jest 测试环境
import { TextDecoder, TextEncoder } from 'util';

// 为 Jest 环境添加必要的全局变量
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 模拟 chalk
const chalk = {
  blue: (str: string) => str,
  green: (str: string) => str,
  yellow: (str: string) => str,
  red: (str: string) => str,
  gray: (str: string) => str,
  cyan: (str: string) => str,
  white: (str: string) => str
};

jest.mock('chalk', () => chalk);

// 模拟 Logger
jest.mock('../utils/logger', () => ({
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
}));

// 设置全局的超时时间
jest.setTimeout(10000);

// 在每个测试之前清除所有模拟
beforeEach(() => {
  jest.clearAllMocks();
});

// 在所有测试完成后清理
afterAll(() => {
  jest.clearAllMocks();
});

// 添加一个空的测试用例以避免 Jest 警告
test('setup file', () => {
  // 空的测试用例
});