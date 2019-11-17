import { wait } from '../support/util';
import {
    checkUrl,
    checkTitle,
    checkSelectorContent
} from '../support/check';

// selectors
const pageHeadingSelector = 'h2';
const balanceStatusSelector = '.ng-star-inserted p';
const balanceTextSelector = '.ng-star-inserted p:nth-child(2)';


// checks
const urlCheck = 'thanks';
const pageTitleCheck = 'The Big Give';
const pageHeadingCheck = 'Thank you!';
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
        wait();
        checkUrl(urlCheck, 15);
        checkTitle(pageTitleCheck, 3);
        checkSelectorContent(pageHeadingSelector, pageHeadingCheck);
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
