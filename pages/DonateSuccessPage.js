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

export default class DonateSuccessPage {
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

    static async clickOnSetPasswordButton() {
        await clickSelector(setPasswordButtonSelector);
    }

    static async populatePassword() {
        await inputSelectorValue(passwordSelector, '0123456789');
    }

    static async clickOnCreateAccountButton() {
        await clickSelector(createAccountButtonSelector);
    }

    static async checkCopySaysImRegistered() {
        await checkSelectorContent(registrationTextSelector, 'You are now registered');
    }
}
