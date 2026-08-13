import {
    BeforeAll, Given, Then, When
} from '@cucumber/cucumber';

import {
    checkAnEmailBodyContainsText,
    checkAnEmailSubjectContainsText,
    findAccountSetupLinkInRecentEmail,
    getVerifyCode
} from '../support/mailtrap';
import { goToUrl, randomIntFromInterval } from '../support/util';
import DonateStartPage, { emailAddressSelector, firstNameSelector, lastNameSelector } from '../pages/DonateStartPage';
import DonateSuccessPage from '../pages/DonateSuccessPage';
import { checkStripeCustomerExists, getChargedAmountPence, verifyStripePaymentIntentDetails } from '../support/stripe';
import {
    checkSelectorContent,
    checkSelectorValue,
    checkTitle,
    checkVisibleSelectorContent
} from '../support/check';
import { clickBigGiveButtonWithOuterSelector, clickBigGiveButtonWithText } from '../support/action';
import RegistrationPage from '../pages/RegistrationPage';
import withPauseAndRetry from '../support/withPauseAndRetry';

const stripeUseCreditsMessageSelector = '#useCreditsMessage';

let donationAmount: number;

export type Donor = { firstName: string; lastName: string; email: string; password: string | null };

let page: DonateStartPage;
BeforeAll(async () => {
    page = new DonateStartPage(browser);
});

// Steps
Given('I have registered and logged in as a donor', async function() {
    await page.openRegister();

    // Complete register form
    this.donor = {
        firstName: 'default-first-name',
        lastName: 'default-last-name',
        email: 'default-email',
        password: null,
    };

    this.donor.email = await page.populateEmail();
    await clickBigGiveButtonWithOuterSelector('#register-button');

    // In other Mailtrap places we wait 35s atm, I'm hoping we can do a little less here.
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(15 * 1000);

    const verifyCode = await getVerifyCode(this.donor.email); // From Mailtrap recent email subject
    await page.inputSelectorValue('>>>#code', verifyCode);
    await clickBigGiveButtonWithText('Continue');

    const names = await page.populateNames();
    this.donor.firstName = names.firstName;
    this.donor.lastName = names.lastName;

    this.donor.password = await RegistrationPage.populatePassword();
    await clickBigGiveButtonWithOuterSelector('#register-button');
    await RegistrationPage.checkCopySaysImRegistered();

    // Complete login form
    await page.inputLoginFields(this.donor);
    await clickBigGiveButtonWithText('Log in');

    await checkTitle('My account – Big Give');

    // Actions after this may rely on a message having been sent from Identity to Matchbot to turn
    // a Person record into a DonorAccount. E.g. the regular giving form assumes donor has a
    // DonorAccount in matchbot and errors if not.
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(10 * 1000);
});

Given(
    /^that I am on my chosen charity's Donate page$/,
    async () => {
        page.nextStepIndex = 0;
        await page.open();
        await page.checkReady();
    }
);

Given(
    /^that I am on my chosen charity's Donate page, using the legacy browser app$/,
    async () => {
        page.nextStepIndex = 0;
        await page.openWithLegacyApp();
        await page.checkReady();
    }
);

When("I click the popup's login button", async () => {
    // We use an ID here as we can't combine deep and text selectors.
    await page.clickActiveSelector('>>>#login-modal-submit');
});

When(/I click the "([^"]+)" button/, async (buttonText) => {
    // Sometimes a top level <button> Angular-styled, sometimes nested inside shadow
    // DOM in a <biggive-button>, so use >>> to make it work either way.
    await page.clickActiveSelector(`button*=${buttonText}`);
});

When(
    /I enter the ID account test ([a-z\s]+) for "[^"]+"/,
    async (dataPoint) => {
        let elementId;
        let value;
        switch (dataPoint) {
            case 'email address':
                elementId = 'loginEmailAddress';
                value = /** @type {string} */ (process.env.DONOR_ID_REGISTERED_EMAIL)!;
                break;
            case 'password':
                elementId = 'loginPassword';
                value = /** @type {string} */ (process.env.DONOR_ID_REGISTERED_PASSWORD)!;
                break;
            default:
                throw new Error('Unknown value');
        }

        await page.inputSelectorValue(`>>>#${elementId}`, value);
    },
);

When('I enter the ID credit-funded account test email and password', async function() {
    this.donor = {
        email: process.env.CREDIT_EMAIL!,
        password: process.env.CREDIT_PASSWORD!,
        firstName: '',
        lastName: '',
    };
    await page.inputSelectorValue('>>>#loginEmailAddress', this.donor.email!);
    await page.inputSelectorValue('>>>#loginPassword', this.donor.password!);
});

When(
    /I should see "([^"]+)" in the ID info box/,
    async (expectedText) => page.checkIdInfo(expectedText),
);

