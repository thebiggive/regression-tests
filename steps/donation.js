import {
    BeforeAll, Given, Then, When
} from 'cucumber';
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
    (psp) => {
        page.open(psp);
        page.checkReady();
    }
);

When(
    'I close the cookie notice if shown',
    closeCookieNotice,
);

When(
    'I enter an amount between £5 and £25,000',
    () => {
        page.setDonationAmount(donationAmount);
        page.progressToNextStep(true);
    }
);

When(
    'I choose a preference for Gift Aid',
    () => {
        page.setGiftAidChoice();
        page.progressToNextStep(false);
    }
);

When(
    'I enter my name, email address and Stripe payment details',
    () => {
        page.populateNameAndEmail();
        page.populateStripePaymentDetails();
        page.progressToNextStep(false);
    }
);

When(
    'I choose a preference for charity and TBG communications',
    () => {
        page.setCommsPreferences();
        page.progressToNextStep(false);
    }
);

When(
    'I press Donate',
    () => page.submitForm(),
);

Then(
    /^I should be redirected to a Thank You confirmation page with the correct amount$/,
    () => {
        DonateSuccessPage.checkReady();
        DonateSuccessPage.checkBalance(donationAmount);
    }
);

When(
    /^I login to my charity portal page$/,
    () => {
        CharityPortalLoginPage.open();
        CharityPortalLoginPage.checkReady();
        CharityPortalLoginPage.fillForm();
        CharityPortalLoginPage.submitForm();
        CharityPortalCheckBalancePage.checkReady();
    }
);

Then(
    /^I should download the donation csv file$/,
    () => {
        CharityPortalCheckBalancePage.downloadCsvFile();
        CharityPortalCheckBalancePage.parseCsvFile(lastNameInput);
    }
);

When(
    'I wait a few seconds for email processing',
    // 30s to allow SF + Mailtrap time to process everything
    async () => browser.pause(30000)
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
