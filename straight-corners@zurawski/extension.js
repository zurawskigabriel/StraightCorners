/**
 * Straight Corners - GNOME Shell Extension
 *
 * Removes rounded corners from windows, buttons, and UI components.
 * Makes all corners sharp and straight.
 *
 * @author zurawski
 * @license GPL-3.0
 */

import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

/**
 * CSS styles for removing rounded corners from different UI elements.
 * Each category targets specific GNOME Shell components.
 */
const CssStyles = {
    /**
     * Removes rounded corners from application windows
     */
    Windows: `
        .window-frame,
        .window-frame:backdrop,
        decoration,
        decoration:backdrop,
        .csd decoration,
        .csd decoration:backdrop,
        .ssd decoration,
        .ssd decoration:backdrop,
        .solid-csd decoration,
        .solid-csd decoration:backdrop,
        window.background,
        window.dialog,
        window.messagedialog,
        .background,
        .titlebar,
        .titlebar:backdrop,
        headerbar,
        headerbar:backdrop,
        .popup-menu,
        .popup-menu-content {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from panel and top bar
     */
    Panel: `
        #panel,
        #panel .panel-corner,
        .panel-corner,
        #panelLeft,
        #panelCenter,
        #panelRight,
        .panel-button,
        .panel-button:hover,
        .panel-button:active,
        .panel-button:focus,
        .panel-button:checked,
        .panel-button:overview,
        .panel-button.clock-display,
        .panel-button.clock-display:hover,
        .panel-button.clock-display:active,
        .clock-display-box,
        .clock-display-box:hover,
        #panelActivities,
        #panelActivities:hover,
        #panelActivities:active,
        #panelActivities:overview,
        #appMenu,
        #appMenu:hover,
        #appMenu:active,
        .app-menu-icon,
        .system-status-icon,
        #quickSettings,
        #quickSettings:hover,
        #quickSettings:active,
        .quick-settings-indicator,
        #dateMenu,
        #dateMenu:hover,
        #dateMenu:active,
        .date-menu-button,
        .date-menu-button:hover,
        .date-menu-button:active {
            border-radius: 0 !important;
        }
        
        .panel-corner {
            -panel-corner-radius: 0 !important;
            -panel-corner-background-color: transparent !important;
            -panel-corner-border-width: 0 !important;
            -panel-corner-border-color: transparent !important;
        }
    `,

    /**
     * Removes rounded corners from buttons throughout the shell
     */
    Buttons: `
        .button,
        .button:hover,
        .button:active,
        .button:focus,
        .button:checked,
        .button:insensitive,
        StButton,
        StButton:hover,
        StButton:active,
        StButton:focus,
        StButton:checked,
        .modal-dialog-linked-button,
        .notification-button,
        .hotplug-notification-item-button,
        .app-view-control,
        .icon-button,
        .message-list-clear-button,
        .world-clocks-button,
        .weather-button,
        .events-button,
        .dnd-button,
        .message-media-control {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from dialogs and modal windows
     */
    Dialogs: `
        .modal-dialog,
        .modal-dialog .modal-dialog-content-box,
        .message-dialog-content,
        .dialog-content-box,
        .end-session-dialog,
        .run-dialog,
        .run-dialog-entry,
        .prompt-dialog,
        .polkit-dialog,
        .access-dialog,
        .audio-selection-dialog,
        .geolocation-dialog,
        .keyboard-layout-dialog,
        .night-light-dialog,
        .policykit-dialog {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from the overview and workspace views
     */
    Overview: `
        .search-entry,
        .search-entry:focus,
        .search-entry:hover,
        .overview-icon,
        .app-well-app,
        .app-well-app .overview-icon,
        .show-apps,
        .show-apps .overview-icon,
        .workspace-thumbnail,
        .workspace-thumbnail-indicator,
        .ws-switcher-indicator,
        .ws-switcher-box,
        .workspace-animation,
        .search-provider-icon,
        .list-search-result,
        .list-search-result-content,
        .search-section-content {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from notifications
     */
    Notifications: `
        .notification,
        .notification-banner,
        .notification-content,
        .notification:focus,
        .notification-body,
        .summary-source,
        .notification-button,
        .notification-icon-button,
        .notification-unexpanded,
        .notification-expanded,
        .chat-notification,
        .message,
        .message:hover,
        .message:focus,
        .message-content,
        .message-title,
        .url-highlighter {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from menus (popup menus, context menus)
     */
    Menus: `
        .popup-menu,
        .popup-menu-boxpointer,
        .popup-menu-content,
        .popup-menu-item,
        .popup-menu-item:hover,
        .popup-menu-item:active,
        .popup-menu-item:focus,
        .popup-menu-item:checked,
        .popup-sub-menu,
        .popup-separator-menu-item,
        .popup-menu-arrow,
        .popup-menu-ornament,
        .candidate-popup-boxpointer,
        .candidate-popup-content,
        .aggregate-menu,
        .quick-settings,
        .quick-settings-menu,
        .quick-settings-grid,
        .quick-settings-box,
        .quick-toggle,
        .quick-toggle:hover,
        .quick-toggle:active,
        .quick-toggle:checked,
        .quick-toggle:focus,
        .quick-toggle-icon,
        .quick-toggle-label,
        .quick-menu-toggle,
        .quick-menu-toggle:hover,
        .quick-menu-toggle:active,
        .quick-menu-toggle:checked,
        .quick-toggle-menu,
        .quick-toggle-menu-item,
        .quick-toggle-menu-item:hover,
        .quick-toggle-menu-item:checked,
        .quick-slider,
        .quick-slider:hover,
        .slider,
        .slider:hover,
        .background-menu,
        .system-menu-action,
        .system-menu-action:hover,
        .nm-dialog,
        .nm-dialog-item,
        .nm-dialog-item:hover {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from OSD (On-Screen Display) elements
     */
    Osd: `
        .osd-window,
        .osd-monitor-label,
        .level,
        .level-bar,
        .osd-bar,
        .screenshot-ui-panel,
        .screenshot-ui-type-button,
        .screenshot-ui-type-button:hover,
        .screenshot-ui-type-button:active,
        .screenshot-ui-type-button:checked,
        .screenshot-ui-show-pointer-button,
        .screenshot-ui-shot-button,
        .screenshot-ui-window-selector,
        .screenshot-ui-window-selector-window {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from the dash (dock)
     */
    Dash: `
        #dash,
        .dash-background,
        .dash-item-container,
        .app-well-app,
        .show-apps,
        .dash-separator,
        .focused,
        .running,
        .app-well-app-running-dot {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from calendar and date menu
     */
    Calendar: `
        .calendar,
        .calendar-month-label,
        .calendar-day-base,
        .calendar-day,
        .calendar-today,
        .calendar-day-heading,
        .calendar-day-with-events,
        .calendar-work-day,
        .calendar-nonwork-day,
        .calendar-week-number,
        .calendar-change-month-back,
        .calendar-change-month-forward,
        .datemenu-calendar-column,
        .datemenu-today-button,
        .datemenu-displays-section,
        .datemenu-displays-box,
        .message-list,
        .message-list-section,
        .message-list-section-title,
        .message-list-section-list,
        .world-clocks-grid,
        .world-clocks-header,
        .weather-header,
        .weather-grid,
        .events-section-title,
        .events-list,
        .dnd-switch,
        .dnd-switch:hover,
        .dnd-switch:checked,
        .do-not-disturb,
        .do-not-disturb-switch,
        .do-not-disturb-switch:checked {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from login/lock screen
     */
    LockScreen: `
        .unlock-dialog,
        .unlock-dialog-button,
        .login-dialog,
        .login-dialog-button,
        .login-dialog-prompt-entry,
        .screen-shield,
        .screen-shield-arrow,
        .user-widget,
        .user-icon,
        .framed-user-icon {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from tooltips and labels
     */
    Tooltips: `
        .tooltip,
        .dash-label,
        .app-tooltip,
        .switcher-list,
        .switcher-list-item-container,
        .thumbnail-scroll-gradient-left,
        .thumbnail-scroll-gradient-right {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from entries and text inputs
     */
    Entries: `
        StEntry,
        StEntry:focus,
        StEntry:hover,
        .entry,
        .entry:focus,
        .entry:hover,
        .search-entry,
        .search-entry:focus,
        .search-entry:hover,
        .run-dialog-entry,
        .login-dialog-prompt-entry {
            border-radius: 0 !important;
        }
    `,

    /**
     * Removes rounded corners from switches and toggles
     */
    Switches: `
        .toggle-switch,
        .toggle-switch:hover,
        .toggle-switch:active,
        .toggle-switch:checked,
        .toggle-switch:checked:hover,
        .toggle-switch:checked:active,
        .toggle-switch-us,
        .toggle-switch-intl,
        .slider,
        .slider:hover,
        .slider:active,
        .slider:focus,
        .quick-toggle,
        .quick-toggle:hover,
        .quick-toggle:active,
        .quick-toggle:focus,
        .quick-toggle:checked,
        .quick-toggle:checked:hover,
        .quick-toggle:checked:active,
        .quick-toggle-arrow,
        .quick-menu-toggle,
        .quick-menu-toggle:hover,
        .quick-menu-toggle:active,
        .quick-menu-toggle:checked,
        .quick-toggle-menu,
        .quick-toggle-menu-item,
        .quick-settings-button,
        .quick-settings-button:hover,
        .quick-settings-button:checked,
        .quick-settings-system-item,
        .dnd-switch,
        .dnd-switch:hover,
        .dnd-switch:checked {
            border-radius: 0 !important;
        }
    `
};

/**
 * Main Extension Class
 * Handles enabling and disabling the straight corners effect
 */
export default class StraightCornersExtension extends Extension {
    /**
     * The custom stylesheet provider
     * @type {St.ThemeContext|null}
     */
    _styleProvider = null;

    /**
     * Settings instance
     * @type {Gio.Settings|null}
     */
    _settings = null;

    /**
     * Signal connection IDs for settings changes
     * @type {number[]}
     */
    _settingsConnections = [];

    /**
     * List of available style categories with their settings keys
     * @type {Object[]}
     */
    _categories = [
        { key: 'windows-enabled', style: 'Windows' },
        { key: 'panel-enabled', style: 'Panel' },
        { key: 'buttons-enabled', style: 'Buttons' },
        { key: 'dialogs-enabled', style: 'Dialogs' },
        { key: 'overview-enabled', style: 'Overview' },
        { key: 'notifications-enabled', style: 'Notifications' },
        { key: 'menus-enabled', style: 'Menus' },
        { key: 'osd-enabled', style: 'Osd' },
        { key: 'dash-enabled', style: 'Dash' },
        { key: 'calendar-enabled', style: 'Calendar' },
        { key: 'lock-screen-enabled', style: 'LockScreen' },
        { key: 'tooltips-enabled', style: 'Tooltips' },
        { key: 'entries-enabled', style: 'Entries' },
        { key: 'switches-enabled', style: 'Switches' }
    ];

    /**
     * GTK configuration paths
     */
    _gtkPaths = {
        gtk4Dir: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-4.0']),
        gtk3Dir: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-3.0']),
        gtk4Css: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-4.0', 'gtk.css']),
        gtk3Css: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-3.0', 'gtk.css']),
        gtk4Backup: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-4.0', 'gtk.css.straight-corners-backup']),
        gtk3Backup: GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-3.0', 'gtk.css.straight-corners-backup'])
    };

    /**
     * Enable the extension
     * Called when the extension is enabled
     */
    enable() {
        this._settings = this.getSettings();
        this._loadStyles();
        this._syncGtkStyles();
        this._connectSettings();
    }

    /**
     * Disable the extension
     * Called when the extension is disabled
     */
    disable() {
        this._disconnectSettings();
        this._unloadStyles();
        this._settings = null;
    }

    /**
     * Connect settings change signals
     */
    _connectSettings() {
        for (const category of this._categories) {
            const connectionId = this._settings.connect(
                `changed::${category.key}`,
                () => this._reloadStyles()
            );
            this._settingsConnections.push(connectionId);
        }

        // Connect GTK settings
        const gtk4ConnectionId = this._settings.connect(
            'changed::gtk4-apps-enabled',
            () => this._handleGtk4Toggle()
        );
        this._settingsConnections.push(gtk4ConnectionId);

        const gtk3ConnectionId = this._settings.connect(
            'changed::gtk3-apps-enabled',
            () => this._handleGtk3Toggle()
        );
        this._settingsConnections.push(gtk3ConnectionId);
    }

    /**
     * Disconnect settings change signals
     */
    _disconnectSettings() {
        for (const connectionId of this._settingsConnections) {
            this._settings.disconnect(connectionId);
        }
        this._settingsConnections = [];
    }

    /**
     * Sync GTK styles on enable (in case extension was enabled with GTK options already on)
     */
    _syncGtkStyles() {
        if (this._settings.get_boolean('gtk4-apps-enabled')) {
            this._applyGtkStyle('gtk4');
        }
        if (this._settings.get_boolean('gtk3-apps-enabled')) {
            this._applyGtkStyle('gtk3');
        }
    }

    /**
     * Handle GTK4 toggle change
     */
    _handleGtk4Toggle() {
        if (this._settings.get_boolean('gtk4-apps-enabled')) {
            this._applyGtkStyle('gtk4');
        } else {
            this._restoreGtkStyle('gtk4');
        }
    }

    /**
     * Handle GTK3 toggle change
     */
    _handleGtk3Toggle() {
        if (this._settings.get_boolean('gtk3-apps-enabled')) {
            this._applyGtkStyle('gtk3');
        } else {
            this._restoreGtkStyle('gtk3');
        }
    }

    /**
     * Apply GTK straight corners style
     * @param {string} version - 'gtk3' or 'gtk4'
     */
    _applyGtkStyle(version) {
        try {
            const isGtk4 = version === 'gtk4';
            const cssPath = isGtk4 ? this._gtkPaths.gtk4Css : this._gtkPaths.gtk3Css;
            const backupPath = isGtk4 ? this._gtkPaths.gtk4Backup : this._gtkPaths.gtk3Backup;
            const dirPath = isGtk4 ? this._gtkPaths.gtk4Dir : this._gtkPaths.gtk3Dir;
            const sourceFileName = isGtk4 ? 'gtk4-straight-corners.css' : 'gtk3-straight-corners.css';

            // Ensure directory exists
            const dir = Gio.File.new_for_path(dirPath);
            if (!dir.query_exists(null)) {
                dir.make_directory_with_parents(null);
            }

            const cssFile = Gio.File.new_for_path(cssPath);
            const backupFile = Gio.File.new_for_path(backupPath);

            // Backup existing file if it exists and no backup exists yet
            if (cssFile.query_exists(null) && !backupFile.query_exists(null)) {
                cssFile.copy(backupFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                console.log(`[Straight Corners] Backed up ${version} CSS to ${backupPath}`);
            }

            // Read our custom CSS from extension directory
            const sourceFile = Gio.File.new_for_path(
                GLib.build_filenamev([this.path, sourceFileName])
            );

            if (sourceFile.query_exists(null)) {
                // Copy our CSS to the target location
                sourceFile.copy(cssFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                console.log(`[Straight Corners] Applied ${version} straight corners style`);
            } else {
                console.error(`[Straight Corners] Source CSS file not found: ${sourceFileName}`);
            }
        } catch (error) {
            console.error(`[Straight Corners] Error applying ${version} style: ${error.message}`);
        }
    }

    /**
     * Restore original GTK style from backup
     * @param {string} version - 'gtk3' or 'gtk4'
     */
    _restoreGtkStyle(version) {
        try {
            const isGtk4 = version === 'gtk4';
            const cssPath = isGtk4 ? this._gtkPaths.gtk4Css : this._gtkPaths.gtk3Css;
            const backupPath = isGtk4 ? this._gtkPaths.gtk4Backup : this._gtkPaths.gtk3Backup;

            const cssFile = Gio.File.new_for_path(cssPath);
            const backupFile = Gio.File.new_for_path(backupPath);

            if (backupFile.query_exists(null)) {
                // Restore from backup
                backupFile.copy(cssFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                backupFile.delete(null);
                console.log(`[Straight Corners] Restored ${version} CSS from backup`);
            } else if (cssFile.query_exists(null)) {
                // No backup means we created the file, so delete it
                // But first check if it's our file
                const [success, contents] = cssFile.load_contents(null);
                if (success) {
                    const text = new TextDecoder().decode(contents);
                    if (text.includes('Straight Corners')) {
                        cssFile.delete(null);
                        console.log(`[Straight Corners] Removed ${version} straight corners style`);
                    }
                }
            }
        } catch (error) {
            console.error(`[Straight Corners] Error restoring ${version} style: ${error.message}`);
        }
    }

    /**
     * Build the combined CSS from enabled categories
     * @returns {string} Combined CSS string
     */
    _buildCss() {
        let css = '/* Straight Corners Extension - Auto-generated CSS */\n\n';

        for (const category of this._categories) {
            if (this._settings.get_boolean(category.key)) {
                css += `/* ${category.style} */\n`;
                css += CssStyles[category.style];
                css += '\n\n';
            }
        }

        return css;
    }

    /**
     * Load custom styles into the theme
     */
    _loadStyles() {
        const css = this._buildCss();

        if (!css.trim()) {
            return;
        }

        try {
            const themeContext = St.ThemeContext.get_for_stage(global.stage);
            const theme = themeContext.get_theme();

            // Create a temporary file with the CSS
            const cssFile = Gio.File.new_for_path(
                GLib.build_filenamev([this.path, 'dynamic-style.css'])
            );

            // Write CSS to file
            const [success, tag] = cssFile.replace_contents(
                new TextEncoder().encode(css),
                null,
                false,
                Gio.FileCreateFlags.REPLACE_DESTINATION,
                null
            );

            if (success) {
                // Load the stylesheet
                theme.load_stylesheet(cssFile);
                this._styleProvider = cssFile;
            }
        } catch (error) {
            console.error(`[Straight Corners] Error loading styles: ${error.message}`);
        }
    }

    /**
     * Unload custom styles from the theme
     */
    _unloadStyles() {
        if (this._styleProvider) {
            try {
                const themeContext = St.ThemeContext.get_for_stage(global.stage);
                const theme = themeContext.get_theme();
                theme.unload_stylesheet(this._styleProvider);

                // Delete the temporary CSS file
                this._styleProvider.delete(null);
            } catch (error) {
                console.error(`[Straight Corners] Error unloading styles: ${error.message}`);
            }
            this._styleProvider = null;
        }
    }

    /**
     * Reload styles after settings change
     */
    _reloadStyles() {
        this._unloadStyles();
        this._loadStyles();
    }
}
