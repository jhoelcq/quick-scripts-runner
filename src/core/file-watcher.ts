import * as vscode from 'vscode';
import { ScriptsProvider } from './scripts-provider';
import { IStatusBarService } from '../services/status-bar-service';
import { IPackageManagerDetector } from './package-manager-detector';
import { Logger } from '../utils/logger';

/**
 * Watches for changes in relevant files and updates the view
 */
export class FileWatcher {
  private disposables: vscode.Disposable[] = [];

  constructor(
    private readonly scriptsProvider: ScriptsProvider,
    private readonly statusBarService: IStatusBarService,
    private readonly packageManagerDetector: IPackageManagerDetector
  ) {}

  /**
   * Initializes the file watcher
   */
  start(): void {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      Logger.debug('No workspace folders to watch');
      return;
    }

    // Create watchers for all workspace folders
    for (const folder of workspaceFolders) {
      const pattern = new vscode.RelativePattern(
        folder,
        '**/{package.json,*lock.yaml,*.lock,*.lockb}'
      );

      const watcher = vscode.workspace.createFileSystemWatcher(pattern);

      watcher.onDidChange(() => this.handleFileChange(folder));
      watcher.onDidCreate(() => this.handleFileChange(folder));
      watcher.onDidDelete(() => this.handleFileChange(folder));

      this.disposables.push(watcher);
    }

    Logger.info(`File watcher started for ${workspaceFolders.length} workspace(s)`);
  }

  /**
   * Handles changes in watched files
   */
  private handleFileChange(workspaceFolder: vscode.WorkspaceFolder): void {
    Logger.debug(`Relevant file modified in ${workspaceFolder.name}, refreshing...`);
    this.scriptsProvider.refresh();

    // Update status bar with active workspace
    let activeWorkspace: vscode.WorkspaceFolder | undefined = workspaceFolder;

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor?.document.uri) {
      const editorWorkspace = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
      if (editorWorkspace) {
        activeWorkspace = editorWorkspace;
      }
    }

    if (activeWorkspace) {
      const packageManager = this.packageManagerDetector.detect(activeWorkspace.uri.fsPath);
      this.statusBarService.update(packageManager);
    }
  }

  /**
   * Disposes file watcher resources
   */
  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    Logger.debug('File watcher stopped');
  }
}
