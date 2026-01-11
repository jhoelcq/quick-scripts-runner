import * as vscode from 'vscode';
import { PackageManager, PACKAGE_MANAGER_INFO } from '../models/package-manager';

/**
 * Interface for status bar service
 */
export interface IStatusBarService {
  update(packageManager: PackageManager): void;
  show(): void;
  hide(): void;
  dispose(): void;
}

/**
 * Implementation of status bar service
 */
export class StatusBarService implements IStatusBarService {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.statusBarItem.command = 'quickScriptsRunner.changePackageManager';
  }

  /**
   * Updates the status bar with the package manager
   */
  update(packageManager: PackageManager): void {
    const info = PACKAGE_MANAGER_INFO[packageManager];
    this.statusBarItem.text = `${info.icon} ${packageManager}`;
    this.statusBarItem.tooltip = `Package manager: ${packageManager}`;
    this.show();
  }

  /**
   * Shows the status bar item
   */
  show(): void {
    this.statusBarItem.show();
  }

  /**
   * Hides the status bar item
   */
  hide(): void {
    this.statusBarItem.hide();
  }

  /**
   * Disposes the status bar item resources
   */
  dispose(): void {
    this.statusBarItem.dispose();
  }
}
