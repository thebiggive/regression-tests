import {
    checkUrl,
    checkSelectorContent
} from '../support/check';

// selectors
const statusSelector = '.c-main .b-rt-0:first-of-type .b-bold';
const thankYouMessageSelector = 'p.error.ng-star-inserted';
// checks
const urlCheck = 'thanks';
const balanceTextPreCheck = '£';
const thankYouMessageCheck = 'Your donation was not processed immediately';

/**
 * Checkout success page
 */
export default class DonateSuccessPage {
    /**
     * check if page ready
     */
    static checkReady() {
        checkUrl(urlCheck);
    }

    /**
     * check if balance updated
     * @param {int} donationAmount to check
     */
    static checkBalance(donationAmount) {
        checkSelectorContent(
            statusSelector,
            `${balanceTextPreCheck}${donationAmount}`,
        );
    }

    /**
     * check thank you message
     * For now we check the message is 'Your donation was not processed immediately'
     * because we don't have a working Regressions Enthuse webhook, so this message is
     * expected. See REG-12.
     */
    static checkThankYouMessage() {
        checkSelectorContent(thankYouMessageSelector, thankYouMessageCheck);
    }
}
