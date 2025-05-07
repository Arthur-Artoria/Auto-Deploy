# Auto Deploy

一个命令行工具，用于自动构建项目并通过 SSH 部署到远程服务器。

## 特性

- 支持 TypeScript/JavaScript 项目的自动构建
- 通过 SSH 安全地部署到远程服务器
- 支持密码或私钥认证
- 自动备份远程文件
- 详细的日志输出
- 支持调试模式

## 安装

```bash
npm install -g auto-deploy
```

## 使用方法

1. 创建配置文件 `deploy.config.json`（可参考 `deploy.config.example.json`）
2. 运行部署命令：

```bash
auto-deploy --config deploy.config.json
```

### 命令行选项

- `-c, --config <path>`: 指定配置文件路径（默认：deploy.config.json）
- `-d, --debug`: 启用调试输出
- `-v, --version`: 显示版本号
- `-h, --help`: 显示帮助信息

## 配置文件格式

配置文件使用 JSON 格式，包含以下字段：

```typescript
{
  // 项目名称
  "projectName": string,
  
  // SSH 连接配置
  "ssh": {
    "host": string,
    "port": number,
    "username": string,
    "password"?: string,    // 使用密码认证
    "privateKey"?: string   // 或使用私钥认证
  },
  
  // 构建配置
  "build": {
    "projectPath": string,  // 项目路径
    "buildCommand": string, // 构建命令
    "outputDir": string     // 构建输出目录
  },
  
  // 部署配置
  "deploy": {
    "remotePath": string,   // 远程服务器部署路径
    "backup"?: boolean,     // 是否备份已存在的文件
    "backupDir"?: string    // 备份目录路径
  }
}
```

## 示例配置

```json
{
  "projectName": "my-website",
  "ssh": {
    "host": "example.com",
    "port": 22,
    "username": "deploy",
    "privateKey": "~/.ssh/id_rsa"
  },
  "build": {
    "projectPath": "./website",
    "buildCommand": "npm run build",
    "outputDir": "dist"
  },
  "deploy": {
    "remotePath": "/var/www/my-website",
    "backup": true,
    "backupDir": "/var/www/backups"
  }
}
```

## 开发

1. 克隆仓库
2. 安装依赖：`npm install`
3. 构建项目：`npm run build`
4. 运行开发模式：`npm run dev`

## 注意事项

1. 确保远程服务器的目标目录具有适当的写入权限
2. 如果启用备份功能，确保备份目录具有足够的存储空间
3. 建议使用 SSH 密钥认证而不是密码认证
4. 在首次部署到生产环境之前，建议在测试环境中验证配置

## 许可证

ISC