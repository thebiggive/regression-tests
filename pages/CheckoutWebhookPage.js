import sendCheckoutWebhook from '../support/checkout/webhook';

/**
 * checkout webhook page object
 */
export default class CheckoutWebhookPage {
    /**
     * trigger webhook
     * @param {int} amount donation amount
     * @param {string} firstName donor first name
     * @param {string} lastName donor last name
     * @param {string} guestEmail donor email
     * @param {string} address donor address
     * @param {string} country donor country
     */
    static async triggerWebhook(
        amount,
        firstName,
        lastName,
        guestEmail,
        address,
        country,
    ) {
        console.log(`Donation Check URL: ${browser.getUrl()}`);

        const donationID = (await browser.getUrl())
            .split('/')[4]; // Donation ID
        browser.call(async () => {
            await sendCheckoutWebhook(
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
        });
    }
}
