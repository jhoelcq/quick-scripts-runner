import * as vscode from 'vscode';
import { ICommand } from '../models/command';

/**
 * Centralized command registry
 */
export class CommandRegistry {
  private commands: Map<string, ICommand> = new Map();

  /**
   * Registers a command
   */
  register(command: ICommand, context: vscode.ExtensionContext): void {
    if (this.commands.has(command.id)) {
      console.warn(`Command ${command.id} is already registered`);
      return;
    }

    this.commands.set(command.id, command);

    const disposable = vscode.commands.registerCommand(command.id, (...args) =>
      command.execute(...args)
    );

    context.subscriptions.push(disposable);
  }

  /**
   * Registers multiple commands
   */
  registerAll(commands: ICommand[], context: vscode.ExtensionContext): void {
    commands.forEach((command) => this.register(command, context));
  }

  /**
   * Gets a command by its ID
   */
  get(id: string): ICommand | undefined {
    return this.commands.get(id);
  }
}
