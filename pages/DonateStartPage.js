import AxeBuilder from '@axe-core/webdriverio';

import { generateIdentifier, goToUrl } from '../support/util';
import {
    checkTitle,
    checkSelectorContent,
    checkVisibleSelectorContent,
    elementExists
}
    from '../support/check';
import {
    clickElement,
    clickSelector,
    inputSelectorValue, inStripeIframe
} from '../support/action';

// routes
const startPageStripe = /** @type {string} */ (process.env.DONATE_PAGE_STRIPE);
const regularGivingCampaignId = /** @type {string} */ (process.env.REGULAR_GIVING_CAMPAIGN_ID);

// selectors
const idInfoSelector = '.id-info';
const submitBtnSelector = 'button*=Donate ';
const donationAmountSelector = '#donationAmount';
// Now we show the Gift Aid section conditionally, this is mounted last
// and the ratio gets the highest ID.
// TODO avoid these hacks for radio selectors! We should be checking copy
// ideally. Now we don't support IE for any journey we can hopefully use standard Xpath.
const yourDonationStepSelector = '#cdk-step-label-0-0';
const giftAidStepSelector = '#cdk-step-label-0-1';
const rejectGiftAidSelector = '#mat-radio-9';
export const firstNameSelector = '#firstName';
export const lastNameSelector = '#lastName';
export const emailAddressSelector = '#emailAddress';
const receiveEmailFromCharitySelector = '#mat-radio-3';
const receiveEmailFromTheBigGiveSelector = '#mat-radio-6';
const billingPostcodeSelector = '#billingPostcode';
const stripeCardNumberSelector = 'input[name$="number"]';
const stripeExpiryDateSelector = 'input[name$="expiry"]';
const stripeCvcSelector = 'input[name$="cvc"]';
const selectedSavedCardSelector = '.PickerItem--selected';
const continueBtnSelector = '>>>#proceed-with-donation';

export default class DonateStartPage {
    /**
     * Set up page with the expectation of starting with the first step and its
     * "Next" button, at array index 0.
     * @param {WebdriverIO.Browser} browser   Global object for pauses.
     */
    constructor(browser) {
        this.browser = browser;

        // todo consider removing this and moving the state into donation.js - this object gets shared between scenarios
        this.nextStepIndex = 0;

        this.charity = 'Exempt Stripe Test Charity';
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
     * @returns {Promise<any>} click() result on success.
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
     * @returns {Promise<any>} setValue() result on success.
     */
    async inputSelectorValue(selector, inputValue) {
        return inputSelectorValue(selector, inputValue);
    }

    async open() {
        this.charity = 'Exempt Stripe Test Charity';
        await goToUrl(startPageStripe);
    }

    async openRegister() {
        await goToUrl('/register');
        await checkTitle('Register');
    }

    async openRegularGiving() {
        await goToUrl(`/regular-giving/${regularGivingCampaignId}`);
        await checkTitle('Regular Giving');
    }

    async checkReady() {
        await checkTitle(`Donate to ${this.charity}`);
        await checkSelectorContent('form', this.charity);
    }

    /**
     * Check the Identity service info box above the stepper contains
     * the given text.
     *
     * @param {string} expectedText  Text anticipated somewhere in the box.
     */
    async checkIdInfo(expectedText) {
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1500); // Give the login call a short processing time.
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
        const steps = await $$('button*=Continue');
        await steps[this.nextStepIndex].click();
        this.nextStepIndex += 1;
        // Wait for animation and scrolling to fully complete.
        // Test passing was intermittent without this fixed wait.
        await this.browser.pause(250);

        if (waitForMatchWarning) {
            // Allow another 4.75s for donation setup & MatchBot & identity & SF callouts
            await this.browser.pause(4750);

            if (await elementExists(continueBtnSelector)) {
                await clickSelector(continueBtnSelector);
                // Allow for close animation so as not to interrupt subsequent input.
                await this.browser.pause(250);
            }
        }
    }

    /**
     * @param {number} amount Amount to donate in pounds GBP
     */
    async setDonationAmount(amount) {
        await inputSelectorValue(donationAmountSelector, amount.toString());
        // Leave tip at select dropdown's default if in Stripe mode and that field exists.
    }

    async selectNoGiftAid() {
        // Pause for 2 secs
        await this.browser.pause(2000);
        // Claim Gift Aid? select NO. This means no additional Stripe mode fields for now.
        await clickSelector(rejectGiftAidSelector);
    }

