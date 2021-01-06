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
 * Gets the most recent Mailtrap.io-received email's body text.
 *
 * @returns {string|null} Body HTML if message found; otherwise null.
 */
export async function getLatestEmailBody() {
    const path = `/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages?search=&page=&last_id=`;
    const messages = await mailtrapGet(path, 'json');

    let bodyHtmlPath;
    if (messages.length > 0) {
        bodyHtmlPath = messages[0].html_path;
    }

    if (!bodyHtmlPath) {
        return null;
    }

    return mailtrapGet(bodyHtmlPath, 'document');
}

/**
 * Checks whether expected text was in an email HTML body.
 *
 * @param {string} needle   Expected text to find anywhere in HTML
 * @param {string} haystack Email body HTML
 * @returns {boolean} Whether the expected text was found.
 */
export function checkEmailBodyContainsText(needle, haystack) {
    return haystack.includes(needle);
}
