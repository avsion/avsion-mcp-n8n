/**
 * Terminal styling utilities for MCP server output
 * Provides colored badges and separators for clean console output
 */

/**
 * ANSI color codes for terminal styling
 */
const colors = {
  reset: '\x1b[0m',

  // Foreground colors
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  darkGray: '\x1b[90m',

  // Bright foreground (for badge text)
  brightGreen: '\x1b[92m',
  brightRed: '\x1b[91m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',

  // Background colors
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgWhite: '\x1b[47m',
  bgBrightWhite: '\x1b[107m',
  bgGray: '\x1b[100m',
  bgLightGray: '\x1b[47m',
};

/**
 * Create a status badge with colored background
 * Matches the style shown in the reference image
 * Light/white background with colored text
 *
 * @param {string} status - The status text (e.g., "PASS", "FAIL")
 * @param {string} [type='pass'] - Badge type: 'pass', 'fail', 'warn', 'info'
 * @returns {string} Formatted badge string
 */
export function badge(status, type = 'pass') {
  const config = {
    pass: { bg: colors.bgLightGray, fg: colors.green, text: status || 'PASS' },
    fail: { bg: colors.bgLightGray, fg: colors.red, text: status || 'FAIL' },
    warn: { bg: colors.bgLightGray, fg: colors.yellow, text: status || 'WARN' },
    info: { bg: colors.bgLightGray, fg: colors.blue, text: status || 'INFO' },
  };

  const style = config[type] || config.pass;
  return `${style.bg}${style.fg} ${style.text} ${colors.reset}`;
}

/**
 * Create a separator line
 * Light/dimmed line for visual separation
 * Matches the style shown in the reference image
 *
 * @param {number} [length=60] - Length of the separator line
 * @returns {string} Separator line string
 */
export function separator(length = 60) {
  return `${colors.darkGray}${'┈'.repeat(length)}${colors.reset}`;
}

/**
 * Create a dotted separator line
 * Alternative separator style using lighter dots
 *
 * @param {number} [length=60] - Length of the separator line
 * @returns {string} Separator line string
 */
export function dottedSeparator(length = 60) {
  return `${colors.darkGray}${'┈'.repeat(length)}${colors.reset}`;
}

/**
 * Print a test result line with badge and description
 * Followed by a separator line (matching reference image style)
 *
 * @param {string} status - Status text for the badge
 * @param {string} description - Test description or message
 * @param {string} [type='pass'] - Badge type
 */
export function testResult(status, description, type = 'pass') {
  console.log(`${badge(status, type)}  ${description}`);
  console.log(separator());
}

/**
 * Print a section header with separator
 *
 * @param {string} title - Section title
 */
export function section(title) {
  console.log('');
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(separator());
}

/**
 * Print success message
 *
 * @param {string} message - Success message
 */
export function success(message) {
  console.log(`${badge('PASS', 'pass')}  ${message}`);
}

/**
 * Print error message
 *
 * @param {string} message - Error message
 */
export function error(message) {
  console.error(`${badge('FAIL', 'fail')}  ${message}`);
}

/**
 * Print warning message
 *
 * @param {string} message - Warning message
 */
export function warn(message) {
  console.warn(`${badge('WARN', 'warn')}  ${message}`);
}

/**
 * Print info message
 *
 * @param {string} message - Info message
 */
export function info(message) {
  console.log(`${badge('INFO', 'info')}  ${message}`);
}

/**
 * Print a blank line
 */
export function blank() {
  console.log('');
}
