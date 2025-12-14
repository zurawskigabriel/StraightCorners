/**
 * Straight Corners - Preferences Window
 *
 * Provides a graphical interface for configuring the extension
 * using the GNOME Extensions application.
 *
 * @author zurawski
 * @license GPL-3.0
 */

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

/**
 * Configuration for each toggle option
 * @type {Object[]}
 */
const ToggleOptions = [
    {
        key: 'windows-enabled',
        title: 'Windows',
        subtitle: 'Application windows, dialogs, and window decorations',
        icon: 'window-new-symbolic'
    },
    {
        key: 'panel-enabled',
        title: 'Panel',
        subtitle: 'Top panel and panel buttons',
        icon: 'view-fullscreen-symbolic'
    },
    {
        key: 'buttons-enabled',
        title: 'Buttons',
        subtitle: 'All buttons throughout the shell',
        icon: 'input-mouse-symbolic'
    },
    {
        key: 'dialogs-enabled',
        title: 'Dialogs',
        subtitle: 'Modal dialogs and prompts',
        icon: 'dialog-information-symbolic'
    },
    {
        key: 'overview-enabled',
        title: 'Overview',
        subtitle: 'Search bar, app icons, and workspace thumbnails',
        icon: 'view-grid-symbolic'
    },
    {
        key: 'notifications-enabled',
        title: 'Notifications',
        subtitle: 'Notification banners and message trays',
        icon: 'preferences-system-notifications-symbolic'
    },
    {
        key: 'menus-enabled',
        title: 'Menus',
        subtitle: 'Popup menus, context menus, and quick settings',
        icon: 'open-menu-symbolic'
    },
    {
        key: 'osd-enabled',
        title: 'OSD',
        subtitle: 'On-screen displays (volume, brightness, etc.)',
        icon: 'video-display-symbolic'
    },
    {
        key: 'dash-enabled',
        title: 'Dash',
        subtitle: 'Dock and application icons',
        icon: 'view-app-grid-symbolic'
    },
    {
        key: 'calendar-enabled',
        title: 'Calendar',
        subtitle: 'Calendar and date menu elements',
        icon: 'x-office-calendar-symbolic'
    },
    {
        key: 'lock-screen-enabled',
        title: 'Lock Screen',
        subtitle: 'Lock screen and login dialog',
        icon: 'system-lock-screen-symbolic'
    },
    {
        key: 'tooltips-enabled',
        title: 'Tooltips',
        subtitle: 'Tooltips and labels',
        icon: 'dialog-question-symbolic'
    },
    {
        key: 'entries-enabled',
        title: 'Entries',
        subtitle: 'Text entries and input fields',
        icon: 'input-keyboard-symbolic'
    },
    {
        key: 'switches-enabled',
        title: 'Switches',
        subtitle: 'Toggle switches and sliders',
        icon: 'emblem-default-symbolic'
    }
];

/**
 * Extension Preferences Class
 * Creates the preferences window for the extension
 */
export default class StraightCornersPreferences extends ExtensionPreferences {
    /**
     * Fill the preferences window with content
     * @param {Adw.PreferencesWindow} window - The preferences window
     */
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Create the main preferences page
        const page = new Adw.PreferencesPage({
            title: 'Straight Corners',
            icon_name: 'preferences-other-symbolic'
        });
        window.add(page);

        // Create header group with description
        const headerGroup = new Adw.PreferencesGroup({
            title: 'About',
            description: 'Remove rounded corners from GNOME Shell UI elements. ' +
                        'Toggle each category to test which ones work for your setup.'
        });
        page.add(headerGroup);

        // Add quick actions row
        const quickActionsRow = this._createQuickActionsRow(settings);
        headerGroup.add(quickActionsRow);

        // Create UI Elements group
        const elementsGroup = new Adw.PreferencesGroup({
            title: 'GNOME Shell Elements',
            description: 'Select which GNOME Shell UI elements should have straight corners. Changes apply immediately.'
        });
        page.add(elementsGroup);

