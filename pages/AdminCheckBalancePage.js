import { checkTitle, checkUrl, checkIfElementExists } from '../support/check';
import { clickSelector } from '../support/action';

// selectors
const popUpSelector = 'button[title="Close this window"]';
const balanceSelector = '.lf-dash-number=2';

// checks
const titleCheck = 'The Big Give - Dashboard';
const urlCheck = 'charities/s/';

/**
 * Admin check balance
 */
export default class AdminCheckBalancePage {
    /**
     * check if page ready && close overlay modal
     */
    static checkReady() {
        checkUrl(urlCheck);
        checkTitle(titleCheck);
        clickSelector(popUpSelector);
    }

    /**
     * assert that donation incremented
     */
    static checkBalance() {
        checkIfElementExists(balanceSelector);
    }
}
