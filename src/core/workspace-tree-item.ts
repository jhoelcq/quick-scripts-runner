import * as vscode from 'vscode';
import { ScriptTreeItem } from './script-tree-item';

/**
 * TreeItem to represent a workspace folder
 */
export class WorkspaceTreeItem extends vscode.TreeItem {
  constructor(
    public readonly workspaceFolder: vscode.WorkspaceFolder,
    public readonly children: ScriptTreeItem[]
  ) {
    super(workspaceFolder.name, vscode.TreeItemCollapsibleState.Expanded);
    this.contextValue = 'workspace';
    this.iconPath = new vscode.ThemeIcon('folder');
    this.tooltip = `Workspace: ${workspaceFolder.name}\nPath: ${workspaceFolder.uri.fsPath}`;
  }
}
