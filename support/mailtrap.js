/**
 * @typedef {{subject: string, html_path: string}} emailMessage
 */
const axios = require('axios');

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

/**
 * Makes an authenticated GET call to Mailtrap.io's API.
 *
 * @param {string} path         Request path
 * @param {string} responseType  Deserialised response data
 * @returns {Promise<unknown>} Data from Mailtrap API
 */
async function mailtrapGet(path, responseType) {
    const response = await mailtrapClient.get(path, { responseType });
    return response.data;
}

/**
 * Get the latest Mailtrap inbox message, if any.
 *
 * @param {string} toEmailAddress Only find emails addressed to this account
 * @returns {Promise<Array<emailMessage>>} Up to {{count}} messages, if available.
 */
async function getLatestMessages(toEmailAddress) {
    if (typeof toEmailAddress !== 'string') {
        throw new Error(`Expected toEmailAddress to be string, was ${typeof toEmailAddress}: ${toEmailAddress}`);
    }

    const params = new URLSearchParams({ search: toEmailAddress });
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?${params.toString()}`;
    const messages = /** @type {Array<emailMessage>} */ (await mailtrapGet(path, 'json'));
    console.log(`got ${messages.length} message(s) from mailtrap at path ${path}`);

    if (messages.length === 0) {
        return [];
    }

    const count = 15;
    return messages.slice(0, count); // Latest emails.
}

/**
 * Checks whether expected text was in a recent email HTML body.
 *
 * Be sure to `await` any results that should impact test pass/fail status!
 *
 * @param {string} searchText   Expected text to find anywhere in HTML
 * @param {string} toEmailAddress Only find emails addressed to this account
 *              (or an account that starts with this)
 * @returns {Promise<boolean>}       Whether the expected text was found.
 */
export async function checkAnEmailBodyContainsText(searchText, toEmailAddress) {
    const messages = await getLatestMessages(toEmailAddress);
    if (messages.length === 0) {
        return false;
    }

    let body;
    for (let ii = 0; ii < messages.length; ii += 1) {
        // Seems like we need await with the current approach to get the content. A refactor
        // where all bodies are got in one go would be slightly better, but is not a big
        // optimisation. For now, let's skip the eslint check for this line.
        // eslint-disable-next-line no-await-in-loop

        // eslint-disable-next-line no-await-in-loop
        body = /** @type {string} */ (await mailtrapGet(messages[ii].html_path, 'document'));
        if (body.includes(searchText)) {
            return true;
        }
    }

    console.error(`Expected "${searchText}" not found in email body:\n\n${body}`);

    return false;
}

/**
 * Checks one of the latest emails' subject line contains the expected text.
 *
 * Throws if the subject was not found.
 *
 * @param {string} searchText   Text to expect in latest subject line.
 * @param {string} toEmailAddress Only find emails addressed to this account
 * @returns {Promise<void>} Promise that resolves when check is done.
 */
export async function checkAnEmailSubjectContainsText(searchText, toEmailAddress) {
    const messages = await getLatestMessages(toEmailAddress);
    if (messages.length === 0) {
        throw new Error('No email messages found');
    }

    for (let ii = 0; ii < messages.length; ii += 1) {
        if (messages[ii].subject.includes(searchText)) {
            return;
        }
    }

    const joinedSubjects = messages.map((m) => m.subject).join(', ');

    throw new Error(`"${searchText}" not found in email subjects: "${joinedSubjects}"`);
}
