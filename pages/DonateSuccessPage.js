import {
    checkUrl,
    checkSelectorContent
} from '../support/check';
import {
    clickSelector,
    inputSelectorValue
} from '../support/action';

// selectors
const createAccountButtonSelector = '#createAccountButton';
const setPasswordButtonSelector = '#setPasswordButton';
const statusSelector = '.c-main .b-rt-0:first-of-type .b-bold';
const passwordSelector = '#password';
const registrationTextSelector = '#registrationCompleteText';

// checks
const balanceTextPreCheck = '£';
const urlCheck = 'thanks';

/**
 * Checkout success page
 */
export default class DonateSuccessPage {
    /**
     * Checks if page is ready
     */
    static async checkReady() {
        await checkUrl(urlCheck);
    }

    /**
     * Checks if balance has updated
     * @param {int} donationAmount to check
     */
    static async checkBalance(donationAmount) {
        await checkSelectorContent(
            statusSelector,
            `${balanceTextPreCheck}${donationAmount}`,
        );
    }

    /**
     * Clicks on the 'Set a password' button
     */
    static async clickOnSetPasswordButton() {
        await clickSelector(setPasswordButtonSelector);
    }

    /**
     * Populates password field
     */
    static async populatePassword() {
        await inputSelectorValue(passwordSelector, '0123456789');
    }

    /**
     * Clicks on the 'Create account' button
     */
    static async clickOnCreateAccountButton() {
        await clickSelector(createAccountButtonSelector);
    }

    /**
     * Checks that the donation-success page says 'You are now registered'
     */
    static async checkCopySaysImRegistered() {
        await checkSelectorContent(registrationTextSelector, 'You are now registered');
    }
}
