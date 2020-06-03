import {
    checkUrl,
    checkTitle,
    checkSelectorContent
} from '../support/check';

// selectors
const balanceStatusSelector = '.ng-star-inserted p';
const balanceTextSelector = '.ng-star-inserted p:nth-child(2)';


// checks
const urlCheck = 'thanks';
const pageTitleCheck = 'The Big Give';
const balanceStatusCheck = 'Your donation status: Reserved';
const balanceTextCheck = 'You donated £';

/**
 * Checkout success page
 */
export default class CheckoutSuccessPage {
    /**
     * check if page ready
     */
    static checkReady() {
        checkUrl(urlCheck);
        checkTitle(pageTitleCheck);
    }

    /**
     * check if balance updated
     * @param {int} donationAmount to check
     */
    static checkBalance(donationAmount) {
        checkSelectorContent(
            balanceStatusSelector,
            balanceStatusCheck
        );
        checkSelectorContent(
            balanceTextSelector,
            balanceTextCheck + donationAmount
        );
    }
}
