import {
    BeforeAll, Given, Then, When
} from '@cucumber/cucumber';

import { checkAnEmailBodyContainsText, checkAnEmailSubjectContainsText } from '../support/mailtrap';
import { randomIntFromInterval } from '../support/util';
import DonateStartPage, { emailAddressSelector, firstNameSelector, lastNameSelector } from '../pages/DonateStartPage';
import DonateSuccessPage from '../pages/DonateSuccessPage';
import { checkSelectorContent, checkSelectorValue, checkVisibleSelectorContent } from '../support/check';

const stripeUseCreditsMessageSelector = '#useCreditsMessage';

/**
 * @type {number}
 */
let donationAmount;

/**
 * @typedef {{firstName: string, lastName: string, email: string}} Donor
   @type {Donor}
 * */
let donor = {
    firstName: 'default-first-name',
    lastName: 'default-last-name',
    email: 'default-email',
};

/** @type DonateStartPage * */
let page;
// eslint-disable-next-line new-cap
BeforeAll(async () => {
    page = new DonateStartPage(browser);
});

// Steps
Given(
    /^that I am on my chosen ([a-zA-Z]+)-enabled charity's Donate page$/,
    // eslint-disable-next-line no-unused-vars
    async (psp) => {
        page.nextStepIndex = 0;
        await page.open();
        await page.checkReady();
    }
);

When("I click the popup's login button", async () => {
    // We use an ID here as we can't combine deep and text selectors.
    await page.clickActiveSelector('>>>#login-modal-submit');
});

When(/I click the "([^"]+)" button/, async (buttonText) => {
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
        `${expectedCreditMessage}`,
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
    'my charity charity has been charged a vat inclusive fee of £{float}',
    /**
     * @param {number} amount
     */
    // eslint-disable-next-line no-unused-vars
    async (amount) => {
    // @todo MAT-384 - connect to stripe and check what we've charged as the fee for this donation.
    // We may be able to do this by reading the stripe transaction ID from the thank you page or email, or they may
    // be another way to find it.
    }
);
