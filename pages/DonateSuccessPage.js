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
const receiptSelector = 'div.receipt';
const passwordSelector = '#password';
const registrationTextSelector = '#registrationCompleteText';

// checks
const balanceTextPreCheck = '£';
const urlCheck = 'thanks';

export default class DonateSuccessPage {
    constructor(browser) {
        this.browser = browser;
    }

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
        await clickSelector('#save-details-button');
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

    static generateRandomPassword() {
        return Array(20).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
    }
}
