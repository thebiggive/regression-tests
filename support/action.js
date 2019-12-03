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

    $(selector).click(options);
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
 * @param {string} value value
 */
export function setSelectOption(selector, value) {
    console.log(`ACTION: Set select option "${selector}" value "${value}"`);

    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    $(selector).selectByAttribute('value', value);
}

/**
 * Send keys
 *
 * @param {string} value to be typed
 */
export function sendKeys(value) {
    console.log(`ACTION: Send keys "${value}"`);
    browser.keys(value);
}


/**
 * get element text
 *
 * @param {string} selector of content
 * @param {int} seconds to wait
 * @returns {strint} element text
 */
export function getSelectorText(selector, seconds = WAIT_SECONDS) {

    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    const element = $(selector);
    console.log(`GET: Element "${selector}" contains content "${element.getText()}"`);
    return browser.waitUntil(
        () => element.getText(),
        (seconds * 1000),
        `Element "${selector}" value contain "${element.getText()}"`
    );
}