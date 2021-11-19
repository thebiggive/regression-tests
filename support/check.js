import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {int} seconds to wait
 * @returns {Promise<boolean>} True if element exists or false if element doesn't exist
 */
export function checkIfElementExists(selector, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Check "${selector}" exists`);

    return browser.waitUntil(
        () => $(selector).isDisplayed(),
        {
            // Keep default 0.5s interval between checks.
            timeout: seconds * 1000,
            timeoutMsg: `Element "${selector}" is not displayed`,
        },
    );
}

/**
 * Checks whether a non-required selector is already present on the page.
 *
 * @param {string} selector DOM selector to seek
 * @return {boolean} Whether element exists
 */
export function elementExists(selector) {
    return $(selector).isDisplayed();
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 * @return {Promise<boolean>} return if url matched
 */
export function checkUrl(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL contains "${url}"`);

    return browser.waitUntil(
        () => browser.getUrl().includes(url),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected URL "${browser.getUrl()}" to contain "${url}"`,
        },
    );
}

/**
 * Assert URL Regex
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 * @return {Promise<boolean>} return if url match regex
 */
export function checkUrlMatch(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL matches "${url}"`);
    const regex = new RegExp(url);
    return browser.waitUntil(
        () => regex.test(browser.getUrl()),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected URL "${browser.getUrl()}" to match regex "${url}"`,
        },
    );
}

/**
 * Check webpage title
 *
 * @param {string} title of webpage
 * @param {int} seconds to wait
 * @return {Promise<boolean>} return if title matched
 */
export function checkTitle(title, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Title contains "${title}"`);

    return browser.waitUntil(
        () => browser.getTitle().includes(title),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected title "${browser.getTitle()}" to contain "${title}"`,
        },
    );
}

/**
 * Assert content exists
 *
 * @param {string} selector of content
 * @param {string} content text
 * @param {int} seconds to wait
 * @return {Promise<boolean>} return if text exist
 */
export function checkSelectorContent(selector, content,
    seconds = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return browser.waitUntil(
        () => $(selector).getText().includes(content),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected element "${selector}" to contain "${content}"`,
        },
    );
}
