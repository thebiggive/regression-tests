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
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminCheckBalancePage from '../pages/AdminCheckBalancePage';
import sendCheckoutWebhook from '../support/checkout/webhook';


// Constants
const randomDonationAmount = randomIntFromInterval(5, 100);

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
        DonatePage.setDonationAmount(randomDonationAmount);
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
    }
);

Then(
    /^enter my payment information$/,
    () => {
        // checkout confirm step
        CheckoutConfirmPage.checkReady();
        CheckoutConfirmPage.submitForm();

        // checkout payment step
        CheckoutPaymentPage.checkReady();
        CheckoutPaymentPage.checkout();
        CheckoutPaymentPage.setPassword(true); // skip
    }
);

When(
    /^my bank approves the charge and the payment steps took less than 15 minutes$/,
    () => {
        const donationID = browser.getUrl()
            .split('/')[4]; // Donation ID
        browser.call(async () => {
            await sendCheckoutWebhook(
                donationID,
                {
                    charityId: process.env.CHECKOUT_CHARITY_ID,
                    projectId: process.env.CHECKOUT_PROJECT_ID,
                    donationAmount: randomDonationAmount,
                    donationMatched: false,
                    giftAid: false,
                    optInTbgEmail: false,
                    firstName: firstNameInput,
                    lastName: lastNameInput,
                    emailAddress: guestEmailInput,
                    billingPostalAddress: addressInput,
                    // using slice to remove string: text
                    countryCode: countryInput.slice(7),
                    status: 'Paid',
                }
            );
        });
    }
);

Then(
    /^I should be redirected to a Thank You confirmation page$/,
    () => {
        CheckoutSuccessPage.checkReady();
    }
);

Then(
    /^I login to my admin page$/,
    () => {
        AdminLoginPage.open();
        AdminLoginPage.checkReady();
        AdminLoginPage.fillForm();
        AdminLoginPage.submitForm();
        AdminCheckBalancePage.checkReady();
    }
);

Then(
    /^I should download the donation csv file$/,
    () => {
        AdminCheckBalancePage.downloadCsvFile();
    }
);

Then(
    /^I should see an initial message saying the donation succeeded$/,
    () => {
        // CheckoutSuccessPage.checkBalance(randomDonationAmount);
    }
);

// When(
//     /^I wait 5 seconds$/,
//     () => {
//         // TODO
//     }
// );

// Then(
//     /^I should see my Charity Checkout transaction ID$/,
//     () => {
//         // TODO
//     }
// );

// Then(
//     /^I should see my matched amount is the same as my donation amount$/,
//     () => {
//         // TODO
//     }
// );

// Then(
//     /^I should see the total value of my donation is double my donation amount, plus any Gift Aid$/,
//     () => {
//         // TODO
//     }
// );
