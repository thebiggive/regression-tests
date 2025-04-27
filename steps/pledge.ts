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
import { CHARITY_NAME } from '../support/constants';

let emailAddress: string;

let page: PledgeFormPage;

/** @type {any} (looks like we have some inconsistency already between whether this is string or number) */
let pledgeAmount: any;

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
    'the main card text should contain my chosen pledge amount and the correct charity name',
    async () => {
        // Spacing in string summary varies by browser, so we look for 3 key parts separately for now.
        await page.checkForCardWithCopy('Thank you for your generous match funding');
        await page.checkForCardWithCopy(`£${pledgeAmount}.00`);
        await page.checkForCardWithCopy(CHARITY_NAME);
    }
);

Then(
    'my last email should contain my pledged amount',
    async () => {
        const expectedBody = 'Thank you for your generous match funding pledge of '
            + `£${pledgeAmount}.00 to `
            + `${CHARITY_NAME} for the campaign: Pledge test campaign`;
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
