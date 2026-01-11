import * as vscode from 'vscode';
import { ScriptTreeItem } from './script-tree-item';
import { IPackageJsonReader } from '../services/package-json-reader';
import { IPackageManagerDetector } from './package-manager-detector';
import { Logger } from '../utils/logger';

/**
 * TreeDataProvider to display scripts in the sidebar
 */
export class ScriptsProvider implements vscode.TreeDataProvider<ScriptTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ScriptTreeItem | undefined | null | void> =
    new vscode.EventEmitter<ScriptTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ScriptTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private readonly packageJsonReader: IPackageJsonReader,
    private readonly packageManagerDetector: IPackageManagerDetector
  ) {}

  /**
   * Refreshes the tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Gets the child elements of the tree
   */
  async getChildren(): Promise<ScriptTreeItem[]> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      Logger.debug('No workspace open');
      return [];
    }

    const workspacePath = workspaceFolder.uri.fsPath;

    if (!this.packageJsonReader.exists(workspacePath)) {
      Logger.debug('package.json does not exist');
      return [];
    }

    const scripts = await this.packageJsonReader.readScripts(workspacePath);

    if (scripts.length === 0) {
      Logger.debug('No scripts available');
      return [];
    }

    const packageManager = this.packageManagerDetector.detect(workspacePath);

    return scripts.map((script) => new ScriptTreeItem(script, packageManager));
  }

  /**
   * Gets the parent element (not used in this case)
   */
  getTreeItem(element: ScriptTreeItem): vscode.TreeItem {
    return element;
  }
}
