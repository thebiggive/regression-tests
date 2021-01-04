import simulateEnthuseWebhook from '../support/enthuse/webhook';

/**
 * checkout webhook page object
 */
export default class EnthuseAsync {
    /**
     * trigger webhook
     * @param {string} url  Webhook URL. Get from `browser`.
     * @param {int} amount donation amount
     * @param {string} firstName donor first name
     * @param {string} lastName donor last name
     * @param {string} guestEmail donor email
     * @param {string} address donor address
     * @param {string} country donor country
     * @returns {Promise} Hook result
     */
    static triggerWebhook(
        url,
        amount,
        firstName,
        lastName,
        guestEmail,
        address,
        country,
    ) {
        console.log(`Donation Check URL: ${url}`);

        const donationID = url.split('/')[4]; // Donation ID

        return simulateEnthuseWebhook(
            donationID,
            {
                charityId: process.env.CHECKOUT_CHARITY_ID,
                projectId: process.env.CHECKOUT_PROJECT_ID,
                donationAmount: amount,
                donationMatched: false,
                giftAid: false,
                optInTbgEmail: false,
                firstName,
                lastName,
                emailAddress: guestEmail,
                billingPostalAddress: address,
                // using slice to remove string: text
                countryCode: country.slice(7),
                status: 'Collected',
            }
        );
    }
}
