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
const startPageStripe = process.env.DONATE_PAGE_STRIPE;

// selectors
const submitBtnSelector = 'button*=Donate ';
const donationAmountSelector = '#donationAmount';
// Now we show the Gift Aid section conditionally, this is mounted last
// and the ratio gets the highest ID.
// TODO avoid these hacks for radio selectors! We should be checking copy
// ideally. Now we don't support IE for any journey we can hopefully use standard Xpath.
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
const continueBtnSelector = 'button*=Continue donation';
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
        this.charity = null;
    }

    /**
     * open the donate page
     */
    async open() {
        this.charity = 'Exempt Stripe Test Charity';
        await goToUrl(startPageStripe);
    }

    /**
     * check if page ready
     */
    async checkReady() {
        await checkTitle(`Donate to ${this.charity}`);
        await checkSelectorContent(pageHeadingSelector, this.charity);
    }

    /**
     * Click the Stepper's currently visible "Next" button.
     *
     * @param {boolean} waitForMatchWarning Whether to anticipate a possible match
     *                                              funds depleted warning.
     */
    async progressToNextStep(waitForMatchWarning) {
        // todo clickable check? if mobile needs it
        const steps = await $$(nextButtonSelector);
        await steps[this.nextStepIndex].click();
        this.nextStepIndex += 1;
        // Wait for animation and scrolling to fully complete.
        // Test passing was intermittent without this fixed wait.
        await this.browser.pause(250);

        if (waitForMatchWarning) {
            await this.browser.pause(2750); // Allow 3s total for donation setup + MatchBot response

            const dialogCopy = 'There are no match funds currently available for this charity.';
            if (
                $(dialogSelector) && (await $(dialogSelector).isExisting())
                && (await checkSelectorContent(dialogSelector, dialogCopy))
                && (await checkIfElementExists(continueBtnSelector, 1))
            ) {
                await clickSelector(continueBtnSelector);
            }
        }
    }

    /**
     * set amount value
     * @param {int} amount number
     */
    async setDonationAmount(amount) {
        await inputSelectorValue(donationAmountSelector, amount);
        // Leave tip at select dropdown's default if in Stripe mode and that field exists.
    }

    /**
     * Choose Gift Aid preference.
     */
    async setGiftAidChoice() {
        // Claim Gift Aid? select NO. This means no additional Stripe mode fields for now.
        await clickSelector(claimGiftAidSelector);
    }

    /**
     * Enter first & last name and email address, in Stripe mode.
     */
    async populateNameAndEmail() {
        await inputSelectorValue(firstNameSelector, generateIdentifier('Firstname-'));
        await inputSelectorValue(lastNameSelector, generateIdentifier('Lastname-'));
        // Mailer is configured in the Regression environment to send mail via Mailtrap.io's
        // fake SMTP server, regardless of the donor's given email address.
        await inputSelectorValue(emailAddressSelector, 'tech+regression+tests@thebiggive.org.uk');
    }

    /**
     * Enter a dummy postcode and standard successful Stripe test card number.
     * @link https://stripe.com/docs/testing#international-cards
     */
    async populateStripePaymentDetails() {
        await inputSelectorValue(billingPostcodeSelector, 'N1 1AA');

        await enterStripeIframe();
        await inputSelectorValue(stripeCardNumberSelector, '4000008260000000');
        await inputSelectorValue(stripeExpiryDateSelector, '01/25');
        await inputSelectorValue(stripeCvcSelector, '123');
        await leaveStripeIframe();
    }

    /**
     * Choose email communication preferences.
     */
    async setCommsPreferences() {
        // Receive email from the charity? select NO
        await clickSelector(receiveEmailFromCharitySelector);

        // Receive email from the Big Give? select NO
        await clickSelector(receiveEmailFromTheBigGiveSelector);
    }

    /**
     * press donate button
     */
    async submitForm() {
        await clickSelector(submitBtnSelector);
    }
}
