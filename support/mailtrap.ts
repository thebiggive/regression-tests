import * as jsdom from "jsdom";
// eslint-disable-next-line import/no-duplicates
import axios from 'axios';
// eslint-disable-next-line import/no-duplicates
import ResponseType from "axios";

export type emailMessage = {subject: string, html_path: string}

const { JSDOM } = jsdom;

if (!('create' in axios && typeof axios.create === 'function')) {
    // workaround for TS error;
    throw new Error('Missing axios create function');
}

const mailtrapClient = axios.create({
    baseURL: 'https://mailtrap.io',
    headers: {
        'Api-Token': process.env.MAILTRAP_API_TOKEN,
    },
});

type ResponseType = AxiosRequestConfig['responseType'];

/**
 * Makes an authenticated GET call to Mailtrap.io's API.
 *
 * @param path         Request path
 * @param responseType  Deserialised response data
 * @returns Data from Mailtrap API
 */
async function mailtrapGet(path: string, responseType: ResponseType): Promise<unknown> {
    const response = await mailtrapClient.get(path, { responseType });
    return response.data;
}

/**
 * Get the latest Mailtrap inbox message, if any.
 *
 * @param {string} toEmailAddress Only find emails addressed to this account
 * @returns {Promise<Array<emailMessage>>} Up to {{count}} messages, if available.
 */
async function getLatestMessages(toEmailAddress: string): Promise<emailMessage[]> {
    if (typeof toEmailAddress !== 'string') {
        throw new Error(`Expected toEmailAddress to be string, was ${typeof toEmailAddress}: ${toEmailAddress}`);
    }

    const params = new URLSearchParams({ search: toEmailAddress });
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?${params.toString()}`;
    const messages = (await mailtrapGet(path, 'json')) as emailMessage[];
    console.log(`got ${messages.length} message(s) from mailtrap at path ${path}`);

    if (messages.length === 0) {
        return [];
    }

    const count = 15;
    return messages.slice(0, count); // Latest emails.
}

async function fetchEmailBodyHtml(message: emailMessage): Promise<string> {
    return await mailtrapGet(message.html_path, 'document') as string;
}

/**
 * Checks whether expected text was in a recent email HTML body.
 *
 * Be sure to `await` any results that should impact test pass/fail status!
 *
 * @param searchText   Expected text to find anywhere in HTML
 * @param toEmailAddress Only find emails addressed to this account
 *              (or an account that starts with this)
 * @returns {Promise<boolean>}       Whether the expected text was found.
 */
export async function checkAnEmailBodyContainsText(searchText: string, toEmailAddress: string) {
    const messages = await getLatestMessages(toEmailAddress);
    if (messages.length === 0) {
        return false;
    }

    for (let ii = 0; ii < messages.length; ii += 1) {
        // Seems like we need await with the current approach to get the content. A refactor
        // where all bodies are got in one go would be slightly better, but is not a big
        // optimisation. For now, let's skip the eslint check for this line.

        // eslint-disable-next-line no-await-in-loop
        const body = await fetchEmailBodyHtml(messages[ii]);
        if (body.includes(searchText)) {
            return true;
        }
    }

    return false;
}

/**
 * Checks one of the latest emails' subject line contains the expected text.
 *
 * Throws if the subject was not found.
 *
 * @param searchText   Text to expect in latest subject line.
 * @param toEmailAddress Only find emails addressed to this account
 * @returns Promise that resolves with first match when check is done.
 */
export async function checkAnEmailSubjectContainsText(searchText: string, toEmailAddress: string): Promise<emailMessage> {
    const messages = await getLatestMessages(toEmailAddress);
    if (messages.length === 0) {
        throw new Error('No email messages found');
    }

    for (let ii = 0; ii < messages.length; ii += 1) {
        if (messages[ii].subject.includes(searchText)) {
            return messages[ii];
        }
    }

    const joinedSubjects = messages.map((m) => m.subject).join(', ');

    throw new Error(`"${searchText}" not found in email subjects: "${joinedSubjects}"`);
}


export async function getVerifyCode(forEmailAddress: string): Promise<string> {
    const message = await checkAnEmailSubjectContainsText('is your Big Give verification code', forEmailAddress);
    return message.subject.replace(/^.+([0-9]{6}) is your Big Give verification code/, '$1');
}

export async function findAccountSetupLinkInRecentEmail(forEmailAddress: string) {
    const message = await checkAnEmailSubjectContainsText(
        'Thanks for your donation',
        forEmailAddress
    );

    const html = await fetchEmailBodyHtml(message);

    const element = new JSDOM(html).window.document.getElementById('create-account');
    if (element === null) {
        return undefined;
    }

    const href = element.getAttribute('href');
    if (href === null) {
        return undefined;
    }

    return new URL(href);
}
