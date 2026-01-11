import * as vscode from 'vscode';

/**
 * Logging service for the extension
 */
export class Logger {
  private static outputChannel: vscode.OutputChannel | undefined;

  /**
   * Initializes the output channel
   */
  static initialize(): void {
    if (!this.outputChannel) {
      this.outputChannel = vscode.window.createOutputChannel('Quick Scripts Runner');
    }
  }

  /**
   * Logs an info message
   */
  static info(message: string): void {
    this.log(`[INFO] ${message}`);
  }

  /**
   * Logs a warning message
   */
  static warn(message: string): void {
    this.log(`[WARN] ${message}`);
  }

  /**
   * Logs an error message
   */
  static error(message: string, error?: Error): void {
    const errorMessage = error ? `${message}: ${error.message}\n${error.stack}` : message;
    this.log(`[ERROR] ${errorMessage}`);
  }

  /**
   * Logs a debug message
   */
  static debug(message: string): void {
    this.log(`[DEBUG] ${message}`);
  }

  /**
   * Logs a message to the output channel
   */
  private static log(message: string): void {
    if (!this.outputChannel) {
      this.initialize();
    }
    const timestamp = new Date().toISOString();
    this.outputChannel?.appendLine(`[${timestamp}] ${message}`);
  }

  /**
   * Shows the output channel
   */
  static show(): void {
    this.outputChannel?.show();
  }

  /**
   * Disposes the output channel
   */
  static dispose(): void {
    this.outputChannel?.dispose();
    this.outputChannel = undefined;
  }
}
