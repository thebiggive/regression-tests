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
        () => $(selector).isExisting(),
        (seconds * 1000),
        `Element "${selector}" is not displayed`
    );
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 */
export function checkUrl(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL contains "${url}"`);

    browser.waitUntil(
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
 */
export function checkUrlMatch(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL matches "${url}"`);

    const regex = new RegExp(url);
    browser.waitUntil(
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
 */
export function checkTitle(title, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Title contains "${title}"`);

    browser.waitUntil(
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
 */
export function checkSelectorContent(selector, content,
    seconds = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    browser.waitUntil(
        () => $(selector).getText().includes(content),
        (seconds * 1000),
        `Expected element "${selector}" to contain "${content}"`
    );
}

/**
 * Assert input value
 *
 * @param {string} selector to be asserted
 * @param {string} value to be asserted
 * @param {int} seconds to wait
 */
export function checkInputValue(selector, value, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Input "${selector}" contains value "${value}"`);

    browser.waitUntil(
        () => selector.getValue() === value,
        (seconds * 1000),
        `Expected Input "${selector}" to contain "${value}"`
    );
}

/**
 * Check if Angular v5 is initialised and ready to interact
 *
 * @param {string} tag root
 * @param {int} seconds to wait
 * @returns {boolean} True if angular is ready
 */
export function checkAngularV5Ready(tag, seconds = WAIT_SECONDS) {
    console.log('CHECK: Angular is ready');

    return browser.waitUntil(
        () => {
            const result = browser.execute((tag) => { // eslint-disable-line
                if (!window.getAngularTestability) { // eslint-disable-line
                    return false;
                }
                const root = document.querySelector(tag); // eslint-disable-line
                const testable = window.getAngularTestability(root); // eslint-disable-line
                return testable && testable.isStable()
                    && (testable.getPendingRequestCount() === 0);
            }, tag);
            console.debug(`CHECK: Angular ready state - ${result}`);
            return result;
        },
        (seconds * 1000),
        'Expected Angular to be ready'
    );
}
