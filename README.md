# LinkedIn Auto Like & Comment Extension

A powerful Chrome extension that automates LinkedIn engagement by automatically liking and commenting on posts in your feed. Control the number of interactions and customize your comments through an intuitive popup interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions Required](#permissions-required)
- [Extension Structure](#extension-structure)
- [Safety Features](#safety-features)
- [History Tracking](#history-tracking)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## 🔍 Overview

LinkedIn Auto Like & Comment Extension is a Chrome extension designed to automate engagement on LinkedIn. It allows users to automatically like and comment on posts in their LinkedIn feed based on specified numbers. This tool is particularly useful for professionals looking to maintain consistent engagement on LinkedIn while managing their time efficiently.

## ✨ Features

- **Automated Likes**: Automatically like a specified number of posts in your LinkedIn feed
- **Automated Comments**: Post custom comments on a specified number of posts
- **Customizable Settings**: Set the exact number of likes and comments per run
- **Custom Comment Text**: Write your own comment text to personalize engagement
- **Safety Limits**: Built-in caps (50 per run) to prevent excessive automation
- **Confirmation Required**: Checkbox confirmation before running to prevent accidental execution
- **Real-time Status**: View status updates during automation execution
- **Results Display**: See which posts were liked and commented on after each run
- **History Tracking**: View complete history of all automation runs with details
- **Smart Detection**: Automatically finds visible posts and interaction buttons
- **Duplicate Prevention**: Avoids liking posts that are already liked
- **Human-like Behavior**: Random delays between actions to mimic natural behavior
- **Post Metadata**: Captures author names, post content, and URLs for each interaction

## 📦 Installation

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
   - Find "LinkedIn Auto Like & Comment" and click the pin icon

## 🚀 Usage

### Step-by-Step Guide

1. **Navigate to LinkedIn**
   - Open LinkedIn and go to your feed page
   - Scroll down to load some posts

2. **Open the Extension**
   - Click the extension icon in your browser toolbar

3. **Configure Settings**
   - **Number of posts to like**: Enter the number (e.g., 3)
   - **Number of posts to comment**: Enter the number (e.g., 2)
   - **Comment text**: Write your comment (required if commenting)

4. **Confirm and Run**
   - Check the confirmation checkbox
   - Click "Run Automation"

5. **View Results**
   - The extension will display:
     - Posts that were liked (with author and content preview)
     - Posts that were commented on (with the comment sent)
     - Direct links to open each post

6. **Check History**
   - Click "View History" to see all past automation runs
   - History includes timestamps, liked posts, and comments

### Example Configuration

```
Number of posts to like: 5
Number of posts to comment: 3
Comment text: "Great insights! Thanks for sharing."
✅ I understand this automates interactions on LinkedIn
```

## 🔐 Permissions Required

This extension requires the following permissions:

- **`activeTab`**: Access to the currently active tab to interact with LinkedIn
- **`scripting`**: Execute content scripts on LinkedIn pages for automation
- **`tabs`**: Query and interact with browser tabs
- **`storage`**: Store automation history locally
- **Host Permission** (`*://www.linkedin.com/*`): Run automation on LinkedIn pages

### Privacy Note
- All data is stored locally on your device
- No data is transmitted to external servers
- Automation history is saved in Chrome's local storage
- You can clear history anytime from the history page

## 📁 Extension Structure

```
tab-title-extension/
│
├── manifest.json          # Extension configuration and permissions
├── popup.html            # Popup interface HTML
├── popup.js              # Popup logic and message handling
├── content.js            # Main automation logic
├── history.html          # History viewer interface
├── history.js            # History display logic
└── README.md             # Project documentation
```

### File Descriptions

- **`manifest.json`**: Defines extension properties, permissions, and configuration
- **`popup.html`**: User interface for configuring and running automation
- **`popup.js`**: Handles user input, sends automation requests, displays results
- **`content.js`**: Core automation engine that finds posts, clicks buttons, posts comments
- **`history.html`**: Interface for viewing past automation runs
- **`history.js`**: Loads and displays automation history from storage

## 🛡️ Safety Features

### Built-in Protections

1. **Rate Limiting**: Maximum 50 likes/comments per run
2. **Confirmation Required**: Must check confirmation box before running
3. **Already-Liked Detection**: Skips posts that are already liked
4. **Random Delays**: 800-2200ms delays between actions to appear human-like
5. **Error Handling**: Gracefully handles failures without crashing
6. **LinkedIn-Only Warning**: Prompts confirmation if not on LinkedIn

### Recommended Usage

- Start with small numbers (3-5 likes, 2-3 comments)
- Don't run multiple times in quick succession
- Use varied, genuine comment text
- Monitor results to ensure proper functionality
- Respect LinkedIn's Terms of Service

## 📊 History Tracking

The extension maintains a complete history of all automation runs:

- **Run Timestamp**: Exact date and time of each run
- **Liked Posts**: List of all posts liked with author, content, and links
- **Commented Posts**: List of all posts commented on with the comment text
- **Storage Limit**: Keeps up to 500 most recent runs
- **Export**: View history in a dedicated page

### Viewing History

1. Click "View History" button in the popup
2. New tab opens showing all past runs
3. Each run shows:
   - Timestamp
   - Number of likes and comments
   - Details of each interaction
   - Links to posts

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
   - Test thoroughly on LinkedIn
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

## ⚠️ Disclaimer

This extension is for educational and productivity purposes. Users are responsible for:

- Complying with LinkedIn's Terms of Service
- Using automation responsibly and ethically
- Ensuring their account security
- Any consequences from using automated tools

The author is not responsible for any account restrictions or bans that may result from using this extension.

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

**Made with ❤️ by Ayush**
