import { Given, When, Then } from 'cucumber';
import {
    randomIntFromInterval
} from '../support/util';
import DonatePage from '../pages/DonatePage';
import CheckoutRegistrationPage,
{
    firstNameInput,
    lastNameInput,
    countryInput,
    addressInput,
    guestEmailInput
} from '../pages/CheckoutRegistrationPage';
import CheckoutConfirmPage from '../pages/CheckoutConfirmPage';
import CheckoutPaymentPage from '../pages/CheckoutPaymentPage';
import CheckoutWebhookPage from '../pages/CheckoutWebhookPage';
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage';
import CharityPortalLoginPage from '../pages/CharityPortalLoginPage';
import CharityPortalCheckBalancePage
    from '../pages/CharityPortalCheckBalancePage';


// Constants
const donationAmount = randomIntFromInterval(5, 100);

// Steps
Given(
    /^that I am on my chosen Donate page$/,
    () => {
        DonatePage.open();
        DonatePage.checkReady();
    }
);

When(
    /^I enter an amount between £5 and £25,000$/,
    () => {
        DonatePage.setDonationAmount(donationAmount);
    }
);

Then(
    /^I choose a preference for Gift Aid, charity comms and TBG comms$/,
    () => {
        DonatePage.choosePreference();
    }
);

Then(
    /^I press Donate$/,
    () => {
        DonatePage.submitForm();
    }
);

Then(
    /^I am taken to Charity Checkout pages$/,
    () => {
        CheckoutRegistrationPage.checkReady();
    }
);

Then(
    /^I complete my donation as a guest$/,
    () => {
        CheckoutRegistrationPage.fillForm();
        CheckoutRegistrationPage.submitForm();
        // checkout confirm step
        CheckoutConfirmPage.checkReady();
        CheckoutConfirmPage.submitForm();
    }
);

Then(
    /^enter my payment information$/,
    () => {
        // checkout payment step
        CheckoutPaymentPage.checkReady();
        CheckoutPaymentPage.checkout();
        CheckoutPaymentPage.setPassword(true); // skip
        CheckoutSuccessPage.checkReady(); // need to check before webhook call
    }
);

When(
    /^my bank approves the charge and the payment steps took less than 15 minutes$/,
    () => {
        const url = browser.getUrl();

        browser.call(() => {
            CheckoutWebhookPage.triggerWebhook(
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
    /^I should be redirected to a Thank You confirmation page$/,
    () => {
        CheckoutSuccessPage.checkReady();
        CheckoutSuccessPage.checkBalance(donationAmount);
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
