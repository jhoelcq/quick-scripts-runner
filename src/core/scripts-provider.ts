import * as vscode from 'vscode';
import { ScriptTreeItem } from './script-tree-item';
import { WorkspaceTreeItem } from './workspace-tree-item';
import { IPackageJsonReader } from '../services/package-json-reader';
import { IPackageManagerDetector } from './package-manager-detector';
import { Logger } from '../utils/logger';

type TreeItem = ScriptTreeItem | WorkspaceTreeItem;

/**
 * TreeDataProvider to display scripts in the sidebar
 */
export class ScriptsProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> =
    new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> =
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
   * Gets the active workspace folder based on the active editor
   */
  private getActiveWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    const activeEditor = vscode.window.activeTextEditor;
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      return undefined;
    }

    // If only one workspace, return it
    if (workspaceFolders.length === 1) {
      return workspaceFolders[0];
    }

    // If there's an active editor, find its workspace
    if (activeEditor?.document.uri) {
      const activeUri = activeEditor.document.uri;
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeUri);
      if (workspaceFolder) {
        return workspaceFolder;
      }
    }

    // Fallback to first workspace
    return workspaceFolders[0];
  }

  /**
   * Gets scripts for a specific workspace folder
   */
  private async getScriptsForWorkspace(
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<ScriptTreeItem[]> {
    const workspacePath = workspaceFolder.uri.fsPath;

    if (!this.packageJsonReader.exists(workspacePath)) {
      Logger.debug(`package.json does not exist in ${workspaceFolder.name}`);
      return [];
    }

    const scripts = await this.packageJsonReader.readScripts(workspacePath);

    if (scripts.length === 0) {
      Logger.debug(`No scripts available in ${workspaceFolder.name}`);
      return [];
    }

    const packageManager = this.packageManagerDetector.detect(workspacePath);

    return scripts.map((script) => new ScriptTreeItem(script, packageManager, workspaceFolder));
  }

  /**
   * Gets the child elements of the tree
   */
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      Logger.debug('No workspace open');
      return [];
    }

    // If element is a workspace, return its scripts
    if (element instanceof WorkspaceTreeItem) {
      return await this.getScriptsForWorkspace(element.workspaceFolder);
    }

    // If multiple workspaces, show them as folders
    if (workspaceFolders.length > 1) {
      const workspaceItems: WorkspaceTreeItem[] = [];

      for (const folder of workspaceFolders) {
        const scripts = await this.getScriptsForWorkspace(folder);
        if (scripts.length > 0) {
          workspaceItems.push(new WorkspaceTreeItem(folder, scripts));
        }
      }

      return workspaceItems;
    }

    // Single workspace: show scripts directly
    const activeWorkspace = this.getActiveWorkspaceFolder();
    if (activeWorkspace) {
      return await this.getScriptsForWorkspace(activeWorkspace);
    }

    return [];
  }

  /**
   * Gets the parent element
   */
  getParent(element: TreeItem): vscode.ProviderResult<TreeItem> {
    if (element instanceof ScriptTreeItem && element.workspaceFolder) {
      return new WorkspaceTreeItem(element.workspaceFolder, []);
    }
    return null;
  }

  /**
   * Gets the tree item representation
   */
  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }
}
