import {
    BeforeAll, Given, Then, When
} from '@cucumber/cucumber';

import { checkAnEmailBodyContainsText, checkAnEmailSubjectContainsText } from '../support/mailtrap';
import { randomIntFromInterval } from '../support/util';
import DonateStartPage, { emailAddressSelector, firstNameSelector, lastNameSelector } from '../pages/DonateStartPage';
import DonateSuccessPage from '../pages/DonateSuccessPage';
import { checkStripeCustomerExists, getChargedAmount, verifyStripePaymentIntentDetails } from '../support/stripe';
import {
    checkSelectorContent,
    checkSelectorValue,
    checkTitle,
    checkUrl,
    checkVisibleSelectorContent
} from '../support/check';
import { clickElement } from '../support/action';

const stripeUseCreditsMessageSelector = '#useCreditsMessage';

/**
 * @type {number}
 */
let donationAmount;

/**
 * @typedef {{firstName: string, lastName: string, email: string, password: string|null}} Donor
   @type {Donor}
 * */
let donor = {
    firstName: 'default-first-name',
    lastName: 'default-last-name',
    email: 'default-email',
    password: null,
};

/** @type DonateStartPage * */
let page;
// eslint-disable-next-line new-cap
BeforeAll(async () => {
    page = new DonateStartPage(browser);
});

// Steps
Given('I am on the standalone Register page', async () => {
    await page.openRegister();
});

Given(
    /^that I am on my chosen charity's Donate page$/,
    async () => {
        page.nextStepIndex = 0;
        await page.open();
        await page.checkReady();
    }
);

Then(/^I should be on the "([^"]+)" page$/, async (title) => {
    await checkTitle(`${title} – Big Give`);
});

When(/^I open the Regular Giving application campaign start donating page$/, async () => {
    await page.openRegularGiving();
});

When("I click the popup's login button", async () => {
    // We use an ID here as we can't combine deep and text selectors.
    await page.clickActiveSelector('>>>#login-modal-submit');
});

When(/I click the "([^"]+)" Big Give button/, async (buttonText) => {
    const button = await $('biggive-button');
    // todo actually check the text; for now we assume there's one.
    //.find(
      //  async (el) => (await el.getText()).includes(buttonText),
    //);

    console.log('button in bg btn thing', button);

    // `isClickable()` doesn't work with shadow DOM pseudo-buttons, not entirely sure why.
    const realButton = button.$('>>>a.button');
    await clickElement(realButton, '[biggive-button two stage select]');
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
                value = /** @type {string} */ (process.env.DONOR_ID_REGISTERED_EMAIL);
                break;
            case 'password':
                elementId = 'loginPassword';
                value = /** @type {string} */ (process.env.DONOR_ID_REGISTERED_PASSWORD);
                break;
            default:
                throw new Error('Unknown value');
        }

        await page.inputSelectorValue(`>>>#${elementId}`, value);
    },
);

When('I enter the ID credit-funded account test email and password', async () => {
    await page.inputSelectorValue('>>>#loginEmailAddress', /** @type {string} */ (process.env.CREDIT_EMAIL));
    await page.inputSelectorValue('>>>#loginPassword', /** @type {string} */ (process.env.CREDIT_PASSWORD));
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
        await page.progressToNextStep(true);
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
        // eslint-disable-next-line max-len
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

When(
    'I enter my name, email address and UK Visa card number',
    async () => {
        donor = await page.populateNameAndEmail();
        await page.populateStripePaymentDetails();
        await page.progressToNextStep(false);
    }
);

When(
    'I enter my name, email address and password',
    async () => {
        donor = await page.populateNameAndEmail();
        donor.password = await DonateSuccessPage.populatePassword();
    }
);

When('I enter the same email and password to log in', async () => {
    if (donor.password === null) {
        throw new Error('Donor password not set');
    }
    await page.inputSelectorValue('>>>#loginEmailAddress', donor.email);
    await page.inputSelectorValue('>>>#loginPassword', donor.password);
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(1500); // Enough time for Friendly Captcha when the form was filled quickly.
});

When('I enter a UK Visa card number', async () => {
    await page.populateStripePaymentDetails();
    await page.progressToNextStep(false);
});

When(
    /I should see my populated first name is "([^"]+)"/,
    async (expectedFirstName) => {
        await checkSelectorValue(firstNameSelector, expectedFirstName);
        // set donor.firstName so the test titled 'my last email
        // should contain the correct name' works correctly
        donor.firstName = expectedFirstName;
    },
);

When(
    /I should see my populated surname is "([^"]+)"/,
    async (expectedSurname) => {
        await checkSelectorValue(lastNameSelector, expectedSurname);
        // set donor.lastName so the test titled 'my last email
        // should contain the correct name' works correctly
        donor.lastName = expectedSurname;
    },
);

