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
const urlCheck = 'thanks';

export default class DonateSuccessPage {
    static async checkReady() {
        await checkUrl(urlCheck);
    }

    /**
     * Checks if balance has updated
     * @param {number} donationAmount to check
     */
    static async checkBalance(donationAmount) {
        // For now checking just the 'Your donation' amount itself is a fairly good check that
        // *probably* the correct figure was set to that value. We included the prefix before
        // but this isn't reliable cross-browser because the receipt is a table and Chromium
        // browsers summarise it as "Your donation £123" while Safari shows "Your donation£123".

        const formattedAmount = donationAmount.toLocaleString('en-GB');

        await checkSelectorContent(
            receiptSelector,
            `£${formattedAmount}`,
        );
    }

    static async clickOnSetPasswordButton() {
        await $('.cta biggive-button').$('>>>a.button').click();
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
