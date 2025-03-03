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
 * Click anything selectable. Accounts for the possibilty that there's 1+ match
 * but only 1 is clickable, such as when "Log in" is on the page main page *and*
 * inside a modal.
 *
 * For now, comes with a 1s pause after click to give APIs etc. time to run
 * while keeping the step definitions simple.
 *
 * @param {string} selector Element selector.
 * @returns {Promise<any>} click() result on success.
 */
export async function clickActiveSelector(selector) {
    let bestButton;

    await $$(selector).forEach(async (thisButton) => {
        if (await thisButton.isClickable()) {
            bestButton = thisButton;
        }
    });

    if (bestButton === undefined) {
        throw new Error(`Could not find any clickable "${selector}" selector.`);
    }

    await clickElement(bestButton, selector);
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
 * Clicks a custom `<biggive-button>` with the given text.
 * @param {string} text
 */
export async function clickBigGiveButtonWithText(text) {
    console.log(`ACTION: Click Big Give button '${text}'`);

    const selector = `biggive-button[label="${text}"]`;
    const customButton = await $(selector);
    if (!customButton) {
        throw new Error(`Expected <biggive-button> "${text}" to exist`);
    }

    /** @type {WebdriverIO.Element} */
    const innerButtonLink = await customButton.$('>>>a.button');
    await innerButtonLink.waitForClickable();

    await clickElement(innerButtonLink, `${selector} >>>a.button`);
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
