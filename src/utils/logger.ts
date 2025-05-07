import chalk from 'chalk';

export class Logger {
  private static timestamp(): string {
    return new Date().toISOString().split('T')[1].split('.')[0];
  }

  static info(message: string): void {
    console.log(chalk.blue(`[${this.timestamp()}] INFO: ${message}`));
  }

  static success(message: string): void {
    console.log(chalk.green(`[${this.timestamp()}] SUCCESS: ${message}`));
  }

  static warn(message: string): void {
    console.log(chalk.yellow(`[${this.timestamp()}] WARNING: ${message}`));
  }

  static error(message: string): void {
    console.error(chalk.red(`[${this.timestamp()}] ERROR: ${message}`));
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[${this.timestamp()}] DEBUG: ${message}`));
    }
  }

  static task(name: string): void {
    console.log(chalk.cyan(`\n[${this.timestamp()}] TASK: ${name}`));
  }

  static progress(message: string): void {
    process.stdout.write(chalk.white(`[${this.timestamp()}] ${message}`));
  }

  static progressEnd(success = true): void {
    console.log(success ? chalk.green(' ✓') : chalk.red(' ✗'));
  }
}