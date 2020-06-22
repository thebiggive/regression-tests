import { goToUrl } from '../support/util';
import {
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
const pageHeadingSelector = 'h3'; // Contains charity name on the page

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
        checkTitle(titleCheck);
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

        // Receive email from the charity? select NO
        clickSelector(receiveEmailFromCharitySelector);

        // Receive email from the Big Give? select NO
        clickSelector(receiveEmailFromTheBigGiveSelector);
    }

    /**
     * press donate button
     * @param {boolean} skipMatchFundsCheck ignore check if true
     */
    static submitForm(skipMatchFundsCheck = true) {
        clickSelector(submitBtnSelector);

        if (
            skipMatchFundsCheck === true
            && $(matchFundsNotAvailableSelector).isExisting()
            && checkIfElementExists(proceedAnyWayBtnSelector)
        ) {
            clickSelector(proceedAnyWayBtnSelector);
        }
    }
}
