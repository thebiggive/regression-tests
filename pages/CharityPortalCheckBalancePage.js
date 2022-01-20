import {
    checkTitle, checkUrl
} from '../support/check';
import { clickSelector, getSelectorText } from '../support/action';

// selectors
const popUpSelector = 'button[title="Close this window"]';
const balanceCountSelector = 'div:nth-child(5) > div > div.lf-dash-number';

// checks
const titleCheck = 'The Big Give - Dashboard';
const urlCheck = 'charities/s/';

/**
 * Charity portal user: check balance
 */
export default class CharityPortalCheckBalancePage {
    /**
     * check if page ready && close overlay modal
     */
    static checkReady() {
        checkUrl(urlCheck);
        checkTitle(titleCheck);
        clickSelector(popUpSelector);
    }

    /**
     * check donation count value
     * @returns {int} current donation number
     */
    static getDonationCount() {
        return getSelectorText(balanceCountSelector);
    }
}
