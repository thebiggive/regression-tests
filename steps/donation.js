import {
    BeforeAll,
    Given,
    Then,
    When
} from '@cucumber/cucumber';

import { checkAnEmailBodyContainsText } from '../support/mailtrap';
import { closeCookieNotice, randomIntFromInterval } from '../support/util';
import DonateStartPage from '../pages/DonateStartPage';
import DonateSuccessPage from '../pages/DonateSuccessPage';
import CharityPortalLoginPage from '../pages/CharityPortalLoginPage';
import CharityPortalCheckBalancePage
    from '../pages/CharityPortalCheckBalancePage';

// Constants
const donationAmount = randomIntFromInterval(5, 100);

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
    'I choose a preference for Gift Aid',
    async () => {
        await page.setGiftAidChoice();
        await page.progressToNextStep(true);
    }
);

When(
    'I enter my name, email address and Stripe payment details',
    async () => {
        await page.populateNameAndEmail();
        await page.populateStripePaymentDetails();
        await page.progressToNextStep(false);
    }
);

When(
    'I should see my name and email address already populated',
    async () => page.checkExistingNameAndEmail(),
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
    /^I login to my charity portal page$/,
    async () => {
        await CharityPortalLoginPage.open();
        await CharityPortalLoginPage.checkReady();
        await CharityPortalLoginPage.fillForm();
        await CharityPortalLoginPage.submitForm();
        await CharityPortalCheckBalancePage.checkReady();
    }
);

When(
    'I wait hours to inspect browser manually',
    // 45s to allow SF + Mailtrap time to process everything
    async () => browser.pause(2 * 60 * 60 * 1000)
);

When(
    'I wait a few seconds for email processing',
    // 45s to allow SF + Mailtrap time to process everything
    async () => browser.pause(45000)
);

Then(
    'my last email should contain the correct amounts',
    async () => {
        if (await checkAnEmailBodyContainsText(
            `Donation: <strong>£${donationAmount}.00</strong>`,
        )) {
            console.log(`CHECK: Email refers to donation amount £${donationAmount}`);
        } else {
            throw new Error(`Donation amount £${donationAmount} not found in email`);
        }
    }
);

Then(
    'my last email should contain the charity\'s custom thank you message',
    async () => {
        if (!(await checkAnEmailBodyContainsText(process.env.CHARITY_CUSTOM_THANKS))) {
            throw new Error('Charity thank you message not found in email');
        }
    }
);
When(/^I press Set a password$/,
    async () => {
        browser.pause(5 * 1000);
        const elementReference = browser.findElement(
            'xpath',
            "//*[contains(text(), 'Set a password')]"
        );
        console.log({ elementReference });
        elementReference.click();
    });
