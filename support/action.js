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
