import { Given, When, Then } from 'cucumber';
import {
    goToUrl,
    clickSelector,
    inputSelectorValue,
    checkTitle,
    setSelectOption,
    sendKeys,
    checkIfElementExists,
    wait,
    randomIntFromInterval
} from '../support/common';

// Constants
const donatePage = 'donate/a051w000001OtHOAA0';
// const cardNumber = '4111110000000211';

// Steps
Given(
    /^that I am on my chosen Donate page$/,
    () => {
        goToUrl(donatePage);
        checkTitle('Donate to ChoraChori (regtest1)');
        checkIfElementExists('h1*=Donating to ChoraChori (regtest1)!');
    }
);

When(
    /^I enter an amount between £5 and £25,000$/,
    () => {
        inputSelectorValue('#donationAmount', randomIntFromInterval(5, 100));
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
    /^I am taken to Charity Checkout pages, where I can complete my other donation information$/,
    () => {
        checkTitle('You are donating to ChoraChori', 15);
        inputSelectorValue('#email-field', 'regression-test@example.org');
        clickSelector('button=Next');
        wait(5);
        clickSelector('a*=Proceed as guest');
        setSelectOption('#country-select', 'string:GB');
        setSelectOption('#title-select', 'string:Dr');
        inputSelectorValue('#first-name', 'Regression');
        inputSelectorValue("input[name='last-name']", 'Test');
        inputSelectorValue('#paf_addr', 'WC2B 5LX');
        wait();
        sendKeys('\ue015'); // ARROW_DOWN
        sendKeys('\uE007'); // press enter to select address
        clickSelector('.agree-box');
        clickSelector('.js-next-button');
        // checkSelectorContent(
        //     'li*=Please take a payment of',
        //     'Please take a payment of £50 from my account for ChoraChori',
        //     7
        //     );
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
        // TODO
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
