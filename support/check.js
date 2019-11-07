import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {int} seconds to wait
 * @returns {boolean} True if element exists or false if element doesn't exist
 */
export function checkIfElementExists(selector, seconds = WAIT_SECONDS) {
    return $(selector).waitForExist((1000 * seconds), false,
        `Element "${selector}" does not exist`);
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 */
export function checkUrl(url, seconds = WAIT_SECONDS) {
    browser.waitUntil(
        () => browser.getUrl().includes(url),
        (seconds * 1000),
        `Expected URL "${browser.getUrl()}" to contain "${url}"`
    );
}

/**
 * Check webpage title
 *
 * @param {string} title of webpage
 * @param {int} seconds to wait
 */
export function checkTitle(title, seconds = WAIT_SECONDS) {
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
    browser.waitUntil(
        () => selector.getValue() === value,
        (seconds * 1000),
        `Expected Input "${selector}" to contain "${value}"`
    );
}

/**
 * Check if Angular is initialised and ready to interact
 *
 * @param {int} seconds to wait
 * @returns {boolean} True if angular is ready
 */
export function checkAngularReady(seconds = WAIT_SECONDS) {
    console.log('CHECK: Angular is ready');
    return browser.waitUntil(
        () => {
            const result = browser.execute(() => {
                const root = document.querySelector('app-root'); // eslint-disable-line
                const testable = window.getAngularTestability(root); // eslint-disable-line
                return testable && testable.isStable()
                    && (testable.getPendingRequestCount() === 0);
            });
            console.debug(`CHECK: Angular ready state - ${result}`);
            return result;
        },
        (seconds * 1000),
        'Expected Angular to be ready'
    );
}
