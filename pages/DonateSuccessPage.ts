import {
    checkUrl,
    checkSelectorContent
} from '../support/check';
import { clickSelector } from '../support/action';
import {checkNoAccessibilityViolations} from '../support/a11y';

// selectors

const createAccountButtonSelector = '#createAccountButton';
const receiptSelector = 'div.receipt';

// checks
const urlCheck = 'thanks';

export default class DonateSuccessPage {
    static async checkReady() {
        await checkUrl(urlCheck);
        await checkNoAccessibilityViolations();
    }

    /**
     * Checks if balance has updated
     * @param donationAmount to check
     */
    static async checkBalance(donationAmount: number) {
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

    static async clickOnCreateAccountButton() {
        await clickSelector(createAccountButtonSelector);
    }
}
