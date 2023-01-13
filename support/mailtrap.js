const axios = require('axios');

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
 * @param {array} responseType  Deserialised response data
 */
async function mailtrapGet(path, responseType) {
    const response = await mailtrapClient.get(path, { responseType });
    return response.data;
}

/**
 * Get the latest Mailtrap inbox message, if any.
 *
 * @param {string} toEmailAddress Only find emails addressed to this account
 * @returns {array}     Up to {{count}} messages, if available.
 */
async function getLatestMessages(toEmailAddress) {
    if (typeof toEmailAddress !== 'string') {
        throw new Error(`Expected toEmailAddress to be string, was ${typeof toEmailAddress}: ${toEmailAddress}`);
    }

    const params = new URLSearchParams({ search: toEmailAddress });
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?${params.toString()}`;
    const messages = await mailtrapGet(path, 'json');
    console.log(`got ${messages.length} message(s) from mailtrap at path ${path}`);

    if (messages.length === 0) {
        return [];
    }

    const count = 5;
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
 * @returns {boolean}       Whether the expected text was found.
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
        body = await mailtrapGet(messages[ii].html_path, 'document');
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
 * @param {string} searchText   Text to expect in latest subject line.
 * @param {string} toEmailAddress Only find emails addressed to this account
 * @returns {void}
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
