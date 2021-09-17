import {
    BeforeAll, Given, Then, When
} from '@cucumber/cucumber';

import PledgeFormPage from '../pages/PledgeFormPage';
import {
    checkLatestEmailBodyContainsText,
    checkLatestEmailSubjectContainsText
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
    () => page.open()
);

Then(
    /^I should see a Communities hero banner saying "([^"]*)"$/,
    (title) => page.checkBannerSays(title)
);

When(
    /^I enter a pledge amount between £([0-9]+) and £([0-9]+)$/,
    (minAmount, maxAmount) => {
        pledgeAmount = randomIntFromInterval(Number(minAmount), Number(maxAmount));
        page.setPledgeAmount(pledgeAmount);
    }
);

When(
    /^I choose to pay my pledge by ([a-zA-Z ]+)$/,
    (method) => page.setPaymentMethod(method)
);

When(
    'I accept the pledge Terms & Conditions',
    () => page.acceptTerms()
);

When(
    'I opt to pledge as an Individual',
    () => page.setIndividualType()
);

When(
    /^I state my pledger relationship as ([a-zA-Z ]+)$/,
    (relationship) => page.setRelationship(relationship)
);

When(
    'I opt to claim Gift Aid',
    () => page.setGiftAidToYes()
);

When(
    'I give a valid pledger title',
    () => page.setPledgerTitle()
);

When(
    'I give a valid pledger first name',
    () => page.setPledgerFirstName()
);

When(
    'I give a valid pledger last name',
    () => page.setPledgerLastName()
);

When(
    'I give a valid pledger email address',
    () => {
        emailAddress = `pledger+${randomIntFromInterval(1, 9999999)}@thebiggivetest.org.uk`;
        page.setPledgerEmail('Email', emailAddress);
    }
);

When(
    'I confirm my pledger email address',
    () => page.setPledgerEmail('Confirm Email', emailAddress)
);

When(
    /^I click "([^"]*)"$/,
    (buttonText) => page.clickButton(buttonText)
);

Then(
    /^I should see a Communities card with heading "([^"]*)"$/,
    (heading) => page.checkForCardWithHeading(heading)
);

Then(
    // eslint-disable-next-line max-len
    'the main card text should start with confirmation of my chosen pledge amount and the correct charity name',
    () => {
        const text = `Thank you for your generous match funding pledge of £${pledgeAmount}.00 `
            + 'to Exempt Stripe Test Charity';
        page.checkForCardWithCopy(text);
    }
);

Then(
    'my last email should contain my pledged amount',
    async () => {
        const expectedBody = 'Thank you for your generous match funding pledge of '
            + `£${pledgeAmount}.00 to `
            + 'Exempt Stripe Test Charity for the campaign: Regression pledge testing campaign';
        if (await checkLatestEmailBodyContainsText(expectedBody)) {
            console.log(`CHECK: Email refers to £${pledgeAmount} pledge and correct campaign`);
        } else {
            throw new Error(`Pledge amount £${pledgeAmount} or details not found in email`);
        }
    }
);

Then(
    /^my last email subject should contain "(.+)"$/,
    async (subjectText) => {
        if (!(await checkLatestEmailSubjectContainsText(subjectText))) {
            throw new Error(`"${subjectText}" not found in email subject`);
        }
    }
);