        // Add toggle rows for each option
        for (const option of ToggleOptions) {
            const row = this._createToggleRow(settings, option);
            elementsGroup.add(row);
        }

        // Create GTK Applications group
        const gtkGroup = new Adw.PreferencesGroup({
            title: 'GTK Applications',
            description: '⚠️ These options modify system GTK CSS files (~/.config/gtk-4.0/gtk.css and gtk-3.0/gtk.css). ' +
                        'A backup is created automatically. Applications need to be restarted to see changes.'
        });
        page.add(gtkGroup);

        // GTK4 Applications row
        const gtk4Row = this._createGtkToggleRow(settings, {
            key: 'gtk4-apps-enabled',
            title: 'GTK4 Applications',
            subtitle: 'Settings, Files, Extensions, Text Editor, and other modern GNOME apps',
            icon: 'application-x-executable-symbolic'
        });
        gtkGroup.add(gtk4Row);

        // GTK3 Applications row
        const gtk3Row = this._createGtkToggleRow(settings, {
            key: 'gtk3-apps-enabled',
            title: 'GTK3 Applications',
            subtitle: 'Firefox, older applications, and legacy GNOME apps',
            icon: 'application-x-executable-symbolic'
        });
        gtkGroup.add(gtk3Row);

        // Warning banner
        const warningRow = new Adw.ActionRow({
            title: 'ℹ️ Note',
            subtitle: 'GTK options modify ~/.config/gtk-{3,4}.0/gtk.css files. ' +
                     'Original files are backed up as gtk.css.straight-corners-backup. ' +
                     'Restart applications to apply changes.'
        });
        gtkGroup.add(warningRow);

        // Set window properties
        window.set_default_size(450, 750);
        window.set_search_enabled(true);
    }

    /**
     * Create a toggle row for a setting option
     * @param {Gio.Settings} settings - The extension settings
     * @param {Object} option - The option configuration
     * @returns {Adw.SwitchRow} The created switch row
     */
    _createToggleRow(settings, option) {
        const row = new Adw.SwitchRow({
            title: option.title,
            subtitle: option.subtitle,
            icon_name: option.icon
        });

        // Bind the switch to the setting
        settings.bind(
            option.key,
            row,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        return row;
    }

    /**
     * Create quick actions row for enabling/disabling all options
     * @param {Gio.Settings} settings - The extension settings
     * @returns {Adw.ActionRow} The created action row
     */
    _createQuickActionsRow(settings) {
        const row = new Adw.ActionRow({
            title: 'Quick Actions',
            subtitle: 'Enable or disable all options at once'
        });

        // Enable All button
        const enableButton = new Gtk.Button({
            label: 'Enable All',
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action']
        });
        enableButton.connect('clicked', () => {
            for (const option of ToggleOptions) {
                settings.set_boolean(option.key, true);
            }
        });

        // Disable All button
        const disableButton = new Gtk.Button({
            label: 'Disable All',
            valign: Gtk.Align.CENTER,
            css_classes: ['destructive-action']
        });
        disableButton.connect('clicked', () => {
            for (const option of ToggleOptions) {
                settings.set_boolean(option.key, false);
            }
        });

        // Create button box
        const buttonBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 8,
            valign: Gtk.Align.CENTER
        });
        buttonBox.append(enableButton);
        buttonBox.append(disableButton);

        row.add_suffix(buttonBox);

        return row;
    }

    /**
     * Create a toggle row for GTK settings with warning styling
     * @param {Gio.Settings} settings - The extension settings
     * @param {Object} option - The option configuration
     * @returns {Adw.SwitchRow} The created switch row
     */
    _createGtkToggleRow(settings, option) {
        const row = new Adw.SwitchRow({
            title: option.title,
            subtitle: option.subtitle,
            icon_name: option.icon
        });

        // Bind the switch to the setting
        settings.bind(
            option.key,
            row,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        return row;
    }
}