When(
    'I enter an amount between £{int} and £{int}',
    /**
     * @param {number} lowerBound
     * @param {number} upperBound
     */
    async (lowerBound, upperBound) => {
        donationAmount = randomIntFromInterval(lowerBound, upperBound);
        await page.setDonationAmount(donationAmount);
        await page.progressToNextStep(true);
    }
);

When(
    'I enter an amount of £{int}',
    /**
     * @param {number} amountEntered
     */
    async (amountEntered) => {
        donationAmount = amountEntered;
        await page.setDonationAmount(donationAmount);
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(500); // Safari Regular Giving has intermittent stepper undefined warnings without this.
        await page.progressToNextStep(false);
    }
);

When(
    'I update the amount to £{int}',
    /**
     * @param {number} amount
     */
    async (amount) => {
        donationAmount = amount;
        await page.setDonationAmount(donationAmount);
        await page.progressToNextStep(true);

        // The page will likely jump over the Gift Aid step, see this thread to understand why:
        // https://thebiggive.slack.com/archives/C04BETLU4UC/p1670948304352859?thread_ts=1670945073.540179&cid=C04BETLU4UC
        // See ticket REG-21
        // Wait 20 seconds for donation setup & MatchBot & identity & SF callouts
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(20000);

        // Explicitly call the Gift Aid step, in case the browser skipped it.
        await page.clickOnGiftAidTab();
    }
);

When(
    'I say no to Gift Aid',
    async () => {
        await page.selectNoGiftAid();
        await page.progressToNextStep(true);
    }
);

When(/I skip over (.+) step/, async (step: string) => {
    void step;
    await page.progressToNextStep(false);
});

When(
    'I enter my name, email address and UK Visa card number',
    async function () {
        this.donor = await page.populateNameAndEmail({});
        await page.populateStripePaymentDetails();
        await page.progressToNextStep(false);
    }
);

/**
 * We have a limited allowance of test emails per month, so we don't want to test the email feature more than
 * necessary.
 */
When(
    'I enter my name, an email address that does not receive email and UK Visa card number',
    async function ()  {
        this.donor = await page.populateNameAndEmail({noSendEmail: true});
        await page.populateStripePaymentDetails();
        await page.progressToNextStep(false);
    }
);

When('I enter a UK Visa card number', async () => {
    await page.populateStripePaymentDetails();
    await page.progressToNextStep(false);
});

When(
    /I should see my populated first name is "([^"]+)"/,
    async function(expectedFirstName) {
        await checkSelectorValue(firstNameSelector, expectedFirstName);
        // set donor.firstName so the test titled 'my last email
        // should contain the correct name' works correctly
        this.donor!.firstName = expectedFirstName;
    },
);

When(
    /I should see my populated surname is "([^"]+)"/,
    async function (expectedSurname) {
        await checkSelectorValue(lastNameSelector, expectedSurname);
        // set donor.lastName so the test titled 'my last email
        // should contain the correct name' works correctly
        this.donor!.lastName = expectedSurname;
    },
);

When(
    /I should see my populated email is "([^"]+)"/,
    async function (expectedEmail) {
        await checkSelectorValue(emailAddressSelector, expectedEmail);
        this.donor!.email = expectedEmail;
    },
);

When(
    /I should see "([^"]+)" instead of asking for my bank details./,
    async (expectedCreditMessage) => await checkSelectorContent(
        stripeUseCreditsMessageSelector,
        expectedCreditMessage,
    ),
);

When(
    /I should see an existing card ending ([0-9]+) already pre-selected/,
    async (expectedLastFour) => page.checkSavedCardIsSelected(expectedLastFour),
);

When(
    'I continue through this step with no changes',
    async () => page.progressToNextStep(false),
);

When(
    'I choose a preference for charity and TBG communications',
    async () => {
          await page.setCommsPreferences();
        await page.progressToNextStep(false);
    }
);

When(
    'I navigate back to the first step',
    async () => {
        await page.jumpBackToFirstStep();
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1_000); // Animation seems to need a moment in some browsers?
    },
);

When(
    'I press Donate',
    async () => page.submitForm(),
);

Then(
    'I should be redirected to a Thank You confirmation page with amount £{int}',
    /**
     * @param {number} amount
     */
    async (amount) => {
        await DonateSuccessPage.checkReady();
        await DonateSuccessPage.checkBalance(amount);
    }
);

Then(/^I should be redirected to a Thank You confirmation page with the correct amount$/, async () => {
    await DonateSuccessPage.checkReady();
    await DonateSuccessPage.checkBalance(donationAmount);
});

When(
    'I wait a few seconds',
    // eslint-disable-next-line wdio/no-pause
    async () => browser.pause(3 * 1000)
);

