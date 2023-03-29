import {
    BeforeAll,
    Given,
    Then,
    When
} from '@cucumber/cucumber';

import { checkAnEmailBodyContainsText, checkAnEmailSubjectContainsText } from '../support/mailtrap';
import { closeCookieNotice, randomIntFromInterval } from '../support/util';
import DonateStartPage from '../pages/DonateStartPage';
import DonateSuccessPage from '../pages/DonateSuccessPage';

/**
 * Note: donationAmount is changable in the `restart-donation` test, whereby the bot changes the
 * donation amount after cancelling the first. Hence, it's not a constant variable.
 * See `When('I re-enter an amount between £5 and £25,000', ...)` method.
 * See REG-21
 */
let donationAmount = randomIntFromInterval(5, 100);
let donor = {};
let page;
// eslint-disable-next-line new-cap
BeforeAll(() => {
    page = new DonateStartPage(browser);
});

// Steps
Given(
    /^that I am on my chosen ([a-zA-Z]+)-enabled charity's Donate page$/,
    async (psp) => {
        await page.open(psp);
        await page.checkReady();
    }
);

When(
    'I close the cookie notice if shown',
    closeCookieNotice,
);

When("I click the popup's login button", async () => {
    // We use an ID here as we can't combine deep and text selectors.
    await page.clickActiveSelector('>>>#login-modal-submit');
});

When(/I click the "([^"]+)" button/, async (buttonText) => {
    await page.clickActiveSelector(`button*=${buttonText}`);
});

/**
 * Currently unused because we had trouble targeting inputs in the target DOM
 * correctly. For now, we work around this using `keys()` inside the login modal.
 *
 * See next fn for that implemenation.
 *
 * {@link https://github.com/webdriverio/webdriverio/issues/4509
 */
When(
    /I enter the ID account test ([a-z\s]+) for "[^"]+"/,
    async (dataPoint) => {
        let elementId;
        let value;
        switch (dataPoint) {
            case 'email address':
                elementId = 'loginEmailAddress';
                value = process.env.DONOR_ID_REGISTERED_EMAIL;
                break;
            case 'password':
                elementId = 'loginPassword';
                value = process.env.DONOR_ID_REGISTERED_PASSWORD;
                break;
            default:
                throw new Error('Unknown value');
        }

        await page.inputSelectorValue(`#${elementId}`, value);
    },
);

When('I enter the ID account test email and password', async () => {
    await browser.keys(['Tab', process.env.DONOR_ID_REGISTERED_EMAIL]);
    await browser.keys(['Tab', process.env.DONOR_ID_REGISTERED_PASSWORD]);
});

When('I enter the ID credit-funded account test email and password', async () => {
    await browser.keys(['Tab', process.env.CREDIT_EMAIL]);
    await browser.keys(['Tab', process.env.CREDIT_PASSWORD]);
});

When(
    /I should see "([^"]+)" in the ID info box/,
    async (expectedText) => page.checkIdInfo(expectedText),
);

When(
    'I enter an amount between £5 and £25,000',
    async () => {
        await page.setDonationAmount(donationAmount);
        await page.progressToNextStep(true);
    }
);

When(
    'I re-enter an amount between £5 and £25,000',
    async () => {
        // Update donation amount by -1, relative to its itinial value.
        // Re-store new value in same variable so that the following check passes later:
        // `DonateSuccessPage.checkBalance(donationAmount);`
        donationAmount -= 1;
        await page.setDonationAmount(donationAmount);
        await page.progressToNextStep(true);

        // The page will likely jump over the Gift Aid step, see this thread to understand why:
        // eslint-disable-next-line max-len
        // https://thebiggive.slack.com/archives/C04BETLU4UC/p1670948304352859?thread_ts=1670945073.540179&cid=C04BETLU4UC
        // See ticket REG-21
        // Wait 20 seconds for donation setup & MatchBot & identity & SF callouts
        await browser.pause(20000);

        // Explicitly call the Gift Aid step, in case the browser skipped it.
        await page.clickOnGiftAidTab();
    }
);

When(
    'I choose a preference for Gift Aid',
    async () => {
        await page.setGiftAidChoice();
        await page.progressToNextStep(true);
    }
);

When(
    'I enter my name, email address and Stripe payment details',
    async () => {
        donor = await page.populateNameAndEmail();
        await page.populateStripePaymentDetails();
        await page.progressToNextStep(false);
    }
);

When(
    /I should see my populated first name is "([^"]+)"/,
    async (expectedFirstName) => {
        page.checkDonorFirstName(expectedFirstName);
        // set donor.firstName so the test titled 'my last email
        // should contain the correct name' works correctly
        donor.firstName = expectedFirstName;
    },
);

When(
    /I should see my populated surname is "([^"]+)"/,
    async (expectedSurname) => {
        page.checkDonorSurname(expectedSurname);
        // set donor.lastName so the test titled 'my last email
        // should contain the correct name' works correctly
        donor.lastName = expectedSurname;
    },
);

When(
    /I should see my populated email is "([^"]+)"/,
    async (expectedEmail) => {
        page.checkDonorEmail(expectedEmail);
        donor.email = expectedEmail;
    },
);

When(
    /I should see "([^"]+)" instead of asking for my bank details./,
    async (expectedCreditMessage) => page.checkCreditMessageDisplayed(expectedCreditMessage),
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
    async () => page.jumpBackToFirstStep(),
);

When(
    'I press Donate',
    async () => page.submitForm(),
);

Then(
    /^I should be redirected to a Thank You confirmation page with the correct amount$/,
    async () => {
        await DonateSuccessPage.checkReady();
        await DonateSuccessPage.checkBalance(donationAmount);
    }
);

When(
    'I wait a few seconds',
    // 45s to allow SF + Mailtrap time to process everything
    async () => browser.pause(45 * 1000)
);

Then(
    'my last email should contain the correct amounts',
    async () => {
        if (!(await checkAnEmailBodyContainsText(
            `Donation: <strong>£${donationAmount}.00</strong>`,
            donor.email
        ))) {
            throw new Error(`Donation amount £${donationAmount} not found in email`);
        }
    }
);

Then(
    'my last email should contain the charity\'s custom thank you message',
    async () => {
        if (!(await checkAnEmailBodyContainsText(process.env.CHARITY_CUSTOM_THANKS, donor.email))) {
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
