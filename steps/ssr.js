import {
    Given, When, Then
} from '@cucumber/cucumber';
import axios from 'axios';

/** @type {string} */
let pageContent;

/** @type {string} */
let url;

Given(/^I am loading the site without Javascript$/, async () => {
    // no-op
});

When(/^I view the homepage$/, { timeout: 1000 }, async () => {
    const client = axios.create();
    const baseurl = process.env.BASE_URL;
    if (!baseurl) throw new Error('BASE_URL not defined in enviornment');
    url = baseurl;

    pageContent = (await client.get(url)).data;
});

Then(/^I should see in the source "([^"]*)"$/, (phrase) => {
    if (!pageContent.includes(phrase)) {
        throw new Error(`Expected "${phrase}" not found in source code at ${url}`);
    }
});
