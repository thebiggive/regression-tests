import {
    BeforeAll,
    Given,
    Then,
    When
} from '@cucumber/cucumber';

import PledgeFormPage from '../pages/PledgeFormPage';
import {
    checkAnEmailBodyContainsText,
    checkAnEmailSubjectContainsText
} from '../support/mailtrap';
import { randomIntFromInterval } from '../support/util';

let emailAddress;
let page;
let pledgeAmount;

// eslint-disable-next-line new-cap
BeforeAll(() => {
    page = new PledgeFormPage(browser);
});

Given(
    "I open the pledge campaign's pledge form",
    async () => page.open()
);

Then(
    /^I should see a Communities hero banner saying "([^"]*)"$/,
    async (title) => page.checkBannerSays(title)
);

When(
    /^I enter a pledge amount between £([0-9]+) and £([0-9]+)$/,
    async (minAmount, maxAmount) => {
        pledgeAmount = randomIntFromInterval(Number(minAmount), Number(maxAmount));
        console.log(`Randomly selected ${pledgeAmount} as between ${minAmount} and ${maxAmount}`);
        await page.setPledgeAmount(pledgeAmount);
    }
);

When(
    /^I choose to pay my pledge by ([a-zA-Z ]+)$/,
    async (method) => page.setPaymentMethod(method)
);

When(
    'I accept the pledge Terms & Conditions',
    async () => page.acceptTerms()
);

When(
    'I opt to pledge as an Individual',
    async () => page.setIndividualType()
);

When(
    /^I state my pledger relationship as ([a-zA-Z ]+)$/,
    async (relationship) => page.setRelationship(relationship)
);

When(
    'I opt to claim Gift Aid',
    async () => page.setGiftAidToYes()
);

When(
    'I give a valid pledger title',
    async () => page.setPledgerTitle()
);

When(
    'I give a valid pledger first name',
    async () => page.setPledgerFirstName()
);

When(
    'I give a valid pledger last name',
    async () => page.setPledgerLastName()
);

When(
    'I give a valid pledger email address',
    async () => {
        emailAddress = `pledger+${randomIntFromInterval(1, 9999999)}@thebiggivetest.org.uk`;
        await page.setPledgerEmail('Email', emailAddress);
    }
);

When(
    'I confirm my pledger email address',
    async () => page.setPledgerEmail('Confirm Email', emailAddress)
);

When(
    /^I click "([^"]*)"$/,
    async (buttonText) => page.clickButton(buttonText)
);

Then(
    /^I should see a Communities card with heading "([^"]*)"$/,
    async (heading) => page.checkForCardWithHeading(heading)
);

Then(
    // eslint-disable-next-line max-len
    'the main card text should start with confirmation of my chosen pledge amount and the correct charity name',
    async () => {
        const text = `Thank you for your generous match funding pledge of £${pledgeAmount}.00 `
            + 'to Exempt Stripe Test Charity';
        await page.checkForCardWithCopy(text);
    }
);

Then(
    'my last email should contain my pledged amount',
    async () => {
        const expectedBody = 'Thank you for your generous match funding pledge of '
            + `£${pledgeAmount}.00 to `
            + 'Exempt Stripe Test Charity for the campaign: Pledge test campaign';
        if (await checkAnEmailBodyContainsText(expectedBody, emailAddress)) {
            console.log(`CHECK: Email refers to £${pledgeAmount} pledge and correct campaign`);
        } else {
            throw new Error(`Pledge amount £${pledgeAmount} or details not found in email`);
        }
    }
);

Then(
    /^my last email subject should contain "(.+)"$/,
    async (subjectText) => {
        checkAnEmailSubjectContainsText(subjectText, emailAddress);
    }
);
