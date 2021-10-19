import {
    checkUrl,
    checkSelectorContent
} from '../support/check';

// selectors
const statusSelector = '.c-main .b-rt-0:first-of-type .b-bold';

// checks
const urlCheck = 'thanks';
const balanceTextPreCheck = '£';

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
}
