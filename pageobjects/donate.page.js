import { goToUrl } from '../support/util';
import {
    checkAngularV5Ready,
    checkTitle,
    checkSelectorContent,
    checkIfElementExists
}
    from '../support/check';
import { clickSelector, inputSelectorValue } from '../support/action';

// routes
const donatePage = process.env.DONATE_PAGE;

// selectors
const submitBtnSelector = 'button=Donate Now';
const donationAmountSelector = '#donationAmount';
const claimGiftAidSelector = '#mat-radio-3';
const receiveEmailFromCharitySelector = '#mat-radio-6';
const receiveEmailFromTheBigGiveSelector = '#mat-radio-9';
const proceedAnyWayBtnSelector = 'button*=Proceed anyway';
const matchFundsNotAvailableSelector = '=Match funds not available';
const pageHeadingSelector = 'form h1';

//checks
const titleCheck = 'Donate to ChoraChori (regtest1)';
const pageHeadingCheck = 'Donating to ChoraChori (regtest1)!';

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
        checkAngularV5Ready('app-root');
        checkTitle(titleCheck);
        checkSelectorContent(pageHeadingSelector, pageHeadingCheck);
    }

    /**
     * We need to interact with the form,
     * otherwise radio buttons aren't selected reliably on first click
     */
    static init() {
        clickSelector(submitBtnSelector);
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
        if (skipMatchFundsCheck === true
            && $(matchFundsNotAvailableSelector).isExisting()
            && checkIfElementExists(proceedAnyWayBtnSelector)) {
            clickSelector(proceedAnyWayBtnSelector);
        }
    }
}
