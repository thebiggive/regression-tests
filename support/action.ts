import { checkIfElementExists } from './check';

/**
 * Click on element
 *
 * @param selector to be clicked
 * @param options for example { button: 'right' }
 */
export async function clickSelector(selector: string, options = {}) {
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
 * @param originalSelector Text used to look it up, for info log.
 */
export async function clickElement(element: WebdriverIO.Element, originalSelector: string) {
    console.log(`ACTION: Click already-checked element from selector ${originalSelector}`);
    await element.click();
}

/**
 * Clicks the *first* radio button whose label is a match.
 *
 * @param text Copy to partially or fully match in Material radio's label
 */
export async function clickMaterialRadioWithLabel(text: string) {
    console.log(`ACTION: Click radio with label "${text}"`);

    const labels = $$('.mdc-label');

    const label: WebdriverIO.Element|false  = await labels.find(
        async (theLabel) => (await theLabel.getText()).includes(text)
    );
    if (!label) {
        throw new Error(`Expected radio with label "${text}" to exist`);
    }

    await label.waitForClickable();
    await label.click();
}

async function clickBigGiveButton(customButton: WebdriverIO.Element|null, selector: string) {
    if (!customButton) {
        throw new Error(`Expected <biggive-button> "${selector}" to exist`);
    }

    /** @type {WebdriverIO.Element} */
    const innerButtonLink = await customButton.$('>>>a.button');
    await innerButtonLink.waitForClickable();

    await clickElement(innerButtonLink, `${selector} >>>a.button`);
}

export async function clickBigGiveButtonWithOuterSelector(selector: string) {
    console.log(`ACTION: Click Big Give button with selector "${selector}"`);
    const customButton = await $(selector);
    await clickBigGiveButton(customButton, selector);
}

/**
 * Clicks a custom `<biggive-button>` with the given text. Must be a static `label`.
 */
export async function clickBigGiveButtonWithText(text: string) {
    console.log(`ACTION: Click Big Give button '${text}'`);
    const selector = `biggive-button[label="${text}"]`;
    const customButton = await $(selector);
    await clickBigGiveButton(customButton, selector);
}

/**
 * Set value inside input
 *
 * @param selector to be filled
 * @param value to be inserted
 */
export async function inputSelectorValue(selector: string, value: string) {
    console.log(`ACTION: Input "${selector}" with "${value}"`);

    if (!(await checkIfElementExists(selector))) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    await $(selector).setValue(value);
}

/**
 * Select Option
 *
 * @param selector select input
 * @param value value
 */
export async function setSelectOption(selector: string, value: string) {
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
 * @paramcallable Function to run inside stripe iframe
 * @return T
 */
export async function inStripeIframe<T>(callable: () => T) {
    await browser.switchToFrame(await $('iframe[title$="Secure payment input frame"]'));
    const returnVal = await callable();
    await browser.switchToParentFrame();

    return returnVal;
}
