import {BeforeAll, Given, Then, When,} from '@cucumber/cucumber';

import {generateRandomPassword, goToUrl, randomEmail, randomFirstName, randomLastName} from '../support/util';
import {checkSelectorContent, checkTitle, checkUrl} from "../support/check";
import {clickBigGiveButtonWithText, inputSelectorValue} from "../support/action";
import {emailAddressSelector} from "../pages/DonateStartPage";
import {checkAnEmailBodyContainsText, getRegularGivingTempPassword} from "../support/mailtrap";
import withPauseAndRetry from "../support/withPauseAndRetry";
// import {checkSelectorContent, checkTitle} from "../support/check";
// import {CHARITY_NAME} from "../support/constants";

const regularGivingCampaignId = (process.env.REGULAR_GIVING_CAMPAIGN_ID)!;

export type Donor = { firstName: string; lastName: string; email: string; password: string | null };

let nextStepIndex = 0;

const donationAmountSelector = '#donationAmount';


BeforeAll(async () => {
});

Given(/^that I am not logged in and my details are unknown to Big Give$/, async function()  {
    await browser.deleteAllCookies();

    this.donor = {
        email: randomEmail(false),
        firstName: randomFirstName(),
        lastName: randomLastName(),
        password: null,
    };
});

When(/^I open the Regular Giving application campaign start donating page$/, async () => {
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(500); // Intermittent issues with session state without this.
        await goToUrl(`/regular-giving/${regularGivingCampaignId}`);
        await checkTitle('Regular Giving');
});


Given(/^I confirm that I am an adult$/, async () => {
    // no-op because FE lets us cheat for now
    // see https://github.com/thebiggive/donate-frontend/pull/1894
});

/**
 * Click the Stepper's currently visible "Next" button.
 *
 */
export async function progressToNextStep() {
    const steps = await $$('button*=Continue');

    // eslint-disable-next-line wdio/no-pause
    await browser.pause(250);
    /** @type {WebdriverIO.Element} */
    const step = steps[nextStepIndex];
    await step.waitForStable();
    await step.click();
    nextStepIndex += 1;
    // Wait for animation and scrolling to fully complete.
    // Test passing was intermittent without this fixed wait.

    // eslint-disable-next-line wdio/no-pause
    await browser.pause(250);
}

When(
    'I enter a regular amount of £{int}',
    async (amount: number) => {
        await inputSelectorValue(donationAmountSelector, amount.toString());
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(500); // Safari Regular Giving has intermittent stepper undefined warnings without this.
    }
);
When(/^I enter my email address into the giving form$/, async function () {
    await inputSelectorValue(emailAddressSelector, this.donor!.email);
    const button = await $$('button*=Send email');
    await button[0].click();
});
When(/^I prove to the regular giving form that I can receive emails$/, async function () {
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(15 * 1000);

    const tempPassword = await getRegularGivingTempPassword(this.donor!.email); // From Mailtrap recent email subject
    // todo - add ID onto temp password input box in FE to allow more specific selector use below.
    await inputSelectorValue('input#temp-password-input', tempPassword);
    console.log('will click to continue past temp password step');

    await (await $$('#continue-from-auth'))[0].click();

    console.log('did click to continue past temp password step');
});
When(/^I enter my first and last name$/, async function () {
    const firstNameSelector = '#firstName';
    const lastNameSelector = '#lastName';
    await $(firstNameSelector).waitForStable(); // test:local-safari needed this for first input to work.

    await inputSelectorValue(firstNameSelector, this.donor!.firstName);
    await inputSelectorValue(lastNameSelector, this.donor!.firstName);
});

When(/^I create and enter a random password to continue$/, async function () {
    this.donor!.password = generateRandomPassword();

    // DON-1195-todo - change ID below and in frontend to something more accurately descriptive
    await inputSelectorValue('#password-post-donation', this.donor!.password);
    await clickBigGiveButtonWithText('Continue');

    // time for account to be set up:
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(5 * 1000);
});

Then('I should see a Regular Giving mandate for £{int} in my account', async (amount: number) => {
    await checkUrl('/my-account/regular-giving/'); // ID after this varies.

    await checkSelectorContent(
        'body',
        'Thank you! Your generous regular donation has been set up'
    );

    await checkSelectorContent(
        'div.donation-summary',
        `Your donation of £${amount}`
    );

    // Tricky to be more specific; same reason as DonateSuccessPage.checkBalance.
    await checkSelectorContent('div.receipt', `£${amount}`);
});

Then(
    'the mandate should say monthly processing started today and will proceed on the current day-ish each month',
    async () => {
        const today = new Date();
        // Angular default is the US locale date order, and we don't override that, so explicitly ask for en-US
        // which gives e.g. 'Jan 10, 2025'.
        const todayMediumFormatted = (new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })).format(today);
        const dayOfCurrentMonthOr28 = Math.min(28, today.getDate());

        // Safari and other browsers summarise table contents differently, so we have put IDs on the 2 key
        // cells we check here.
        await checkSelectorContent('#regularActiveFrom', todayMediumFormatted); // 'Active from' row
        await checkSelectorContent('#regularDayOfMonth', dayOfCurrentMonthOr28.toString()); // 'Day of month' row
    }
);

Then(
    'my last email should contain a new monthly mandate confirmation showing amount £{int}',
    async function(amount){
        const formattedAmount = `£${amount.toLocaleString('en-GB')}.00`;
        await withPauseAndRetry({
            callback: async () => {
                if (!(await checkAnEmailBodyContainsText(
                    `Donation: <strong>${formattedAmount}</strong>`,
                    this.donor!.email,
                ))) {
                    throw new Error(`Amount ${formattedAmount} not found in email`);
                }
            },
            label: 'CHECK_EMAIL_FOR_MANDATE_CONFIRMATION',
        });
    }
);
