import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {number} seconds to wait
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
 * @return {Promise<boolean>} Whether element exists
 */
export async function elementExists(selector) {
    return $(selector).isDisplayed();
}

/**
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {number} seconds to wait
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
 * @param {number} seconds to wait
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
 * @param {number} seconds to wait
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
 * Check a specific element contains certain text.
 *
 * @param {WebdriverIO.Element} element Already-located element.
 * @param {string} content Expected content.
 * @param {number} seconds Number of seconds to wait.
 * @returns {Promise<any>} `waitUntil()` result.
 */
async function checkText(element, content, seconds = WAIT_SECONDS) {
    return browser.waitUntil(
        async () => {
            const text = element.getText();
            if (!(await text).includes(content)) {
                console.error(`Expected content ${content} not found in text ${(await text)}`);
                return false;
            }
            return true;
        },
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected element to contain "${content}"`,
        },
    );
}

/**
 * Assert content exists
 *
 * @param {string} selector of content
 * @param {string} content text
 * @param {number} seconds to wait
 * @return {Promise<boolean>} return if text exist
 */
export async function checkSelectorContent(selector, content, seconds = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return checkText(await $(selector).getElement(), content, seconds);
}

/**
 * Checks content is in _an_ element that's visible. Takes an arbitrary such element, so
 * you should design tests using selectors you expect multiple of on the page but *only
 * one visible* at a time.
 *
 * @param {string} selector DOM element selector.
 * @param {string} content text
 * @param {number} seconds to wait
 * @returns {Promise<any>} `waitUntil()` result, assuming 1+ elements visible.
 */
export async function checkVisibleSelectorContent(selector, content, seconds = WAIT_SECONDS) {
    console.log(`CHECK: First visible element "${selector}" contains content "${content}"`);

    let firstVisibleElement;
    await $$(selector).forEach((element) => {
        if (element.isDisplayed()) {
            firstVisibleElement = element;
        }
    });

    if (firstVisibleElement === undefined) {
        throw new Error(`No element with selector "${selector}" is visible`);
    }

    return checkText(firstVisibleElement, content, seconds);
}
