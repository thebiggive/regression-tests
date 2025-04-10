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
 * @param {WebdriverIO.Element} element The element.
 * @param {string} originalSelector Text used to look it up, for info log.
 */
export async function clickElement(element, originalSelector) {
    console.log(`ACTION: Click already-checked element from selector ${originalSelector}`);
    await element.click();
}

/**
 * Clicks the *first* radio button whose label is a match.
 *
 * @param {string} text Copy to partially or fully match in Material radio's label
 * @returns {Promise<void>}
 */
export async function clickMaterialRadioWithLabel(text) {
    console.log(`ACTION: Click radio with label "${text}"`);

    const labels = $$('.mdc-label');
    /** @type {WebdriverIO.Element|false} */
    const label = await labels.find(
        async (theLabel) => (await theLabel.getText()).includes(text)
    );
    if (!label) {
        throw new Error(`Expected radio with label "${text}" to exist`);
    }

    await label.waitForClickable();
    await label.click();
}

/**
 * @param {WebdriverIO.Element|null} customButton
 * @param {string} selector
 * @returns {Promise<void>}
 */
async function clickBigGiveButton(customButton, selector) {
    if (!customButton) {
        throw new Error(`Expected <biggive-button> "${selector}" to exist`);
    }

    /** @type {WebdriverIO.Element} */
    const innerButtonLink = await customButton.$('>>>a.button');
    await innerButtonLink.waitForClickable();

    await clickElement(innerButtonLink, `${selector} >>>a.button`);
}

/**
 * @param {string} selector
 */
export async function clickBigGiveButtonWithOuterSelector(selector) {
    console.log(`ACTION: Click Big Give button with selector "${selector}"`);
    const customButton = await $(selector);
    await clickBigGiveButton(customButton, selector);
}

/**
 * Clicks a custom `<biggive-button>` with the given text. Must be a static `label`.
 * @param {string} text
 */
export async function clickBigGiveButtonWithText(text) {
    console.log(`ACTION: Click Big Give button '${text}'`);
    const selector = `biggive-button[label="${text}"]`;
    const customButton = await $(selector);
    await clickBigGiveButton(customButton, selector);
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

    if (!(await $(selector).isClickable())) {
        await $(selector).scrollIntoView();
    }

    await $(selector).selectByAttribute('value', value);
}

/**
 * Move focus into the embedded Stripe iframe input fields, run the callable, the move focus back to main form.
 *
 * @template T
 * @param {() => T} callable Function to run inside stripe iframe
 * @return T
 */
export async function inStripeIframe(callable) {
    await browser.switchToFrame(await $('iframe[title$="Secure payment input frame"]'));
    const returnVal = await callable();
    await browser.switchToParentFrame();

    return returnVal;
}
