import * as vscode from 'vscode';
import { Script } from '../models/script';
import { PackageManager } from '../models/package-manager';
import { Logger } from '../utils/logger';

/**
 * Interface for script executor
 */
export interface IScriptExecutor {
  execute(
    script: Script,
    packageManager: PackageManager,
    workspaceFolder: vscode.WorkspaceFolder
  ): void;
}

/**
 * Implementation of script executor
 */
export class ScriptExecutor implements IScriptExecutor {
  /**
   * Executes a script in the integrated terminal
   */
  execute(
    script: Script,
    packageManager: PackageManager,
    workspaceFolder: vscode.WorkspaceFolder
  ): void {
    try {
      const terminalName = `${workspaceFolder.name}: ${packageManager} ${script.name}`;
      const command = `${packageManager} run ${script.name}`;

      let terminal = vscode.window.terminals.find((t) => t.name === terminalName);

      if (!terminal) {
        const terminalOptions: vscode.TerminalOptions = {
          name: terminalName,
          cwd: workspaceFolder.uri.fsPath,
        };
        terminal = vscode.window.createTerminal(terminalOptions);
      }

      terminal.show();
      terminal.sendText(command);

      Logger.info(`Executing: ${command} in workspace: ${workspaceFolder.name}`);
    } catch (error) {
      Logger.error('Error executing script', error as Error);
      vscode.window.showErrorMessage(`Error executing script: ${script.name}`);
    }
  }
}
