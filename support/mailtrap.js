const request = require('request');

/**
 * Gets the most recent Mailtrap.io-received email's body text.
 *
 * @returns {string|null} Body HTML if message found; otherwise null.
 */
export async function getLatestEmailBody() {
    const baseUri = 'https://mailtrap.io';
    const uri = `${baseUri}/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}`
      + '/messages?search=&page=&last_id=';
    let bodyHtmlPath;
    await request(uri, (error, response, body) => {
        if (body.length > 0) {
            bodyHtmlPath = body[0].html_path;
        }
    });

    if (!bodyHtmlPath) {
        return null;
    }

    let latestMessageBody;
    await request(`${baseUri}${bodyHtmlPath}`, (error, response, body) => {
        latestMessageBody = body;
    });

    return latestMessageBody;
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
