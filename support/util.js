import { WAIT_SECONDS } from './constants';

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
 * Generate number between minimum and maximum fixed numbers
 *
 * @param {int} min number
 * @param {int} max number
 * @returns {int} generated number
 */
export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
