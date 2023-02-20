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
const setPasswordButtonSelector = '>>>a.button';
const receiptSelector = 'div.receipt';
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
            receiptSelector,
            `Your donation ${balanceTextPreCheck}${donationAmount}`,
        );
    }

    static async clickOnSetPasswordButton() {
        await clickSelector(setPasswordButtonSelector);
    }

    static async populatePassword() {
        await inputSelectorValue(passwordSelector, this.generateRandomPassword());
    }

    static async clickOnCreateAccountButton() {
        await clickSelector(createAccountButtonSelector);
    }

    static async checkCopySaysImRegistered() {
        await checkSelectorContent(registrationTextSelector, 'You are now registered');
    }

    generateRandomPassword() {
        // From https://stackoverflow.com/a/48087112/2526181
        return Array(20).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
    }
}
