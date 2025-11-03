# Tab Title Extension

A simple and efficient Chrome extension that displays the current tab's title in an elegant popup interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions Required](#permissions-required)
- [Extension Structure](#extension-structure)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## 🔍 Overview

Tab Title Extension is a lightweight Chrome extension designed to help users quickly view and copy the title of their current browser tab. This can be particularly useful for developers, researchers, or anyone who needs to reference or document web page titles.

## ✨ Features

- **Instant Tab Title Display**: Click the extension icon to instantly see the current tab's title
- **Clean UI**: Simple and intuitive popup interface
- **Lightweight**: Minimal resource usage with no background processes
- **Fast Performance**: Quick load times with optimized code
- **No Data Collection**: Your browsing data stays private

## 📦 Installation

### Install from Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store page
2. Click "Add to Chrome"
3. Confirm the installation

### Install from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush10web/tab-title-extension.git
   cd tab-title-extension
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right corner
   - Click "Load unpacked"
   - Select the cloned repository folder

3. **Pin the extension** (optional)
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Tab Title Extension" and click the pin icon

## 🚀 Usage

1. Navigate to any webpage in Chrome
2. Click the Tab Title Extension icon in your browser toolbar
3. The popup will display the current tab's title
4. That's it! Simple and straightforward

## 🔐 Permissions Required

This extension requires the following permissions:

- **`activeTab`**: Allows the extension to access the title of the currently active tab
  - This permission is only used when you click the extension icon
  - No persistent access to your browsing activity
  - No data is stored or transmitted

## 📁 Extension Structure

```
tab-title-extension/
│
├── manifest.json       # Extension configuration and metadata
├── popup.html          # Popup interface HTML structure
├── popup.js            # JavaScript logic for fetching and displaying tab title
└── README.md           # Project documentation
```

### File Descriptions

- **`manifest.json`**: Defines the extension's properties, permissions, and browser action
- **`popup.html`**: Contains the UI structure displayed when the extension icon is clicked
- **`popup.js`**: Implements the logic to query the active tab and display its title

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this extension, please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tab-title-extension.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Ensure code quality and consistency
   - Test thoroughly in Chrome
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes in detail

### Contribution Guidelines

- Write clear, concise commit messages
- Follow existing code style and conventions
- Test your changes before submitting
- Update README.md if you add new features
- Be respectful and constructive in discussions

## 👨‍💻 Author

**Ayush10web**

- GitHub: [@Ayush10web](https://github.com/Ayush10web)
- Repository: [tab-title-extension](https://github.com/Ayush10web/tab-title-extension)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 Support

If you find this extension helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or issues
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

## 📞 Contact

For questions, suggestions, or issues, please:
- Open an issue on [GitHub Issues](https://github.com/Ayush10web/tab-title-extension/issues)
- Submit a pull request for improvements

---

**Made with ❤️ by Ayush
