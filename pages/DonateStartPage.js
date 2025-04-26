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
    clickMaterialRadioWithLabel,
    clickSelector,
    inputSelectorValue,
    inStripeIframe
} from '../support/action';

import { CHARITY_NAME } from '../support/constants';

// routes
const startPageStripe = /** @type {string} */ (process.env.DONATE_PAGE_STRIPE);
const regularGivingCampaignId = /** @type {string} */ (process.env.REGULAR_GIVING_CAMPAIGN_ID);

// selectors
const submitBtnSelector = 'button*=Donate ';
const donationAmountSelector = '#donationAmount';
const yourDonationStepSelector = '#cdk-stepper-0-label-0';
const giftAidStepSelector = '#cdk-stepper-0-label-1';
export const firstNameSelector = '#firstName';
export const lastNameSelector = '#lastName';
export const emailAddressSelector = '#emailAddress';
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
        await goToUrl(startPageStripe);
    }

    async openRegister() {
        await goToUrl('/register');
        await checkTitle('Register');
    }

    async openRegularGiving() {
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(500); // Intermittent issues with session state without this.
        await goToUrl(`/regular-giving/${regularGivingCampaignId}`);
        await checkTitle('Regular Giving');
    }

    async checkReady() {
        await checkTitle(`Donate to ${CHARITY_NAME}`);
        await checkSelectorContent('form', CHARITY_NAME);
    }

    /**
     * Click the Stepper's currently visible "Next" button.
     *
     * @param {boolean} waitForMatchWarning Whether to anticipate a possible match
     *                                              funds depleted warning.
     */
    async progressToNextStep(waitForMatchWarning) {
        const steps = await $$('button*=Continue');

        await this.browser.pause(250);
        /** @type {WebdriverIO.Element} */
        const step = steps[this.nextStepIndex];
        await step.waitForStable();
        await step.click();
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
        await clickMaterialRadioWithLabel('No, I do not meet the criteria');
    }

    async populateEmail() {
        // This enforces the email to likely be unique, so the test to create an account works
        // because we never hit the error of the email already being used by another used. REG-26.
        const email = `${generateIdentifier('tech+regression+tests+')}@thebiggivetest.org.uk`;

        // Mailer is configured in the Regression environment to send mail via Mailtrap.io's
        // fake SMTP server, regardless of the donor's given email address.
        await inputSelectorValue(emailAddressSelector, email);

        return email;
    }

    async populateNames() {
        const firstName = generateIdentifier('Firstname-');
        const lastName = generateIdentifier('Lastname-');

        await $(firstNameSelector).waitForStable(); // test:local-safari needed this for first input to work.

        await inputSelectorValue(firstNameSelector, firstName);
        await inputSelectorValue(lastNameSelector, lastName);

        return {
            firstName,
            lastName,
        };
    }

    /**
     * Enter first & last name and email address, in Stripe mode.
     * @returns {Promise<import('../steps/donation').Donor>}
     */
    async populateNameAndEmail() {
        const names = await this.populateNames();
        const email = await this.populateEmail();

        return {
            firstName: names.firstName,
            lastName: names.lastName,
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
            await inputSelectorValue(stripeExpiryDateSelector, '01/35');
            await inputSelectorValue(stripeCvcSelector, '123');
        });
    }

    /**
     * Choose email communication preferences.
     */
    async setCommsPreferences() {
        // Receive email from the charity? select NO
        // Keeping this generic because we have varying charity data, and fortunately the charity question comes
        // first; so by clicking the first match it will be the right one.
        await clickMaterialRadioWithLabel('No, I would not like to receive emails');

        await clickMaterialRadioWithLabel('No, I would not like to receive emails from Big Give');
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
