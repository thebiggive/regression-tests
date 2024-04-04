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

When(/^I view the homepage$/, async () => {
    const client = axios.create({
        baseURL: 'https://mailtrap.io',
        headers: {
            'Api-Token': process.env.MAILTRAP_API_TOKEN,
        },
    });
    url = process.env.BASE_URL;
    pageContent = (await client.get(url)).data;
});

Then(/^I should see in the source "([^"]*)"$/, (phrase) => {
    if (!pageContent.includes(phrase)) {
        throw new Error(`Expected "${phrase}" not found in source code at ${url}`);
    }
});
