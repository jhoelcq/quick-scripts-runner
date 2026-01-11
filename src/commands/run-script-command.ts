import { Script } from '../models/script';
import { IScriptExecutor } from '../core/script-executor';
import { IPackageManagerDetector } from '../core/package-manager-detector';
import { ICommand } from '../models/command';
import * as vscode from 'vscode';

/**
 * Command to execute a script
 */
export class RunScriptCommand implements ICommand {
  readonly id = 'scriptsRunner.runScript';

  constructor(
    private readonly scriptExecutor: IScriptExecutor,
    private readonly packageManagerDetector: IPackageManagerDetector
  ) {}

  /**
   * Executes the command
   */
  async execute(script: Script): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    const packageManager = this.packageManagerDetector.detect(workspaceFolder.uri.fsPath);

    this.scriptExecutor.execute(script, packageManager);
  }
}
