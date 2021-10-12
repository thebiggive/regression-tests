import { generateIdentifier, goToUrl } from '../support/util';
import {
    checkTitle,
    checkSelectorContent,
    checkIfElementExists
}
    from '../support/check';
import {
    clickSelector,
    enterStripeIframe,
    inputSelectorValue,
    leaveStripeIframe
} from '../support/action';

// routes
const startPageEnthuse = process.env.DONATE_PAGE_ENTHUSE;
const startPageStripe = process.env.DONATE_PAGE_STRIPE;

// selectors
const submitBtnSelector = 'button*=Donate ';
const donationAmountSelector = '#donationAmount';
// Now we show the Gift Aid section conditionally, this is mounted last
// and the ratio gets the highest ID.
// TODO avoid these hacks for radio selectors! We should be checking copy
// ideally, although we also need to maintain IE11 support for this journey
// so can't necessarily use standard Xpath. :/
const claimGiftAidSelector = '#mat-radio-9';
const firstNameSelector = '#firstName';
const lastNameSelector = '#lastName';
const emailAddressSelector = '#emailAddress';
const receiveEmailFromCharitySelector = '#mat-radio-3';
const receiveEmailFromTheBigGiveSelector = '#mat-radio-6';
const billingPostcodeSelector = '#billingPostcode';
const stripeCardNumberSelector = 'input[name$="cardnumber"]';
const stripeExpiryDateSelector = 'input[name$="exp-date"]';
const stripeCvcSelector = 'input[name$="cvc"]';
const proceedAnyWayBtnSelector = 'button*=Proceed anyway';
const dialogSelector = '.mat-dialog-container';
const pageHeadingSelector = 'h3'; // Contains charity name on the page
const nextButtonSelector = 'button*=Next';

/**
 * Donate page class
 */
export default class DonateStartPage {
    /**
     * Set up page with the expectation of starting with the first step and its
     * "Next" button, at array index 0.
     * @param {WebdriverIO.BrowserObject} browser   Global object for pauses.
     */
    constructor(browser) {
        this.browser = browser;
        this.nextStepIndex = 0;
        this.charity = 'Enthuse';
    }

    /**
     * open the donate page
     * @param {string} psp  Payment Service Provider: Enthuse or Stripe.
     */
    open(psp) {
        this.charity = psp === 'Stripe'
            ? 'Exempt Stripe Test Charity'
            : 'Regression Test Charity';
        goToUrl(psp === 'Stripe' ? startPageStripe : startPageEnthuse);
    }

    /**
     * check if page ready
     */
    checkReady() {
        checkTitle(`Donate to ${this.charity}`);
        checkSelectorContent(pageHeadingSelector, this.charity);
    }

    /**
     * Click the Stepper's currently visible "Next" button.
     *
     * @param {boolean} waitForMatchWarning Whether to anticipate a possible match
     *                                              funds depleted warning.
     */
    progressToNextStep(waitForMatchWarning) {
        // todo clickable check? if mobile needs it
        const steps = $$(nextButtonSelector);
        steps[this.nextStepIndex].click();
        this.nextStepIndex += 1;
        // Wait for animation and scrolling to fully complete.
        // Test passing was intermittent without this fixed wait.
        this.browser.pause(250);

        if (waitForMatchWarning) {
            this.browser.pause(2750); // Allow 3s total for donation setup + MatchBot response

            const dialogCopy = 'There are no match funds currently available for this charity.';
            if (
                $(dialogSelector) && $(dialogSelector).isExisting()
                && checkSelectorContent(dialogSelector, dialogCopy)
                && checkIfElementExists(proceedAnyWayBtnSelector, 1)
            ) {
                clickSelector(proceedAnyWayBtnSelector);
            }
        }
    }

    /**
     * set amount value
     * @param {int} amount number
     */
    setDonationAmount(amount) {
        inputSelectorValue(donationAmountSelector, amount);
        // Leave tip at select dropdown's default if in Stripe mode and that field exists.
    }

    /**
     * Choose Gift Aid preference.
     */
    setGiftAidChoice() {
        // Claim Gift Aid? select NO. This means no additional Stripe mode fields for now.
        clickSelector(claimGiftAidSelector);
    }

    /**
     * Enter first & last name and email address, in Stripe mode.
     */
    populateNameAndEmail() {
        inputSelectorValue(firstNameSelector, generateIdentifier('Firstname-'));
        inputSelectorValue(lastNameSelector, generateIdentifier('Lastname-'));
        // Mailer is configured in the Regression environment to send mail via Mailtrap.io's
        // fake SMTP server, regardless of the donor's given email address.
        inputSelectorValue(emailAddressSelector, 'tech+regression+tests@thebiggive.org.uk');
    }

    /**
     * Enter a dummy postcode and standard successful Stripe test card number.
     * @link https://stripe.com/docs/testing#international-cards
     */
    populateStripePaymentDetails() {
        inputSelectorValue(billingPostcodeSelector, 'N1 1AA');

        enterStripeIframe();
        inputSelectorValue(stripeCardNumberSelector, '4000008260000000');
        inputSelectorValue(stripeExpiryDateSelector, '01/25');
        inputSelectorValue(stripeCvcSelector, '123');
        leaveStripeIframe();
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
    }
}
