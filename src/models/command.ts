/**
 * Base interface for all extension commands
 */
export interface ICommand {
  readonly id: string;
  execute(...args: unknown[]): void | Promise<void>;
}
