import { Given, When, Then } from 'cucumber';
import {
    goToUrl,
    clickSelector,
    inputSelectorValue,
    checkTitle,
    setSelectOption,
    sendKeys,
    checkIfElementExists,
    wait
} from '../support/common';

// Constants
const donatePage = 'donate/a051w000001OtHOAA0';
// const cardNumber = '4111110000000211';

// Steps
Given(
    /^that I am on my chosen Donate page$/,
    () => {
        goToUrl(donatePage);
    }
);

When(
    /^I enter an amount between £5 and £25,000$/,
    () => {
        const randomNum = Math.floor(Math.random() * 100) + 5;
        inputSelectorValue('#donationAmount', randomNum);
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
        if ($('=Match funds not available').isExisting()) {
            if (checkIfElementExists('button*=Proceed anyway', 5)) {
                clickSelector('button*=Proceed anyway');
            }
        }
    }
);

Then(
    /^I am taken to Charity Checkout pages, where I can complete my other donation information$/,
    () => {
        checkTitle('You are donating to ChoraChori', 7);
        inputSelectorValue('#email-field', 'regression-test@example.org');
        clickSelector('button=Next');
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
