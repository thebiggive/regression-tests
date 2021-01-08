import {
    BeforeAll, Given, Then, When
} from 'cucumber';
import { checkLatestEmailBodyContainsText } from '../support/mailtrap';
import { randomIntFromInterval } from '../support/util';
import DonateStartPage from '../pages/DonateStartPage';
import EnthuseRegistrationPage,
{
    firstNameInput,
    lastNameInput,
    countryInput,
    addressInput,
    guestEmailInput
} from '../pages/EnthuseRegistrationPage';
import EnthuseConfirmPage from '../pages/EnthuseConfirmPage';
import EnthusePaymentPage from '../pages/EnthusePaymentPage';
import EnthuseAsync from '../pages/EnthuseAsync';
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
    'I enter my name and email address',
    () => {
        page.populateNameAndEmail();
    }
);

When(
    'I enter Stripe payment details',
    () => {
        page.populateStripePaymentDetails();
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
    'I am taken to the Enthuse pages',
    EnthuseRegistrationPage.checkReady,
);

Then(
    'I complete my donation as a guest',
    () => {
        EnthuseRegistrationPage.fillForm();
        EnthuseRegistrationPage.submitForm();
        // checkout confirm step
        EnthuseConfirmPage.checkReady();
        EnthuseConfirmPage.submitForm();
    }
);

Then(
    /^enter my payment information$/,
    () => {
        // checkout payment step
        EnthusePaymentPage.checkReady();
        EnthusePaymentPage.checkout();
        EnthusePaymentPage.setPassword(true); // skip
        DonateSuccessPage.checkReady(); // need to check before webhook call
    }
);

When(
    /^my bank approves the charge and the payment steps took less than 15 minutes$/,
    () => {
        const url = browser.getUrl();

        browser.call(() => {
            EnthuseAsync.triggerWebhook(
                url,
                donationAmount,
                firstNameInput,
                lastNameInput,
                guestEmailInput,
                addressInput,
                countryInput,
            );
        });
    }
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
    () => {
        if (checkLatestEmailBodyContainsText(
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
    () => {
        if (!checkLatestEmailBodyContainsText(process.env.CHARITY_CUSTOM_THANKS)) {
            throw new Error('Charity thank you message not found in email');
        }
    }
);
