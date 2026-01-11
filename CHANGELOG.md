# Change Log

All notable changes to the "Scripts Runner" extension will be documented in this file.

## [1.0.0] - 2026-01-11

### Added

- Initial release of Scripts Runner
- Automatic package manager detection (npm, pnpm, yarn, bun)
- Sidebar view displaying all available scripts from `package.json`
- One-click script execution in integrated terminal
- Status bar indicator showing current package manager
- Auto-refresh when `package.json` or lock files change
- Commands:
  - Run script
  - Refresh scripts list
  - Change package manager
  - Open/create `package.json`
- Configuration options:
  - `scriptsRunner.defaultPackageManager`: Set default package manager
  - `scriptsRunner.autoDetectPackageManager`: Enable/disable auto-detection
- Multi-workspace support
- File watcher for automatic updates

### Features

- Support for npm, pnpm, yarn, and bun
- Automatic detection based on lock files
- Terminal reuse for same script execution
- Intuitive UI with icons and tooltips

---

## [Unreleased]

### Planned

- Script grouping and organization
- Custom script icons
- Script execution history
- Keyboard shortcuts for quick execution
