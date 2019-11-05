import { Given, When, Then } from 'cucumber';
import {
    goToUrl, clickSelector, inputSelectorValue, sendKeys, checkUrl, checkTitle,
    checkSelectorContent
} from '../support/common';

Given(
    /^that I am on my chosen Donate page$/,
    () => {
        goToUrl('donate/a051r00001NogBOAAZ');
    }
);

When(
    /^I enter an amount between £5 and £25,000$/,
    (firstAmount, secondAmount) => {
        // TODO
    }
)

Then(
    /^I choose a preference for Gift Aid, charity comms and TBG comms$/,
    () => {
        // TODO
    }
)

Then(
    /^I press Donate$/,
    () => {
        // TODO
    }
)

Then(
    /^Then I am taken to Charity Checkout pages, where I can complete my other donation information$/,
    () => {
        // TODO
    }
)

When(
    /^my bank approves the charge and the payment steps took less than 15 minutes$/,
    () => {
        // TODO
    }
)

Then(
    /^I should be redirected to a Thank You confirmation page$/,
    () => {
        // TODO
    }
)