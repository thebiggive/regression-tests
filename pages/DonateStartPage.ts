import { generateIdentifier, goToUrl } from '../support/util';
import {
    checkTitle,
    checkSelectorContent,
    elementExists,
    checkVisibleSelectorContent
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
import {Donor} from "../steps/donation";
import checkNoAccessibilityViolations from '../support/a11y';

// routes
const startPageStripe =  (process.env.DONATE_PAGE_STRIPE)!;
const regularGivingCampaignId = (process.env.REGULAR_GIVING_CAMPAIGN_ID)!;

// selectors
const idInfoSelector = '.id-info';
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

/**
 * Magic string recognized by mailer in regtest env to say we don't need the email to be sent. Saves on our monthly
 * testing limits.
 */
const NO_SEND_EMAIL = 'NO_SEND_EMAIL';

export default class DonateStartPage {
    private browser: WebdriverIO.Browser;
    public nextStepIndex: number;
    /**
     * Set up page with the expectation of starting with the first step and its
     * "Next" button, at array index 0.
     * @param browser   Global object for pauses.
     */
    constructor(browser: WebdriverIO.Browser) {
        this.browser = browser;

        // todo consider removing this and moving the state into donation.ts - this object gets shared between scenarios
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
     * @param selector Element selector.
     * @returns {Promise<any>} click() result on success.
     */
    async clickActiveSelector(selector: string) {
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
     * @param selector Element selector.
     * @param  inputValue The new value.
     * @returns setValue() result on success.
     */
    async inputSelectorValue(selector: string, inputValue: string) {
        return inputSelectorValue(selector, inputValue);
    }

    async open() {
        await goToUrl(startPageStripe);
    }

    async openWithLegacyApp() {
        await goToUrl(`${startPageStripe}?legacy=1&no-compat-check=1`);
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
     * Check the Identity service info box above the stepper contains
     * the given text.
     *
     * @param expectedText  Text anticipated somewhere in the box.
     */
    async checkIdInfo(expectedText: string) {
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1500); // Give the login call a short processing time.
        await checkVisibleSelectorContent(idInfoSelector, expectedText);
    }

    /**
     * Click the Stepper's currently visible "Next" button.
     *
     * @param waitForMatchWarning Whether to anticipate a possible match
     *                                              funds depleted warning.
     */
    async progressToNextStep(waitForMatchWarning: boolean) {
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
     * @param amount Amount to donate in pounds GBP
     */
    async setDonationAmount(amount: number) {
        await inputSelectorValue(donationAmountSelector, amount.toString());
        // Leave tip at select dropdown's default if in Stripe mode and that field exists.
    }

    async selectNoGiftAid() {
        await clickMaterialRadioWithLabel('No, I do not meet the criteria');
    }

    async populateEmail(noSend = false) {
        // This enforces the email to likely be unique, so the test to create an account works
        // because we never hit the error of the email already being used by another used. REG-26.
        let email;
        if (noSend) {
            email = `${generateIdentifier(NO_SEND_EMAIL + '+')}@thebiggivetest.org.uk`;
        } else {
            email = `${generateIdentifier('tech+regression+tests+')}@thebiggivetest.org.uk`;
        }

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
    async populateNameAndEmail({noSendEmail = false}: {noSendEmail?: boolean}) {
        const names = await this.populateNames();
        const email = await this.populateEmail(noSendEmail);

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
     * @param lastFour The last 4 digits of the card number.
     */
    async checkSavedCardIsSelected(lastFour: string) {
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
        // The move to Angular Material 15, or similar, seems to bring in some animation or rendering change
        // which means we need to wait some time to avoid a stale button element. Axe also found the page not ready
        // with no wait. Hoping that `readyState` can replace a fixed 1s wait.
        await browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
                timeout: 10_000,
                timeoutMsg: 'Page not loaded in 10s',
            }
        );

        // Axe accessibility check just before hitting donate.
        await checkNoAccessibilityViolations({
            withAngularStepperException: true,
            withSalesforceHeaderException: false,
            withContrastRatioException: false,
        });

        await clickSelector(submitBtnSelector);
    }

    async inputLoginFields(donor: Donor) {
        if (donor.password === null) {
            throw new Error('Donor password not set');
        }
        await this.inputSelectorValue('>>>#loginEmailAddress', donor.email);
        await this.inputSelectorValue('>>>#loginPassword', donor.password);
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1500); // Enough time for Friendly Captcha when the form was filled quickly.
    }


}
