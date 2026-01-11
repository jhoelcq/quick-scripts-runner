import * as vscode from 'vscode';
import { PackageManager } from '../models/package-manager';

/**
 * Interface for configuration service
 */
export interface IConfigurationService {
  getDefaultPackageManager(): PackageManager;
  setDefaultPackageManager(pm: PackageManager): Promise<void>;
  shouldAutoDetect(): boolean;
}

/**
 * Implementation of VS Code configuration service
 */
export class ConfigurationService implements IConfigurationService {
  private readonly configSection = 'quickScriptsRunner';

  /**
   * Gets the default package manager from configuration
   */
  getDefaultPackageManager(): PackageManager {
    const config = vscode.workspace.getConfiguration(this.configSection);
    const defaultPM = config.get<string>('defaultPackageManager', 'npm');

    const packageManager = Object.values(PackageManager).find((pm) => pm === defaultPM);

    return packageManager || PackageManager.NPM;
  }

  /**
   * Sets the default package manager
   */
  async setDefaultPackageManager(pm: PackageManager): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.configSection);
    await config.update('defaultPackageManager', pm, vscode.ConfigurationTarget.Workspace);
  }

  /**
   * Checks if package manager should be auto-detected
   */
  shouldAutoDetect(): boolean {
    const config = vscode.workspace.getConfiguration(this.configSection);
    return config.get<boolean>('autoDetectPackageManager', true);
  }
}
