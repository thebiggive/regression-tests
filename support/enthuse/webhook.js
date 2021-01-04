import request from 'request-promise-native';
import crypto from 'crypto';
import { generateIdentifier } from '../util';

/**
 * Get a verify hash for the given content, using the secret in the env-var
 * CHECKOUT_WEBHOOK_SECRET.
 *
 * @param {object}  data          JS object format body of the webhook that will
 * be submitted
 * @returns {string} Hash
 */
function getVerifyHash(data) {
    const hash = crypto.createHmac(
        'sha256',
        process.env.CHECKOUT_WEBHOOK_SECRET
    );
    hash.update(JSON.stringify(data), 'utf8');

    return hash.digest('hex');
}

/**
 * Send checkout webhook.
 *
 * Sample body:
 * ```
 * {
 *   "charityId": "01I400000009Sds3e2",
 *   "donationAmount": 100,
 *   "giftAid": true,
 *   "donationMatched": true,
 *   "firstName": "Ezra",
 *   "lastName": "Furman",
 *   "emailAddress": "ezra@example.com",
 *   "billingPostalAddress": "1 Main Street, London, N1 1AA",
 *   "countryCode": "GB",
 *   "optInTbgEmail": true,
 *   "projectId": "01I400000009Sds3e2",
 *   "amountMatchedByChampionFunds": 40,
 *   "amountMatchedByPledges": 60,
 *   "transactionId": "PSP-ID-123456"
 * }
 * ```
 *
 * Wrap in `browser.call(...)` callable to work with Webdriver.io sync mode.
 * @link https://webdriver.io/docs/sync-vs-async.html
 *
 * @param {string} id   transaction id
 * @param {object} data transaction data
 * @returns {Promise} Hook result
 */
export default function simulateEnthuseWebhook(id, data) {
    const dataIncPspId = data;
    dataIncPspId.transactionId = generateIdentifier('PSP-ID-');

    console.log(
        `WEBHOOK: Send checkout webhook - Donation ID "${id}",
        PSP ID "${dataIncPspId.transactionId}"`
    );

    const hash = getVerifyHash(dataIncPspId);
    const url = process.env.CHECKOUT_WEBHOOK_URL + id;
    return request({
        method: 'PUT',
        path: id,
        uri: url,
        body: dataIncPspId,
        json: true,
        headers: {
            'content-type': 'application/json',
            'X-Webhook-Verify-Hash': hash,
        },
    }).then(
        console.log('WEBHOOK: sent'),
    ).catch((reason) => {
        console.log(`WEBHOOK: error from ${url} – ${reason}`);
        throw new Error('Webhook error');
    });
}
