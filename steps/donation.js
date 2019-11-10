import { Given, When, Then } from 'cucumber';
import {
    goToUrl,
    randomIntFromInterval
} from '../support/util';
import {
    checkTitle,
    checkUrlMatch,
    checkIfElementExists,
    checkSelectorContent,
    checkAngularV5Ready
} from '../support/check';
import {
    clickSelector,
    setSelectOption,
    inputSelectorValue,
    sendKeys
} from '../support/action';

// Constants
const randomDonationAmount = randomIntFromInterval(5, 100);
const donatePage = 'donate/a051w000001OtHOAA0';
const guestEmail = 'regression-test@example.org';
const cardNumber = '4111110000000211';
const cardExpireYear = '2023';
const cardExpireMonth = '10';
const cardCvc = '456';

// Steps
Given(
    /^that I am on my chosen Donate page$/,
    () => {
        goToUrl(donatePage);
        checkAngularV5Ready('app-root');
        checkTitle('Donate to ChoraChori (regtest1)');
        checkSelectorContent('form h1', 'Donating to ChoraChori (regtest1)!');
        // We need to interact with the form,
        // otherwise radio buttons aren't selected reliably on first click
        clickSelector('button=Donate Now');
    }
);

When(
    /^I enter an amount between £5 and £25,000$/,
    () => {
        inputSelectorValue('#donationAmount', randomDonationAmount);
    }
);

Then(
    /^I choose a preference for Gift Aid, charity comms and TBG comms$/,
    () => {
        // Claim Gift Aid? select NO
        clickSelector('#mat-radio-3');

        // Receive email from the charity? select NO
        clickSelector('#mat-radio-6');

        // Receive email from the Big Give? select NO
        clickSelector('#mat-radio-9');
    }
);

Then(
    /^I press Donate$/,
    () => {
        clickSelector('button=Donate Now');
        if ($('=Match funds not available').isExisting()
            && checkIfElementExists('button*=Proceed anyway')) {
            clickSelector('button*=Proceed anyway');
        }
    }
);

Then(
    /^I am taken to Charity Checkout pages$/,
    () => {
        checkUrlMatch(
            'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/checkout'
        );
        checkTitle('You are donating to ChoraChori');
        checkSelectorContent('#main h1', 'You are donating to ChoraChori');
    }
);

Then(
    /^I complete my donation as a guest$/,
    () => {
        inputSelectorValue('#email-field', guestEmail);
        clickSelector('button=Next');
        checkSelectorContent(
            'span.ut-email-error',
            'This email is already in use. Please Sign In to your '
            + 'existing account or use another email address.'
        );
        clickSelector('a*=Proceed as guest');

        setSelectOption('#country-select', 'string:GB');
        setSelectOption('#title-select', 'string:Dr');
        inputSelectorValue('#first-name', 'Regression');
        inputSelectorValue("input[name='last-name']", 'Test');
        inputSelectorValue('#paf_addr', 'WC2B 5LX');
        checkIfElementExists(
            'li[title*="WC2B 5LX, Reed Online,"'
        );
        sendKeys('\ue015'); // ARROW_DOWN
        sendKeys('\uE007'); // press enter to select address
        clickSelector('label[for=agree-check]', { x: 50 }); // click left side
        clickSelector('.js-next-button');
    }
);

Then(
    /^enter my payment information$/,
    () => {
        checkSelectorContent(
            'main h2',
            'Please check the details of your donation'
        );
        clickSelector('a.btn');

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
        // TODO
    }
);

Then(
    /^I should be redirected to a Thank You confirmation page$/,
    () => {
        // checkUrl('thanks');
        // checkTitle('The Big Give');
        // checkSelectorContent('h2', 'Thank you!');
        // checkSelectorContent(
        //  '.ng-star-inserted p', 'Your donation status: Reserved'
        // );
        // checkSelectorContent(
        //  '.ng-star-inserted p', `You donated £${randomDonationAmount}`
        // );
    }
);

Then(
    /^I should see an initial message saying the donation succeeded$/,
    () => {
        // TODO
    }
);

When(
    /^I wait 5 seconds$/,
    () => {
        // TODO
    }
);

Then(
    /^I should see my Charity Checkout transaction ID$/,
    () => {
        // TODO
    }
);

Then(
    /^I should see my matched amount is the same as my donation amount$/,
    () => {
        // TODO
    }
);

Then(
    /^I should see the total value of my donation is double my donation amount, plus any Gift Aid$/,
    () => {
        // TODO
    }
);
