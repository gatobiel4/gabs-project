/**
 * ============================================================================
 * CHRONICLES OF G - DEBUG CONSOLE
 * ============================================================================
 * A minimal debug overlay for monitoring engine systems and lifecycle events.
 */

export class DebugConsole {
    // -------------------------------------------------------------------------
    // PROPERTIES
    // -------------------------------------------------------------------------

    /** @type {boolean} */
    enabled = false;

    /** @type {HTMLElement} */
    container = null;

    /** @type {HTMLElement} */
    logContainer = null;

    /** @type {HTMLElement} */
    toggleButton = null;

    /** @type {number} */
    maxLogs = 50;

    /** @type {Array<{timestamp: string, type: string, message: string}>} */
    fullLog = [];

    // -------------------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------------------

    constructor(enabled = false) {
        this.enabled = enabled;
        if (this.enabled) {
            this.createUI();
            this.createToggleButton();
        }
    }

    // -------------------------------------------------------------------------
    // UI CREATION
    // -------------------------------------------------------------------------

    createUI() {
        // Main Container
        this.container = document.createElement('div');
        this.container.id = 'debug-console';
        this.container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 320px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            font-family: monospace;
            font-size: 11px;
            color: #aaa;
            z-index: 10000;
            overflow: hidden;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 6px 10px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>Debug</span>
            <div>
                <button id="debug-export" style="
                    background: none;
                    border: 1px solid rgba(0, 255, 255, 0.3);
                    color: #0cf;
                    padding: 2px 8px;
                    cursor: pointer;
                    font-size: 9px;
                    border-radius: 2px;
                    margin-right: 8px;
                ">EXPORT</button>
                <button id="debug-close" style="
                    background: none;
                    border: none;
                    color: #666;
                    padding: 0;
                    cursor: pointer;
                    font-size: 14px;
                ">×</button>
            </div>
        `;

        // Log Container
        this.logContainer = document.createElement('div');
        this.logContainer.style.cssText = `
            padding: 8px;
            max-height: 350px;
            overflow-y: auto;
            line-height: 1.4;
        `;

        this.container.appendChild(header);
        this.container.appendChild(this.logContainer);
        document.body.appendChild(this.container);

        // Close button handler
        document.getElementById('debug-close').addEventListener('click', () => {
            this.hide();
        });

        // Export button handler
        document.getElementById('debug-export').addEventListener('click', () => {
            this.exportLogs();
        });

        this.log('Console ready', 'system');
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'debug-toggle';
        this.toggleButton.textContent = 'DEBUG';
        this.toggleButton.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: #0cf;
            padding: 8px 16px;
            font-family: monospace;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            border-radius: 4px;
            z-index: 9999;
        `;

        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        document.body.appendChild(this.toggleButton);
    }

    // -------------------------------------------------------------------------
    // LOGGING METHODS
    // -------------------------------------------------------------------------

    /**
     * Log a message to the debug console
     * @param {string} message - The message to log
     * @param {string} type - Type of log: 'info', 'warn', 'error', 'system', 'lifecycle'
     */
    log(message, type = 'info') {
        if (!this.enabled) return;

        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

        // Store in full log
        this.fullLog.push({ timestamp, type, message });

        // Only update UI if container exists
        if (!this.logContainer) return;

        // Create log element
        const logElement = document.createElement('div');
        logElement.style.cssText = `
            margin-bottom: 2px;
            padding: 2px 4px;
            color: ${this.getColorForType(type)};
            font-size: 11px;
        `;
        logElement.textContent = `[${timestamp}] ${this.getIconForType(type)} ${message}`;

        this.logContainer.appendChild(logElement);

        // Limit logs in UI
        while (this.logContainer.children.length > this.maxLogs) {
            this.logContainer.removeChild(this.logContainer.firstChild);
        }

        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    /**
     * Get color based on log type
     * @param {string} type
     * @returns {string}
     */
    getColorForType(type) {
        const colors = {
            'info': '#888',
            'warn': '#f90',
            'error': '#f33',
            'system': '#0cf',
            'lifecycle': '#c0f'
        };
        return colors[type] || colors.info;
    }

    /**
     * Get icon for log type
     * @param {string} type
     * @returns {string}
     */
    getIconForType(type) {
        const icons = {
            'info': '·',
            'warn': '!',
            'error': '×',
            'system': '✓',
            'lifecycle': '→'
        };
        return icons[type] || icons.info;
    }

    /**
     * Log system initialization
     * @param {string} systemName
     */
    logSystemInit(systemName) {
        this.log(systemName, 'system');
    }

    /**
     * Log lifecycle event
     * @param {string} phase
     */
    logLifecycle(phase) {
        this.log(phase, 'lifecycle');
    }

    /**
     * Log error
     * @param {string} message
     */
    logError(message) {
        this.log(message, 'error');
    }

    /**
     * Log warning
     * @param {string} message
     */
    logWarning(message) {
        this.log(message, 'warn');
    }

    // -------------------------------------------------------------------------
    // EXPORT FUNCTIONALITY
    // -------------------------------------------------------------------------

    /**
     * Export all logs to a downloadable file
     */
    exportLogs() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        const filename = `consolelog_${dateStr}_${timeStr}.txt`;

        // Format logs
        let content = `Chronicles of G - Debug Console Log\n`;
        content += `Generated: ${now.toLocaleString()}\n`;
        content += `${'='.repeat(60)}\n\n`;

        for (const entry of this.fullLog) {
            const icon = this.getIconForType(entry.type);
            content += `[${entry.timestamp}] ${icon} [${entry.type.toUpperCase()}] ${entry.message}\n`;
        }

        content += `\n${'='.repeat(60)}\n`;
        content += `Total Entries: ${this.fullLog.length}\n`;

        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.log(`Logs exported: ${filename}`, 'system');
    }

    // -------------------------------------------------------------------------
    // CONTROLS
    // -------------------------------------------------------------------------

    /**
     * Toggle console visibility
     */
    toggle() {
        if (!this.container) {
            this.createUI();
        } else {
            const isHidden = this.container.style.display === 'none';
            this.container.style.display = isHidden ? 'block' : 'none';
        }
    }

    /**
     * Show console
     */
    show() {
        if (!this.container) {
            this.createUI();
        }
        this.container.style.display = 'block';
    }

    /**
     * Hide console
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Clear all logs
     */
    clear() {
        this.fullLog = [];
        if (this.logContainer) {
            this.logContainer.innerHTML = '';
        }
    }
}
