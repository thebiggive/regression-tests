import { clickSelector } from './action';
import { elementExists } from './check';

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
 * Close cookie notice if it's shown, so it doesn't steal focus by being fixed on top of
 * other elements.
 */
export function closeCookieNotice() {
    const selector = 'w-div > span:last-child'; // Cookie banner close button

    if (!elementExists(selector)) {
        console.log('No cookie notice to close');
        return;
    }

    clickSelector(selector);
    console.log('Closed cookie notice');
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
    /** @param {string} dateString */
    const dateString = (new Date()).toISOString();
    return `${prefix}${dateString.replace(new RegExp('[.:]+', 'g'), '-')}`;
}
