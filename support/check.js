import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {int} seconds to wait
 * @returns {Promise<boolean>} True if element exists or false if element doesn't exist
 */
export async function checkIfElementExists(selector, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Check "${selector}" exists`);

    return $(selector).waitForExist({ timeout: seconds * 1000 });
}

/**
 * Checks whether a non-required selector is already present on the page.
 *
 * @param {string} selector DOM selector to seek
 * @return {boolean} Whether element exists
 */
export async function elementExists(selector) {
    return $(selector).isDisplayed();
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 * @return {Promise<boolean>} return if url matched
 */
export async function checkUrl(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL contains "${url}"`);

    return browser.waitUntil(
        async () => (await browser.getUrl()).includes(url),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected URL "${await browser.getUrl()}" to contain "${url}"`,
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
export async function checkUrlMatch(url, seconds = WAIT_SECONDS) {
    console.log(`CHECK: URL matches "${url}"`);
    const regex = new RegExp(url);
    return browser.waitUntil(
        async () => regex.test(await browser.getUrl()),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected URL "${await browser.getUrl()}" to match regex "${url}"`,
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
export async function checkTitle(title, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Title contains "${title}"`);

    return browser.waitUntil(
        async () => (await browser.getTitle()).includes(title),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected title "${await browser.getTitle()}" to contain "${title}"`,
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
export async function checkSelectorContent(selector, content, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return browser.waitUntil(
        async () => (await $(selector).getText()).includes(content),
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected element "${selector}" to contain "${content}"`,
        },
    );
}
