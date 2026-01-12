import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ICommand } from '../models/command';
import { Logger } from '../utils/logger';

/**
 * Command to open or create package.json
 */
export class OpenPackageJsonCommand implements ICommand {
  readonly id = 'quickScriptsRunner.openPackageJson';

  /**
   * Executes the command
   */
  async execute(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    // Try to detect active workspace based on active editor
    let activeWorkspace: vscode.WorkspaceFolder | undefined;

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor?.document.uri) {
      activeWorkspace = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    }

    // If no active workspace detected, check if there are multiple workspaces with package.json
    if (!activeWorkspace && workspaceFolders.length > 1) {
      // Get all workspaces that have package.json
      const workspacesWithPackageJson = workspaceFolders.filter((folder) =>
        fs.existsSync(path.join(folder.uri.fsPath, 'package.json'))
      );

      if (workspacesWithPackageJson.length > 1) {
        // Show QuickPick to let user choose which workspace
        const selected = await vscode.window.showQuickPick(
          workspacesWithPackageJson.map((folder) => ({
            label: folder.name,
            description: folder.uri.fsPath,
            folder,
          })),
          {
            placeHolder: 'Select workspace to open package.json',
          }
        );

        if (!selected) {
          return; // User cancelled
        }

        activeWorkspace = selected.folder;
      } else if (workspacesWithPackageJson.length === 1) {
        activeWorkspace = workspacesWithPackageJson[0];
      } else {
        // No workspaces have package.json, use first one for creation
        activeWorkspace = workspaceFolders[0];
      }
    }

    // Fallback to first workspace if still no active workspace
    if (!activeWorkspace) {
      activeWorkspace = workspaceFolders[0];
    }

    const packageJsonPath = path.join(activeWorkspace.uri.fsPath, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const document = await vscode.workspace.openTextDocument(packageJsonPath);
      await vscode.window.showTextDocument(document);
      Logger.info(`package.json opened from workspace: ${activeWorkspace.name}`);
    } else {
      const result = await vscode.window.showInformationMessage(
        `package.json not found in ${activeWorkspace.name}. Do you want to create one?`,
        'Create'
      );

      if (result === 'Create') {
        await this.createPackageJson(activeWorkspace.uri.fsPath);
      }
    }
  }

  /**
   * Creates a basic package.json
   */
  private async createPackageJson(workspacePath: string): Promise<void> {
    try {
      const workspaceName = path.basename(workspacePath);
      const packageJson = {
        name: workspaceName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        scripts: {
          start: "echo 'Add your commands here'",
        },
      };

      const packageJsonPath = path.join(workspacePath, 'package.json');
      await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

      const document = await vscode.workspace.openTextDocument(packageJsonPath);
      await vscode.window.showTextDocument(document);

      vscode.window.showInformationMessage('package.json created successfully');
      Logger.info('package.json created');
    } catch (error) {
      Logger.error('Error creating package.json', error as Error);
      vscode.window.showErrorMessage('Error creating package.json');
    }
  }
}
