import { clickSelector } from './action';
import { elementExists } from './check';

/**
 * Go to URL
 *
 * @param {string} url to go
 */
export async function goToUrl(url) {
    console.log(`ACTION: Change URL to "${url}"`);
    try {
        await browser.url(url);
    } catch (error) {
        throw new Error(`error trying to go to URL: ${url}: ${error}`);
    }
}

/**
 * Close cookie notice if it's shown, so it doesn't steal focus by being fixed on top of
 * other elements.
 */
export async function closeCookieNotice() {
    const selector = 'w-div > span:last-child'; // Cookie banner close button

    if (!(await elementExists(selector))) {
        console.log('No cookie notice to close');
        return;
    }

    await clickSelector(selector);
    console.log('Closed cookie notice');
}

/**
 * Generate number between minimum and maximum fixed numbers
 *
 * @param {number} min number
 * @param {number} max number
 * @returns {number} generated number
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
    return `${prefix}${dateString.replace(/[.:-]+/g, '+')}`;
}
