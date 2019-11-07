import { checkIfElementExists } from './check';
import { WAIT_SECONDS } from './constants';

/**
 * Click on element
 *
 * @param {string} selector to be clicked
 * @param {object} options for example { button: 'right' }
 */
export function clickSelector(selector, options = {}) {
    console.log(`ACTION: Click "${selector}"`);
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    const element = $(selector);

    browser.waitUntil(
        () => element.isDisplayed(),
        (WAIT_SECONDS * 1000),
        `This element ${selector} not visible`
    );

    element.click(options);
}

/**
 * Set value inside input
 *
 * @param {string} selector to be filled
 * @param {string} value to be inserted
 */
export function inputSelectorValue(selector, value) {
    console.log(`ACTION: Input "${selector}" with "${value}"`);
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    $(selector).setValue(value);
}

/**
 * Select Option
 *
 * @param {string} selector select input
 * @param {string} selectedValue value
 */
export function setSelectOption(selector, selectedValue) {
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    const selectBox = $(selector);
    selectBox.selectByAttribute('value', selectedValue);

    // returns "Dr"
    console.log(
        `ACTION: set selected "${selectBox.getValue()}"`
    );
}
