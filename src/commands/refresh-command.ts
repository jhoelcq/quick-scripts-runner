import { ScriptsProvider } from '../core/scripts-provider';
import { ICommand } from '../models/command';
import * as vscode from 'vscode';

/**
 * Command to refresh the scripts list
 */
export class RefreshCommand implements ICommand {
  readonly id = 'quickScriptsRunner.refresh';

  constructor(private readonly scriptsProvider: ScriptsProvider) {}

  /**
   * Executes the command
   */
  async execute(): Promise<void> {
    this.scriptsProvider.refresh();
    vscode.window.showInformationMessage('Scripts updated');
  }
}
