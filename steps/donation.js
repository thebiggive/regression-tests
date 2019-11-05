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