    /**
     * Enter first & last name and email address, in Stripe mode.
     * @returns {Promise<import('../steps/donation').Donor>}
     */
    async populateNameAndEmail() {
        const firstName = generateIdentifier('Firstname-');
        const lastName = generateIdentifier('Lastname-');
        // This enforces the email to always be unique, so the test to create an account works
        // because we never hit the error of the email already being used by another used. REG-26.
        const email = `${generateIdentifier('tech+regression+tests+')}@thebiggivetest.org.uk`;

        await $(firstNameSelector).waitForStable(); // test:local-safari needed this for first input to work.
        await inputSelectorValue(firstNameSelector, firstName);
        await inputSelectorValue(lastNameSelector, lastName);
        // Mailer is configured in the Regression environment to send mail via Mailtrap.io's
        // fake SMTP server, regardless of the donor's given email address.
        await inputSelectorValue(emailAddressSelector, email);

        return {
            firstName,
            lastName,
            email,
            password: null,
        };
    }

    /**
     * Check a Stripe saved card is available and active.
     *
     * @param {string} lastFour The last 4 digits of the card number.
     */
    async checkSavedCardIsSelected(lastFour) {
        await inStripeIframe(async () => {
            await checkSelectorContent(
                selectedSavedCardSelector,
                lastFour,
            );
        });
    }

    /**
     * Enter a dummy postcode and standard successful Stripe test card number.
     * @link https://stripe.com/docs/testing#international-cards
     */
    async populateStripePaymentDetails() {
        await inputSelectorValue(billingPostcodeSelector, 'N1 1AA');

        await inStripeIframe(async () => {
            /** see https://docs.stripe.com/testing */
            const UKVisaCardPAN = '4000008260000000';

            await inputSelectorValue(stripeCardNumberSelector, UKVisaCardPAN);
            await inputSelectorValue(stripeExpiryDateSelector, '01/25');
            await inputSelectorValue(stripeCvcSelector, '123');
        });
    }

    /**
     * Choose email communication preferences.
     */
    async setCommsPreferences() {
        // Allow enough time for the checkboxes to render
        await this.browser.pause(1000);

        // Receive email from the charity? select NO
        await clickSelector(receiveEmailFromCharitySelector);

        // Receive email from the Big Give? select NO
        await this.browser.pause(750); // Seems to need a wait after the other radio select as of Angular Material 15.
        await clickSelector(receiveEmailFromTheBigGiveSelector);
    }

    /**
     * Click on the first mat-stepper to jump back to the 'your donation' step
     */
    async jumpBackToFirstStep() {
        await clickSelector(yourDonationStepSelector);
        this.nextStepIndex = 0;
    }

    /**
     * Click on the second mat-stepper to jump back to the gift aid step
     */
    async clickOnGiftAidTab() {
        await clickSelector(giftAidStepSelector);
        this.nextStepIndex = 1;
    }

    /**
     * Press donate button
     */
    async submitForm() {
        // Experimental Axe check just before hitting donate.
        this.checkNoAccessibilityViolations();

        // The move to Angular Material 15, or similar, seems to bring in some animation or rendering change
        // which means we need to wait some fixed time to avoid a stale button element.
        await this.browser.pause(1000);

        await clickSelector(submitBtnSelector);
    }

    /**
     * @param {{firstName: string, lastName: string, email: string, password: string|null}} donor
     */
    async inputLoginFields(donor) {
        if (donor.password === null) {
            throw new Error('Donor password not set');
        }
        await this.inputSelectorValue('>>>#loginEmailAddress', donor.email);
        await this.inputSelectorValue('>>>#loginPassword', donor.password);
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1500); // Enough time for Friendly Captcha when the form was filled quickly.
    }

    /**
     * Run Axe on the current page. Fail tests if there are unexpected violations. Log
     * incompletes.
     */
    async checkNoAccessibilityViolations() {
        // todo reinstate when known a11y problems fixed, via
        // https://github.com/thebiggive/donate-frontend/pull/1325 and maybe others
        return;

        /* eslint-disable no-unreachable */

        const builder = new AxeBuilder({ client: browser });

        // We accept that the contrast is not good enough on the twitter floating share link
        builder.exclude('[data-tag="twitter"]');

        // the follow rules are currently known to fail - see issue REG-23
        builder.disableRules(['page-has-heading-one', 'region', 'duplicate-id']); // @todo re-enable duplicate-id rule

        const result = await builder.analyze();

        const violationCount = result.violations.length;
        if (violationCount > 0) {
            console.log(`${violationCount} accessibility violations`);

            result.violations.forEach((violation) => {
                console.log(violation.description);
                violation.nodes.forEach((node) => {
                    console.log(node.html);
                });
            });

            throw new Error(
                // eslint-disable-next-line max-len
                `Accessibility check failed before donate button click, ${violationCount} issues:\n\n${JSON.stringify(result.violations, null, '  ')}`
            );
        }

        if (result && result.incomplete.length > 0) {
            console.log(`${result.incomplete.length} accessibility incomplete items`);

            result.incomplete.forEach((incompleteItem) => {
                console.log(incompleteItem.description);
                incompleteItem.nodes.forEach((node) => {
                    console.log(node.html);
                });
            });
        }

        /* eslint-enable no-unreachable */
    }
}
