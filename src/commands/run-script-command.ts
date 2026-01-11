import { Script } from '../models/script';
import { IScriptExecutor } from '../core/script-executor';
import { IPackageManagerDetector } from '../core/package-manager-detector';
import { ICommand } from '../models/command';
import * as vscode from 'vscode';

/**
 * Command to execute a script
 */
export class RunScriptCommand implements ICommand {
  readonly id = 'quickScriptsRunner.runScript';

  constructor(
    private readonly scriptExecutor: IScriptExecutor,
    private readonly packageManagerDetector: IPackageManagerDetector
  ) {}

  /**
   * Executes the command
   */
  async execute(script: Script, workspaceFolder?: vscode.WorkspaceFolder): Promise<void> {
    let activeWorkspace = workspaceFolder;

    if (!activeWorkspace) {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor?.document.uri) {
        activeWorkspace = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
      }
    }

    if (!activeWorkspace) {
      activeWorkspace = vscode.workspace.workspaceFolders?.[0];
    }

    if (!activeWorkspace) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    const packageManager = this.packageManagerDetector.detect(activeWorkspace.uri.fsPath);

    this.scriptExecutor.execute(script, packageManager, activeWorkspace);
  }
}
