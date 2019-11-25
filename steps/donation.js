import { Given, When, Then } from 'cucumber';
import {
    randomIntFromInterval, wait
} from '../support/util';
import DonatePage from '../pages/DonatePage';
import CheckoutRegistrationPage from '../pages/CheckoutRegistrationPage';
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
        console.log(`DOnation ID: ${donationID}`);
        // TODO: Provide donation id & build donation data
        browser.call(async () => {
            await sendCheckoutWebhook(
                donationID,
                {
                    charityId: process.env.CHECKOUT_CHARITY_ID,
                    donationAmount: randomDonationAmount,
                    giftAid: true,
                    donationMatched: true,
                    firstName: 'Ezra',
                    lastName: 'Furman',
                    emailAddress: 'ezra@example.com',
                    billingPostalAddress: '1 Main Street, London, N1 1AA',
                    countryCode: 'GB',
                    optInTbgEmail: true,
                    projectId: process.env.CHECKOUT_PROJECT_ID,
                    amountMatchedByChampionFunds: 40,
                    amountMatchedByPledges: 60,
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
    /^I should see my admin page balance affected$/,
    () => {
        AdminLoginPage.open();
        AdminLoginPage.checkReady();
        AdminLoginPage.fillForm();
        AdminLoginPage.submitForm();
        AdminCheckBalancePage.checkReady();
        AdminCheckBalancePage.checkBalance();
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
