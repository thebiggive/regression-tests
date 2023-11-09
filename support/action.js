import { checkIfElementExists } from './check';

/**
 * Click on element
 *
 * @param {string} selector to be clicked
 * @param {object} options for example { button: 'right' }
 */
export async function clickSelector(selector, options = {}) {
    console.log(`ACTION: Click "${selector}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    if (!(await $(selector).isClickable())) {
        await $(selector).scrollIntoView();
    }

    await $(selector).click(options);
}

/**
 * Click an element that we have already tested for existence and clickability.
 *
 * @param {HTMLElement} element The element.
 * @param {string} originalSelector Text used to look it up, for info log.
 */
export async function clickElement(element, originalSelector) {
    console.log(`ACTION: Click already-checked element from selector ${originalSelector}`);
    await element.click();
}

/**
 * Set value inside input
 *
 * @param {string} selector to be filled
 * @param {string} value to be inserted
 */
export async function inputSelectorValue(selector, value) {
    console.log(`ACTION: Input "${selector}" with "${value}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    await $(selector).setValue(value);
}

/**
 * Select Option
 *
 * @param {string} selector select input
 * @param {string} value value
 */
export async function setSelectOption(selector, value) {
    console.log(`ACTION: Set select option "${selector}" value "${value}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    await $(selector).selectByAttribute('value', value);
}

/**
 * Send keys
 *
 * @param {string} value to be typed
 */
export async function sendKeys(value) {
    console.log(`ACTION: Send keys "${value}"`);
    await browser.keys(value);
}

/**
 * Move focus into the embedded Stripe iframe input fields.
 */
export async function enterStripeIframe() {
    // https://webdriver.io/docs/api/webdriver.html#switchtoframe
    await browser.switchToFrame(await $('iframe[title$="Secure payment input frame"]'));
}

/**
 * Move focus back to the outer page for main form interaction.
 */
export async function leaveStripeIframe() {
    await browser.switchToParentFrame();
}

/**
 * get element text
 *
 * @param {string} selector of content
 * @returns {Promise<string>} element text
 */
export async function getSelectorText(selector) {
    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    const element = $(selector);
    const text = await element.getText();
    console.log(
        `GET: Element "${selector}" contains content "${text}"`
    );

    return text;
}
