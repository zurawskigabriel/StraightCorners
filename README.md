# Straight Corners

<p align="center">
  <img src="https://img.shields.io/badge/GNOME-46-4A86CF?style=for-the-badge&logo=gnome&logoColor=white" alt="GNOME 46">
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge" alt="License">
</p>

A GNOME Shell extension that removes rounded corners from windows, buttons, and UI components, giving your desktop a sharp, modern aesthetic.

## 🎯 Features

- **Removes rounded corners** from all GNOME Shell UI elements
- **Granular control** - Enable/disable straight corners for different UI categories
- **14 customizable categories** including:
  - Windows and dialogs
  - Top panel and buttons
  - Menus and quick settings
  - Notifications
  - Overview and dash
  - Calendar and OSD
  - And more!
- **Live preview** - Changes apply instantly without restart

## 🚀 Installation

### From GNOME Extensions Website (Recommended)

1. Visit [Straight Corners on extensions.gnome.org](https://extensions.gnome.org/extension/straight-corners/)
2. Click the toggle to install
3. Allow the installation in your browser

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/zurawski/straight-corners.git

# Navigate to the extension directory
cd straight-corners

# Copy to GNOME Shell extensions directory
cp -r straight-corners@zurawski ~/.local/share/gnome-shell/extensions/

# Compile the settings schema
glib-compile-schemas ~/.local/share/gnome-shell/extensions/straight-corners@zurawski/schemas/

# Enable the extension
gnome-extensions enable straight-corners@zurawski
```

### Restart GNOME Shell

- **Xorg**: Press `Alt+F2`, type `r`, and press Enter
- **Wayland**: Log out and log back in

## ⚙️ Configuration

Open the extension preferences through:

1. **GNOME Extensions app** (recommended)
2. **Extensions** application on Ubuntu
3. Command line: `gnome-extensions prefs straight-corners@zurawski`

## 🔧 Requirements (only tested in this configuration)

- GNOME Shell 46
- Ubuntu 24.04 LTS or equivalent


## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
