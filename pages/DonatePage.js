import { goToUrl, wait } from '../support/util';
import {
    // checkAngularV5Ready,
    checkTitle,
    checkSelectorContent,
    checkIfElementExists
}
    from '../support/check';
import { clickSelector, inputSelectorValue } from '../support/action';

// routes
const donatePage = process.env.DONATE_PAGE;

// selectors
const submitBtnSelector = 'button*=Donate ';
const donationAmountSelector = '#donationAmount';
const claimGiftAidSelector = '#mat-radio-3';
const receiveEmailFromCharitySelector = '#mat-radio-6';
const receiveEmailFromTheBigGiveSelector = '#mat-radio-9';
const proceedAnyWayBtnSelector = 'button*=Proceed anyway';
const matchFundsNotAvailableSelector = '=Match funds not available';
const pageHeadingSelector = 'h1';

// checks
const titleCheck = 'Donate to Regression Test Charity';
const pageHeadingCheck = 'Regression Test Charity';

/**
 * donate page object
 */
export default class DonatePage {
    /**
     * open the donate page
     */
    static open() {
        goToUrl(donatePage);
    }

    /**
     * check if page ready
     */
    static checkReady() {
        // The following check no longer passes - replacing with fixed wait...
        // window.getAngularTestability(document.
        //  querySelector('app-root')).isStable()
        // checkAngularV5Ready('app-root');
        checkTitle(titleCheck, 25);
        checkSelectorContent(pageHeadingSelector, pageHeadingCheck);
    }

    /**
     * set amount value
     * @param {int} amount number
     */
    static setDonationAmount(amount) {
        inputSelectorValue(donationAmountSelector, amount);
    }

    /**
     * choose charity preferences
     */
    static choosePreference() {
        // Claim Gift Aid? select NO
        clickSelector(claimGiftAidSelector);

        wait(3);
        // Receive email from the charity? select NO
        clickSelector(receiveEmailFromCharitySelector);

        wait(3);
        // Receive email from the Big Give? select NO
        clickSelector(receiveEmailFromTheBigGiveSelector);
        wait(3);
    }

    /**
     * press donate button
     * @param {boolean} skipMatchFundsCheck ignore check if true
     */
    static submitForm(skipMatchFundsCheck = true) {
        clickSelector(submitBtnSelector);
        if (skipMatchFundsCheck === true
            && $(matchFundsNotAvailableSelector).isExisting()
            && checkIfElementExists(proceedAnyWayBtnSelector)) {
            clickSelector(proceedAnyWayBtnSelector);
        }
    }
}
