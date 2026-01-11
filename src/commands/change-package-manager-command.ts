import * as vscode from 'vscode';
import { PackageManager, PACKAGE_MANAGER_INFO } from '../models/package-manager';
import { IConfigurationService } from '../services/configuration-service';
import { ScriptsProvider } from '../core/scripts-provider';
import { IStatusBarService } from '../services/status-bar-service';
import { ICommand } from '../models/command';
import { Logger } from '../utils/logger';

/**
 * Command to change the package manager
 */
export class ChangePackageManagerCommand implements ICommand {
  readonly id = 'scriptsRunner.changePackageManager';

  constructor(
    private readonly configService: IConfigurationService,
    private readonly scriptsProvider: ScriptsProvider,
    private readonly statusBarService: IStatusBarService
  ) {}

  /**
   * Executes the command
   */
  async execute(): Promise<void> {
    const options = Object.values(PackageManager).map((pm) => {
      const info = PACKAGE_MANAGER_INFO[pm];
      return {
        label: `${info.icon} ${pm}`,
        description: `Use ${pm} as package manager`,
        packageManager: pm,
      };
    });

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select a package manager',
    });

    if (!selected) {
      return;
    }

    try {
      await this.configService.setDefaultPackageManager(selected.packageManager);
      this.statusBarService.update(selected.packageManager);
      this.scriptsProvider.refresh();

      vscode.window.showInformationMessage(
        `Package manager changed to: ${selected.packageManager}`
      );
      Logger.info(`Package manager changed to: ${selected.packageManager}`);
    } catch (error) {
      Logger.error('Error changing package manager', error as Error);
      vscode.window.showErrorMessage('Error changing package manager');
    }
  }
}
