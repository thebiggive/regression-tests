import Stripe from 'stripe';
import { setTimeout } from 'node:timers/promises';

const stripeApiKey = process.env.STRIPE_API_KEY;
if (!stripeApiKey) {
    throw new Error('Stripe API KEY not set in environment');
}

const stripe = new Stripe(stripeApiKey);

/** @type {Stripe.PaymentIntent} */
let paymentIntent;

/**
 * @param {string} email
 */
export async function checkStripeCustomerExists(email) {
    const customers = await stripe.customers.list({
        email,
    });

    if (customers.data.length === 0) {
        throw new Error(`Stripe customer not found for email "${email}"`);
    }

    if (customers.data.length > 1) {
        throw new Error(`Multiple Stripe customers found for email "${email}", only one expected.`);
    }
}

/**
 * @param {string} donationUUID
 * @return {Promise<number>}
 */
export async function getChargedAmount(donationUUID) {
    // 1ms delay for now just to show how to add a delay. May need a longer delay to wait for
    // Stripe's search index to be updated.
    await setTimeout(1);

    // search docs say it results are *usually* available in less than a minute so we may have to experiment to
    // see if this is flaky or not. I don't think we have another great way to find the PI.
    [paymentIntent] = (await stripe.paymentIntents.search({
        query: `metadata["donationId"]:"${donationUUID}"`,
    })).data;

    if (!paymentIntent) {
        throw new Error(`Payment intent not found: for donation ${donationUUID}`);
    }

    const applicationFeeAmount = paymentIntent.application_fee_amount;
    if (applicationFeeAmount == null) {
        throw new Error('Application fee amount missing');
    }

    return +applicationFeeAmount / 100 - +paymentIntent.metadata.tipAmount;
}

/**
 * @param {Object} expectedAmounts
 * @param {number} expectedAmounts.totalCharged
 * @param {number} expectedAmounts.feeChargedToUs
 * @param {number} expectedAmounts.applicationFee
 * @param {number} expectedAmounts.feeGros
 * @param {number} expectedAmounts.feeNet
 * @param {number} expectedAmounts.feeVAT
 */
export function verifyStripePaymentIntentDetails(expectedAmounts) {
    console.log('TEMP LOG DELETE BEFORE MERGE');
    console.log(JSON.stringify(paymentIntent, null, 2));

    const actualDataFromStripe = {
        totalCharged: paymentIntent.amount / 100,
        feeChargedToUs: 42, // not sure where this will be in PI data, will check log.
        applicationFee: (paymentIntent.application_fee_amount || 0) / 100,
        feeGros: +(paymentIntent.metadata.stripeFeeRechargeGross) / 100,
        feeNet: paymentIntent.metadata.stripeFeeRechargeNet,
        feeVAT: +(paymentIntent.metadata.stripeFeeRechargeVat) / 100,
    };

    if (JSON.stringify(actualDataFromStripe) !== JSON.stringify(expectedAmounts)) {
        console.error({ expectedAmounts, actualDataFromStripe });
        throw new Error('Amounts in stripe payment intent did not all match expectations');
    }
}
