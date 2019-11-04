import { Given, When, Then } from 'cucumber';
import {
    goToUrl, clickSelector, inputSelectorValue, sendKeys, checkUrl, checkTitle,
    checkSelectorContent
} from '../support/common';

Given(
    /^I am on the Google homepage$/,
    () => {
        goToUrl('https://www.google.com/');
    }
);

When(
    /^I search for "([^"]*)?"$/,
    (value) => {
        inputSelectorValue('#searchform input[type=text]', value);
        sendKeys('\uE007'); // press enter to submit search
    }
);

When(
    /^I click on the first search result$/,
    () => {
        const resultSelector = '#search a:first-of-type';
        checkSelectorContent(resultSelector, 'Demo - Wikipedia');
        clickSelector(resultSelector);
    }
);

Then(
    /^the URL is "([^"]*)?"$/,
    (expectedUrl) => {
        checkUrl(expectedUrl);
    }
);

Then(
    /^the page title is "([^"]*)?"$/,
    (expectedTitle) => {
        checkTitle(expectedTitle);
    }
);

Then(
    /^the heading is "([^"]*)?"$/,
    (expectedText) => {
        checkSelectorContent('h1#firstHeading', expectedText);
    }
);
