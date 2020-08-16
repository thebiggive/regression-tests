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
const nextButtonSelector = 'button*=Next';

// checks
const titleCheck = 'Donate to Regression Test Charity';
const pageHeadingCheck = 'Regression Test Charity';

/**
 * donate page object
 */
export default class DonatePage {
    /**
     * Set up page with the expectation of starting with the first step and its
     * "Next" button, at array index 0.
     */
    constructor() {
        this.nextStepIndex = 0;
    }

    /**
     * open the donate page
     */
    open() {
        goToUrl(donatePage);
    }

    /**
     * check if page ready
     */
    checkReady() {
        checkTitle(titleCheck);
        checkSelectorContent(pageHeadingSelector, pageHeadingCheck);
    }

    /**
     * Click the Stepper's currently visible "Next" button.
     */
    progressToNextStep() {
        const steps = $$(nextButtonSelector);
        steps[this.nextStepIndex].click();
        this.nextStepIndex += 1;
    }

    /**
     * set amount value
     * @param {int} amount number
     */
    setDonationAmount(amount) {
        inputSelectorValue(donationAmountSelector, amount);
    }

    /**
     * Choose Gift Aid preference.
     */
    setGiftAidChoice() {
        // Claim Gift Aid? select NO
        clickSelector(claimGiftAidSelector);
    }

    /**
     * Choose email communication preferences.
     */
    setCommsPreferences() {
        // Receive email from the charity? select NO
        clickSelector(receiveEmailFromCharitySelector);

        // Receive email from the Big Give? select NO
        clickSelector(receiveEmailFromTheBigGiveSelector);
    }

    /**
     * press donate button
     */
    submitForm() {
        clickSelector(submitBtnSelector);

        if (
            $(matchFundsNotAvailableSelector)
            && $(matchFundsNotAvailableSelector).isExisting()
            && checkIfElementExists(proceedAnyWayBtnSelector)
        ) {
            clickSelector(proceedAnyWayBtnSelector);
        }
    }
}
