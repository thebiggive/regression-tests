import { Given, When, Then } from 'cucumber';
import {
    randomIntFromInterval,
    wait
} from '../support/util';
import {
    checkTitle,
    checkSelectorContent,
    checkUrl
} from '../support/check';
import {
    clickSelector,
    setSelectOption,
    inputSelectorValue
} from '../support/action';
import DonatePage from '../pageobjects/donate.page';
import checkoutRegistration from '../pageobjects/checkoutRegistration.page';

// Constants
const randomDonationAmount = randomIntFromInterval(5, 100);
const cardNumber = '4111110000000211';
const cardExpireYear = '2023';
const cardExpireMonth = '10';
const cardCvc = '456';

// Steps
Given(
    /^that I am on my chosen Donate page$/,
    () => {
        DonatePage.open();
        DonatePage.checkReady();
        DonatePage.init();
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
        checkoutRegistration.assertCheckOutRegisterPage();
    }
);

Then(
    /^I complete my donation as a guest$/,
    () => {
        checkoutRegistration.register();
    }
);

Then(
    /^enter my payment information$/,
    () => {
        wait();
        checkSelectorContent(
            'main h2',
            'Please check the details of your donation'
        );
        wait(1);
        clickSelector('a.btn=Next');
        wait(3);
        checkSelectorContent(
            'main #js-payment-form h2',
            'Please enter your payment details'
        );
        inputSelectorValue('input#stPan', cardNumber);
        setSelectOption('#st-month', cardExpireMonth);
        setSelectOption('#st-year', cardExpireYear);
        inputSelectorValue('input#stSc', cardCvc);
        clickSelector('#st-submit-btn');
    }
);

When(
    /^my bank approves the charge and the payment steps took less than 15 minutes$/,
    () => {
        console.log('ACTION: Implicit approval payments ');
    }
);

Then(
    /^I should be redirected to a Thank You confirmation page$/,
    () => {
        wait();
        checkUrl('thanks', 15);
        checkTitle('The Big Give', 3);
    }
);

Then(
    /^I should see an initial message saying the donation succeeded$/,
    () => {
        checkSelectorContent('h2', 'Thank you!');
        checkSelectorContent(
            '.ng-star-inserted p', 'Your donation status: Reserved'
        );
        checkSelectorContent(
            '.ng-star-inserted p:nth-child(2)',
            `You donated £${randomDonationAmount}`
        );
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
