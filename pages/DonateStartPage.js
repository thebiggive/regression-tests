import { generateIdentifier, goToUrl } from '../support/util';
import {
    checkTitle,
    checkSelectorContent,
    checkIfElementExists,
    checkVisibleSelectorContent,
    elementExists
}
    from '../support/check';
import {
    clickElement,
    clickSelector,
    enterStripeIframe,
    inputSelectorValue,
    leaveStripeIframe
} from '../support/action';

const AxeBuilder = require('@axe-core/webdriverio').default;

// routes
const startPageStripe = process.env.DONATE_PAGE_STRIPE;

// selectors
const idInfoSelector = '.id-info';
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
const stripeSavedCardInputSelector = '#useSavedCard';
const continueBtnSelector = '>>>#proceed-with-donation';
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
     * Click anything selectable. Accounts for the possibilty that there's 1+ match
     * but only 1 is clickable, such as when "Log in" is on the page main page *and*
     * inside a modal.
     *
     * For now, comes with a 1s pause after click to give APIs etc. time to run
     * while keeping the step definitions simple.
     *
     * @param {string} selector Element selector.
     * @returns {any} click() result on success.
     */
    async clickActiveSelector(selector) {
        let bestButton;

        await $$(selector).forEach(async (thisButton) => {
            if (await thisButton.isClickable()) {
                bestButton = thisButton;
            }
        });

        if (bestButton === undefined) {
            throw new Error(`Could not find any clickable "${selector}" selector.`);
        }

        await clickElement(bestButton, selector);

        await this.browser.pause(1000); // Give modal state change and ID service 1s grace.
    }

    /**
     * Input into any selectable field.
     *
     * @param {string} selector Element selector.
     * @param {string} inputValue The new value.
     * @returns {any} setValue() result on success.
     */
    async inputSelectorValue(selector, inputValue) {
        return inputSelectorValue(selector, inputValue);
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
     * Check the Identity service info box above the stepper contains
     * the given text.
     *
     * @param {string} expectedText  Text anticipated somewhere in the box.
     */
    async checkIdInfo(expectedText) {
        await checkVisibleSelectorContent(idInfoSelector, expectedText);
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
            await this.browser.pause(4750); // Allow 5s total for donation setup + MatchBot response

            if (await elementExists(continueBtnSelector)) {
                await clickSelector(continueBtnSelector);
                // Allow for close animation so as not to interrupt subsequent input.
                await this.browser.pause(250);
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
     * Verify that name & email fields match the Stripe test Customer's for the donor with an
     * existing account.
     */
    async checkExistingNameAndEmail() {
        const firstName = await $(firstNameSelector).getValue();
        const lastName = await $(lastNameSelector).getValue();
        const emailAddress = await $(emailAddressSelector).getValue();

        if (firstName !== 'RegressionTest') {
            throw new Error('First name value not as expected.');
        }

        if (lastName !== 'User') {
            throw new Error('Last name value not as expected.');
        }

        if (emailAddress !== 'tech+regression+donor@thebiggive.org.uk') {
            throw new Error('Email address value not as expected');
        }
    }

    /**
     * Check a Stripe saved card is available and active.
     *
     * @param {string} lastFour The last 4 digits of the card number.
     */
    async checkSavedCardIsSelected(lastFour) {
        if (!(await checkIfElementExists(stripeSavedCardInputSelector))) {
            throw new Error('Saved card input checkbox not detected.');
        }

        const checkboxInput = await $(stripeSavedCardInputSelector);
        if (!(await (await checkboxInput.$('input')).getProperty('checked'))) {
            throw new Error('Saved card is not auto-selected.');
        }

        await checkSelectorContent(
            stripeSavedCardInputSelector,
            `Use saved card ending ${lastFour}.`,
        );
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
        // Experimental Axe check just before hitting donate.
        this.checkNoAccessibilityViolations();

        await clickSelector(submitBtnSelector);
    }

    /**
     * Run Axe on the current page. Fail tests if there are violations (todo). Log violations
     * and incompletes.
     */
    async checkNoAccessibilityViolations() {
        const builder = new AxeBuilder({ client: browser });
        const result = await builder.analyze();

        if (result.violations.length > 0) {
            console.log(`${result.violations.length} accessibility violations`);

            result.violations.forEach((violation) => {
                console.log(violation.description);
                violation.nodes.forEach((node) => {
                    console.log(node.html);
                });
            });

            // TODO Throw an error once the frontend is in a known good state.
            // throw new Error('Accessibility check failed before donate button click');
        }

        if (result.incomplete.length > 0) {
            console.log(`${result.incomplete.length} accessibility incomplete items`);

            result.incomplete.forEach((incompleteItem) => {
                console.log(incompleteItem.description);
                incompleteItem.nodes.forEach((node) => {
                    console.log(node.html);
                });
            });
        }
    }
}
