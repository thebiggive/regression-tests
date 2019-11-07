import { WAIT_SECONDS } from './constants';

/**
 * Check if element exists
 *
 * @param {string} selector to be checked
 * @param {int} seconds to wait
 * @returns {boolean} True if element exists or false if element doesn't exist
 */
export function checkIfElementExists(selector, seconds = WAIT_SECONDS) {
    return $(selector).waitForExist((1000 * seconds), false,
        `Element "${selector}" does not exist`);
}

/**
 * Go to URL
 *
 * @param {string} url to go
 */
export function goToUrl(url) {
    console.log(`ACTION: Change URL to "${url}"`);
    browser.url(url);
}

/**
 * Wait x seconds
 *
 * @param {int} seconds to wait
 */
export function wait(seconds = WAIT_SECONDS) {
    console.warn(
        'WARNING: Fixed sleep being used - avoid unless absolutely necessary!'
    );
    browser.pause(seconds * 1000);
}

/**
 * Click on element
 *
 * @param {string} selector to be clicked
 * @param {int} seconds to wait
 */
export function clickSelector(selector) {
    console.log(`ACTION: Click "${selector}"`);
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    $(selector).click();
}

/**
 * Set value inside input
 *
 * @param {string} selector to be filled
 * @param {string} value to be inserted
 * @param {int} seconds to wait
 */
export function inputSelectorValue(selector, value) {
    console.log(`ACTION: Input "${selector}" with "${value}"`);
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }
    $(selector).setValue(value);
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
 * Assert URL
 *
 * @param {string} url to be asserted
 * @param {int} seconds to wait
 */
export function checkUrl(url, seconds = WAIT_SECONDS) {
    browser.waitUntil(
        () => browser.getUrl().includes(url),
        (seconds * 1000),
        `Expected URL "${browser.getUrl()}" to contain "${url}"`
    );
}

/**
 * Check webpage title
 *
 * @param {string} title of webpage
 * @param {int} seconds to wait
 */
export function checkTitle(title, seconds = WAIT_SECONDS) {
    browser.waitUntil(
        () => browser.getTitle().includes(title),
        (seconds * 1000),
        `Expected title "${browser.getTitle()}" to contain "${title}"`
    );
}

/**
 * Assert content exists
 *
 * @param {string} selector of content
 * @param {string} content text
 * @param {int} seconds to wait
 */
export function checkSelectorContent(selector, content,
    seconds = WAIT_SECONDS) {
    if (!checkIfElementExists(selector)) {
        throw new Error(`Expected element "${selector}" to exist`);
    }

    browser.waitUntil(
        () => $(selector).getText().includes(content),
        (seconds * 1000),
        `Expected element "${selector}" to contain "${content}"`
    );
}

/**
 * Select Option
 *
 * @param {string} selector select input
 * @param {string} selectedValue value
 * @param {int} seconds to wait
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


/**
 * Assert Input     Value
 *
 * @param {string} selector to be asserted
 * @param {string} value to be asserted
 * @param {int} seconds to wait
 */
export function checkInputValue(selector, value, seconds = WAIT_SECONDS) {
    browser.waitUntil(
        () => selector.getValue() === value,
        (seconds * 1000),
        `Expected Input "${selector}" to contain "${value}"`
    );
}

/**
 * generate number between minimum and maximum fixed numbers
 * @param {int} min number
 * @param {int} max number
 * @returns {int} generated number
 */
export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
