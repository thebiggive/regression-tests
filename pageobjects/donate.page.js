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

/**
 * donate page object
 */
export default class DonatePage {
    /**
     * show donation form and make assertion
     */
    static donateForm() {
        goToUrl(donatePage);
        checkAngularV5Ready('app-root');
        checkTitle('Donate to ChoraChori (regtest1)');
        checkSelectorContent('form h1', 'Donating to ChoraChori (regtest1)!');
        // We need to interact with the form,
        // otherwise radio buttons aren't selected reliably on first click
        clickSelector(submitBtnSelector);
    }

    /**
     * set amount value
     * @param {int} amount number
     */
    static setRandomDonationAmount(amount) {
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
     */
    static pressDonateAction() {
        clickSelector(submitBtnSelector);
        if ($(matchFundsNotAvailableSelector).isExisting()
            && checkIfElementExists(proceedAnyWayBtnSelector)) {
            clickSelector(proceedAnyWayBtnSelector);
        }
    }
}
