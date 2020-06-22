import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {int} seconds to wait
 * @returns {boolean} True if element exists or false if element doesn't exist
 */
export function checkIfElementExists(selector, seconds = WAIT_SECONDS) {
    console.debug(`CHECK: Check "${selector}" exists`);

    return browser.waitUntil(
        () => $(selector).isDisplayed(),
        (seconds * 1000),
        `Element "${selector}" is not displayed`
    );
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 * @return {boolean} return if url matched
 */
export function checkUrl(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL contains "${url}"`);

    return browser.waitUntil(
        () => browser.getUrl().includes(url),
        (seconds * 1000),
        `Expected URL "${browser.getUrl()}" to contain "${url}"`
    );
}

/**
 * Assert URL Regex
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 * @return {boolean} return if url match regex
 */
export function checkUrlMatch(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL matches "${url}"`);
    const regex = new RegExp(url);
    return browser.waitUntil(
        () => regex.test(browser.getUrl()),
        (seconds * 1000),
        `Expected URL "${browser.getUrl()}" to match regex "${url}"`
    );
}

/**
 * Check webpage title
 *
 * @param {string} title of webpage
 * @param {int} seconds to wait
 * @return {boolean} return if title matched
 */
export function checkTitle(title, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Title contains "${title}"`);

    return browser.waitUntil(
        () => browser.getTitle().includes(title),
        (seconds * 1000),
        `Expected title "${browser.getTitle()}" to contain "${title}"`
    );
}

/**
 * Assert content exists
 *
 * @param {string} selector of content
 * @param {string} content text
 * @param {int} seconds to wait
 * @return {boolean} return if text exist
 */
export function checkSelectorContent(selector, content,
    seconds = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return browser.waitUntil(
        () => $(selector).getText().includes(content),
        (seconds * 1000),
        `Expected element "${selector}" to contain "${content}"`
    );
}
