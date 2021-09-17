const axios = require('axios').default;

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
 * @param {int} count  Number of recent emails to get.
 * @returns {array}     Up to {{count}} messages, if available.
 */
async function getLatestMessages(count = 3) {
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?search=&page=&last_id=`;
    const messages = await mailtrapGet(path, 'json');
    if (messages.length === 0) {
        return [];
    }

    return messages.slice(0, count); // Latest e.g. 3 emails.
}

/**
 * Checks whether expected text was in a recent email HTML body.
 *
 * Be sure to `await` any results that should impact test pass/fail status!
 *
 * @param {string} searchText   Expected text to find anywhere in HTML
 * @returns {boolean}       Whether the expected text was found.
 */
export async function checkAnEmailBodyContainsText(searchText) {
    const messages = getLatestMessages();
    if (messages.length === 0) {
        return false;
    }

    let body;
    for (let ii = 0; ii < messages.length; ii++) {
        body = mailtrapGet(messages[ii].html_path, 'document');
        if (body.includes(searchText)) {
            return true;
        }
    }

    return false;
}

/**
 * Checks one of the latest emails' subject line contains the expected text.
 *
 * Be sure to `await` any results that should impact test pass/fail status!
 *
 * @param {string} searchText   Text to expect in latest subject line.
 * @returns {boolean}           Whether the text was found.
 */
export async function checkAnEmailSubjectContainsText(searchText) {
    const messages = getLatestMessages();
    if (messages.length === 0) {
        return false;
    }

    for (let ii = 0; ii < messages.length; ii++) {
        if (messages[ii].subject.includes(searchText)) {
            return true;
        }
    }

    return false;
}