When(
    'I wait long enough for email processing',
    // 35s to allow SF + Mailtrap time to process everything
    // eslint-disable-next-line wdio/no-pause
    async () => browser.pause(35 * 1000)
);

Then('I should be invited to log in', async () => {
    await checkVisibleSelectorContent('main', 'Log in');
});

async function checkAmountInEmail (amount: number, donor: Donor)  {
    const formattedAmount = amount.toLocaleString('en-GB');

    if (!(await checkAnEmailBodyContainsText(
        `Donation: <strong>£${formattedAmount}.00</strong>`,
        donor.email
    ))) {
        throw new Error(`Donation amount £${formattedAmount} not found in email`);
    }
}

Then(
    'my last email should contain amount £{int}',
    async function (amount) { await checkAmountInEmail(amount, this.donor!)}
);

Then(
    'my last email should contain the correct amounts',
    async function () {await checkAmountInEmail(donationAmount, this.donor!)}
);

Then(
    'my last email should contain the charity\'s custom thank you message',
    async function () {
        const customThanks = process.env.CHARITY_CUSTOM_THANKS;
        if (!customThanks) throw new Error('Custom thanks message not set in environment');

        if (!(await checkAnEmailBodyContainsText(customThanks, this.donor!.email))) {
            throw new Error('Charity thank you message not found in email');
        }
    }
);

Then(
    'my last email should contain the correct name',
    async function () {
        const donor = this.donor!;
        if (!(await checkAnEmailBodyContainsText(
            `Donor: <strong>${donor.firstName} ${donor.lastName}</strong>`,
            donor.email,
        ))) {
            throw new Error(`Donor name ${donor.firstName} ${donor.lastName} not found in email`);
        }
    }
);

When(
    'I register using the link in my donation thanks message',
    async function () {
        const link = await withPauseAndRetry({
            callback: () => findAccountSetupLinkInRecentEmail(this.donor!.email), //
            predicate: (l) => !!l,
            label: 'FIND_LINK_IN_THANKS_MESSAGE',
        });

        if (!link) {
            throw new Error('Link not found in donation thanks message');
        }
        await goToUrl(link.toString());

        await RegistrationPage.populatePassword();
        await clickBigGiveButtonWithOuterSelector('#register-button-post-donation');
        await RegistrationPage.checkCopySaysImRegistered();
    }
);

When(
    /^I press on the button to set a password$/,
    async () => {
        await DonateSuccessPage.clickOnSetPasswordButton();
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1000); // Give modal state change and ID service 1s grace.
    }
);

When(
    /^I press on the button to create an account$/,
    async () => {
        await DonateSuccessPage.clickOnCreateAccountButton();
    }
);

Then(
    /^I should receive a registration success email with the email I donated with$/,
    async function () {
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(15 * 1000);
        await checkAnEmailSubjectContainsText('You are registered with Big Give', this.donor!.email);

        const expectedCopy = `You are now registered for Big Give with the email address: ${this.donor!.email}`;

        if (!(await checkAnEmailBodyContainsText(
            expectedCopy,
            this.donor!.email
        ))) {
            throw new Error(`Registration email with expected copy not found.
            Expected: ${expectedCopy}`);
        }
    }
);
Then(
    /^my charity has been charged a vat inclusive fee of £([0-9.]+)$/,
    async function (expectedAmount: string) {
        await checkStripeCustomerExists(this.donor!.email);

        const thanksPageurl = await browser.getUrl();
        const donationUUId = thanksPageurl.split('/').pop();
        if (!donationUUId) {
            throw new Error(`Couldn't find donation UUID in URL: ${thanksPageurl}`);
        }

        const amountChargedToCharityPence = await getChargedAmountPence(donationUUId);

        // rounding is required for some but not all numbers to deal with approximation from converting from
        // decimal (i.e. string) to float.
        if (amountChargedToCharityPence !== Math.round(100 * Number(expectedAmount))) {
            throw new Error(
                `Amount charged to charity not as expected, expected ${expectedAmount}, found ${amountChargedToCharityPence}`
            );
        } else {
            console.log(`CHECK: Stripe shows amount charged to charity is £${amountChargedToCharityPence} as expected`);
        }
    }
);
Given(
    'other payment intent data is as expected: total charged to donor: £{float}, '
    + 'application fee £{float}, stripe fee gross £{float}, stripe fee net £{float}, stripe fee vat £{float}',
    (totalCharged, applicationFee, feeGros, feeNet, feeVAT) => {
        verifyStripePaymentIntentDetails({
            totalCharged, applicationFee, feeGros, feeNet, feeVAT,
        });
        console.log('CHECK: Other stripe payment intent details are as expected');
    }
);
