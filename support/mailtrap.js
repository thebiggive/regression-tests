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
 * @param {string} path           Request path
 * @param {string} responseType json or document
 */
async function mailtrapGet(path, responseType) {
    const response = await mailtrapClient.get(path, { responseType });
    return response.data;
}

/**
 * Get the latest Mailtrap inbox message, if any.
 *
 * @returns {object|undefined}  Message if available.
 */
async function getLatestMessage() {
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?search=&page=&last_id=`;
    const messages = await mailtrapGet(path, 'json');
    if (messages.length === 0) {
        return undefined;
    }

    return messages[0];
}

/**
 * Gets the most recent Mailtrap.io-received email's body text.
 *
 * @returns {string|null} Body HTML if message found; otherwise null.
 */
async function getLatestEmailBody() {
    const message = await getLatestMessage();
    if (!message) {
        return null;
    }

    return mailtrapGet(message.html_path, 'document');
}

/**
 * Checks whether expected text was in an email HTML body.
 *
 * @param {string} needle   Expected text to find anywhere in HTML
 * @returns {boolean} Whether the expected text was found.
 */
export async function checkLatestEmailBodyContainsText(needle) {
    const body = await getLatestEmailBody();
    return body.includes(needle);
}

/**
 * Checks that the latest email's subject line contains the expected text.
 * @param {string} needle   Text to expect in latest subject line.
 * @returns {boolean}   Whether the text was found.
 */
export async function checkLatestEmailSubjectContainsText(needle) {
    const message = await getLatestMessage();
    if (!message) {
        return false;
    }

    return message.subject.includes(needle);
}
