import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param selector to be checked
 * @param seconds to wait
 * @returns True if element exists or false if element doesn't exist
 */
export async function checkIfElementExists(selector: string, seconds = WAIT_SECONDS): Promise<boolean> {
    console.log(`CHECK: Check "${selector}" exists`);

    return $(selector).waitForExist({ timeout: seconds * 1000 });
}

/**
 * Checks whether a non-required selector is already present on the page.
 *
 * @param selector DOM selector to seek
 * @return  Whether element exists
 */
export async function elementExists(selector: string) {
    return $(selector).isDisplayed();
}

/**
 * Assert URL
 *
 * @param url to be asserted
 * @param  seconds to wait
 * @return if url matched
 */
export async function checkUrl(url: string, seconds = WAIT_SECONDS): Promise<boolean> {
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
 * @param url to be asserted
 * @param seconds to wait
 * @return return if url match regex
 */
export async function checkUrlMatch(url: string, seconds = WAIT_SECONDS): Promise<boolean> {
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
 * @param title of webpage
 * @param seconds to wait
 * @return return if title matched
 */
export async function checkTitle(title: string, seconds = WAIT_SECONDS): Promise<boolean> {
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
 * Check a specific form element contains the given value.
 *
 * @param element Already-located element.
 * @param value
 * @param seconds Number of seconds to wait.
 * @returns `waitUntil()` result.
 */
async function checkValue(element: WebdriverIO.Element, value: string, seconds = WAIT_SECONDS): Promise<any> {
    return browser.waitUntil(
        async () => {
            const text = await element.getValue();
            if (text !== value) {
                console.error(`Expected value ${value} did not match text ${(await text)}`);
                return false;
            }
            return true;
        },
        {
            timeout: seconds * 1000,
            timeoutMsg: `Expected element to have value "${value}"`,
        },
    );
}

/**
 * Check a specific element contains certain text.
 *
 * @param element Already-located element.
 * @param content Expected content.
 * @param seconds Number of seconds to wait.
 * @returns {Promise<any>} `waitUntil()` result.
 */
async function checkText(element: WebdriverIO.Element, content: string, seconds = WAIT_SECONDS): Promise<any> {
    function collapseWhitespace(string: string) {
        return string.replace(/\s\s+/g, ' ');
    }

    return browser.waitUntil(
        async () => {
            const text = collapseWhitespace(await element.getText());
            if (!text.includes(content)) {
                throw new Error(`Expected content ${content} not found in text ${(await text)}`);
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
 * Assert element with given value exists
 *
 * @param selector
 * @param  value
 * @param seconds Time to wait
 * @return if text exist
 */
export async function checkSelectorValue(selector: string, value: string, seconds = WAIT_SECONDS): Promise<boolean> {
    console.log(`CHECK: Element "${selector}" has value "${value}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return checkValue(await $(selector), value, seconds);
}

/**
 * Assert content exists
 *
 * @param selector of content
 * @param content text
 * @param seconds to wait
 * @return {Promise<boolean>} return if text exist
 */
export async function checkSelectorContent(selector: string, content: string, seconds: number = WAIT_SECONDS) {
    console.log(`CHECK: Element "${selector}" contains content "${content}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    return checkText(await $(selector), content, seconds);
}

/**
 * Checks content is in _an_ element that's visible. Takes an arbitrary such element, so
 * you should design tests using selectors you expect multiple of on the page but *only
 * one visible* at a time.
 *
 * @param selector DOM element selector.
 * @param content text
 * @param seconds to wait
 * @returns  `waitUntil()` result, assuming 1+ elements visible.
 */
export async function checkVisibleSelectorContent(selector: string, content: string, seconds: number = WAIT_SECONDS) {
    console.log(`CHECK: First visible element "${selector}" contains content "${content}"`);

    let firstVisibleElement;
    await $$(selector).forEach(async (element) => {
        if (await element.isDisplayed()) {
            firstVisibleElement = element;
        }
    });

    if (firstVisibleElement === undefined) {
        throw new Error(`No element with selector "${selector}" is visible`);
    }

    return checkText(firstVisibleElement, content, seconds);
}
