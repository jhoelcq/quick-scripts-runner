import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ICommand } from '../models/command';
import { Logger } from '../utils/logger';

/**
 * Command to open or create package.json
 */
export class OpenPackageJsonCommand implements ICommand {
  readonly id = 'scriptsRunner.openPackageJson';

  /**
   * Executes the command
   */
  async execute(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace open');
      return;
    }

    const packageJsonPath = path.join(workspaceFolder.uri.fsPath, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const document = await vscode.workspace.openTextDocument(packageJsonPath);
      await vscode.window.showTextDocument(document);
      Logger.info('package.json opened');
    } else {
      const result = await vscode.window.showInformationMessage(
        'package.json not found. Do you want to create one?',
        'Create'
      );

      if (result === 'Create') {
        await this.createPackageJson(workspaceFolder.uri.fsPath);
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
