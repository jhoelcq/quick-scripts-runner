# Scripts Runner - VS Code Extension

A professional VS Code extension that allows you to execute `package.json` scripts with a single click from the sidebar, featuring automatic package manager detection.

## 🎯 Key Features

- ✅ **Automatic detection** of package managers (npm, pnpm, yarn, bun)
- ✅ **Sidebar view** displaying all available scripts
- ✅ **One-click execution** directly from the explorer
- ✅ **Auto-refresh** when `package.json` changes
- ✅ **Status bar** indicator showing the current package manager
- ✅ **Multi-workspace support**
- ✅ **Intuitive interface** with seamless user experience

## 📸 Screenshots

The extension adds a new "Scripts Runner" section in the explorer sidebar, displaying all available scripts from your `package.json`.

## 🚀 Installation

### From Marketplace (Coming Soon)

1. Open VS Code
2. Navigate to Extensions
3. Search for "Scripts Runner"
4. Click Install

### From Source

1. Clone this repository
2. Open the folder in VS Code
3. Run `pnpm install`
4. Press `F5` to open a new VS Code window with the extension loaded

## 📖 Usage

### Execute a Script

1. Open the explorer sidebar
2. Expand the "Scripts Runner" section
3. Click on any script to execute it
4. The script will run in an integrated terminal

### Refresh Scripts

- Click the refresh button (🔄) in the view title bar
- Or use the command: `Scripts Runner: Refresh Scripts`

### Change Package Manager

- Click the package manager button (📦) in the title bar
- Or click on the status bar item
- Select the desired package manager (npm, pnpm, yarn, bun)

### Open package.json

- Click the file button (📄) in the title bar
- Or use the command: `Scripts Runner: Open package.json`

## ⚙️ Configuration

The extension can be configured from VS Code settings:

### `scriptsRunner.defaultPackageManager`

Default package manager when automatic detection is not possible.

- **Values**: `npm`, `pnpm`, `yarn`, `bun`
- **Default**: `npm`

### `scriptsRunner.autoDetectPackageManager`

Enable or disable automatic package manager detection.

- **Values**: `true`, `false`
- **Default**: `true`

## 🎨 Supported Use Cases

The extension works with any project that has a `package.json`, including:

- ✅ **Node.js** - Standard Node.js projects
- ✅ **React/Vue/Angular** - Frontend frameworks
- ✅ **PHP/Symfony** - With custom scripts in package.json
- ✅ **Go** - With build commands defined
- ✅ **Python/Django** - With manage.py scripts
- ✅ **Ruby on Rails** - With custom scripts
- ✅ **Any project** with custom package.json

## 🧪 Development

### Prerequisites

- Node.js >= 18
- pnpm >= 10.0.0
- TypeScript 5.0+
- VS Code 1.70+

### Available Commands

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Watch mode (auto-compilation)
pnpm run watch

# Lint code
pnpm run lint

# Format code
pnpm run format

# Run tests
pnpm test
```

### Package Manager Enforcement

This project enforces pnpm as the package manager:

- `packageManager` field in `package.json` specifies pnpm version
- `preinstall` script blocks other package managers
- `engines` field requires pnpm >= 10.0.0

Attempting to use npm, yarn, or bun will be blocked automatically.

### Testing the Extension

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new window, open a project with a `package.json`
4. Check the "Scripts Runner" section in the explorer sidebar

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch using kebab-case (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `docs:` Documentation updates

### Branch Naming

Use kebab-case for branch names:

- ✅ `feature/add-new-command`
- ✅ `fix/package-manager-detection`
- ✅ `refactor/command-structure`

## 🐛 Reporting Issues

If you encounter any issues, please open an issue in the repository with:

- Description of the problem
- Steps to reproduce
- VS Code version
- Operating system
- Expected vs actual behavior

## 📧 Contact

For questions or suggestions, please open an issue in the repository.

**Author**: Francisco Luis Rios Vega  
**Email**: alckordev@gmail.com  
**Website**: https://alckor.dev

## 🙏 Acknowledgments

Original idea by [Jhoel Cordova](https://github.com/jhoelcq).

---

Made with ❤️ for the developer community