When(
    /I should see my populated email is "([^"]+)"/,
    async (expectedEmail) => {
        await checkSelectorValue(emailAddressSelector, expectedEmail);
        donor.email = expectedEmail;
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
        page.jumpBackToFirstStep();
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(500); // Animation seems to need a moment in some browsers?
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

Then('I should be redirected to a mandate detail page showing amount £{int}', async (amount) => {
    await checkUrl('/my-account/regular-giving/'); // ID after this varies.

    const expectedSummaryLine = `Your donation of £${amount} is worth £${amount * 2} for the first 3 months!`;
    await checkSelectorContent('div.donation-summary', expectedSummaryLine);
    // Tricky to be more specific; same reason as DonateSuccessPage.checkBalance.
    await checkSelectorContent('div.receipt', `£${amount}`);
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
    checkVisibleSelectorContent('main', 'Log in');
});

Then(
    'the page should say monthly processing started today and will proceed on the current day-ish each month',
    async () => {
        const today = new Date();
        // Angular default is the US locale date order, and we don't override that, so explicitly ask for en-US
        // which gives e.g. 'Jan 10, 2025'.
        const todayMediumFormatted = (new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })).format(today);
        const dayOfCurrentMonthOr28 = Math.min(28, today.getDate());
        // I expect this will fail in Safari similarly to other table stuff.
        // @todo decide what to do about that.
        await checkSelectorContent(
            'main',
            `Day of month ${dayOfCurrentMonthOr28}`,
        );

        console.log('medium date we want', todayMediumFormatted);

        await checkSelectorContent(
            'main',
            `Active from ${todayMediumFormatted}`,
        );
    }
);

/**
 * @param {number} amount
 */
const checkAmountInEmail = async (amount) => {
    const formattedAmount = amount.toLocaleString('en-GB');

    if (!(await checkAnEmailBodyContainsText(
        `Donation: <strong>£${formattedAmount}.00</strong>`,
        donor.email
    ))) {
        throw new Error(`Donation amount £${formattedAmount} not found in email`);
    }
};

Then(
    'my last email should contain amount £{int}',
    async (amount) => checkAmountInEmail(amount)
);

Then(
    'my last email should contain the correct amounts',
    async () => checkAmountInEmail(donationAmount)
);

Then(
    'my last email should contain the charity\'s custom thank you message',
    async () => {
        const customThanks = process.env.CHARITY_CUSTOM_THANKS;
        if (!customThanks) throw new Error('Custom thanks message not set in environment');

        if (!(await checkAnEmailBodyContainsText(customThanks, donor.email))) {
            throw new Error('Charity thank you message not found in email');
        }
    }
);

Then(
    'my last email should contain the correct name',
    async () => {
        if (!(await checkAnEmailBodyContainsText(
            `Donor: <strong>${donor.firstName} ${donor.lastName}</strong>`,
            donor.email,
        ))) {
            throw new Error(`Donor name ${donor.firstName} ${donor.lastName} not found in email`);
        }
    }
);

Then(
    'my last email should contain a new monthly mandate confirmation showing amount £{int}',
    async (amount) => {
        const formattedAmount = `£${amount.toLocaleString('en-GB')}.00`;
        if (!(await checkAnEmailBodyContainsText(
            `Donation: <strong>${formattedAmount}</strong>`,
            donor.email,
        ))) {
            throw new Error(`Amount ${formattedAmount} not found in email`);
        }
    }
);

When(
    /^I press on the button to set a password$/,
    async () => {
        await DonateSuccessPage.clickOnSetPasswordButton();
    }
);

When(
    /^I enter my new password$/,
    async () => {
        await DonateSuccessPage.populatePassword();
    }
);

When(
    /^I press on the button to create an account$/,
    async () => {
        await DonateSuccessPage.clickOnCreateAccountButton();
    }
);

Then(
    /^the page should update to say I'm registered$/,
    async () => {
        await DonateSuccessPage.checkCopySaysImRegistered();
    }
);

Then(
    /^I should recieve a registration success email with the email I donated with$/,
    async () => {
        checkAnEmailSubjectContainsText('You are registered with Big Give', donor.email);

        // eslint-disable-next-line max-len
        const expectedCopy = `You are now registered for Big Give with the email address: ${donor.email}`;

        if (!(await checkAnEmailBodyContainsText(
            expectedCopy,
            donor.email
        ))) {
            throw new Error(`Registration email with expected copy not found.
            Expected: ${expectedCopy}`);
        }
    }
);
Then(
    'my charity has been charged a vat inclusive fee of £{float}',
    /**
     * @param {number} expectedAmount
     */
    // eslint-disable-next-line no-unused-vars
    async (expectedAmount) => {
        checkStripeCustomerExists(donor.email);

        const thanksPageurl = await browser.getUrl();
        const donationUUId = thanksPageurl.split('/').pop();
        if (!donationUUId) {
            throw new Error(`Couldn't find donation UUID in URL: ${thanksPageurl}`);
        }

        const amountChargedToCharity = await getChargedAmount(donationUUId);
        if (amountChargedToCharity !== expectedAmount) {
            throw new Error(
                `Amount charged to charity not as expected, expected ${expectedAmount}, found ${amountChargedToCharity}`
            );
        } else {
            console.log(`CHECK: Stripe shows amount charged to charity is £${amountChargedToCharity} as expected`);
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
