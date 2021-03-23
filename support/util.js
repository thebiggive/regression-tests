/**
 * Go to URL
 *
 * @param {string} url to go
 */
export function goToUrl(url) {
    console.log(`ACTION: Change URL to "${url}"`);
    browser.url(url);
}

/**
 * Generate number between minimum and maximum fixed numbers
 *
 * @param {int} min number
 * @param {int} max number
 * @returns {int} generated number
 */
export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate identifier - date based but with : and . converted
 * to - to keep e.g. QuickBooks happy when the putative data
 * is a name.
 *
 * @param {string} prefix (optional) prefix string
 * @returns {string} generated identifier
 */
export function generateIdentifier(prefix = '') {
    return `${prefix}${(new Date()).toISOString().replaceAll(new RegExp('[.:]+'), '-')}`;
}
