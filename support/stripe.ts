import Stripe from 'stripe';
// eslint-disable-next-line import/no-nodejs-modules
import { setTimeout } from 'node:timers/promises';

const stripeApiKey = process.env.STRIPE_API_KEY;
if (!stripeApiKey) {
    throw new Error('Stripe API KEY not set in environment');
}

const stripe = new Stripe(stripeApiKey);

let paymentIntent: Stripe.PaymentIntent;

export async function checkStripeCustomerExists(email: string) {
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

export async function getChargedAmount(donationUUID: string) {
    // 1s delay to give Stripe a little time to update search index.
    await setTimeout(1000);

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


export function verifyStripePaymentIntentDetails(
    expectedAmounts: { totalCharged: number; applicationFee: number; feeGros: number; feeNet: number; feeVAT: number; }
) {
    // would use spread syntax instead of Object.assign but eslint here doesn't seem to recognise it. Even though
    // it tells me to prefer it
    // eslint-disable-next-line prefer-object-spread
    const expected = Object.assign({
        status: 'succeeded',
    }, expectedAmounts);

    const actualDataFromStripe = {
        status: paymentIntent.status,
        totalCharged: paymentIntent.amount / 100,
        applicationFee: (paymentIntent.application_fee_amount || 0) / 100,
        feeGros: +(paymentIntent.metadata.stripeFeeRechargeGross),
        feeNet: +(paymentIntent.metadata.stripeFeeRechargeNet),
        feeVAT: +(paymentIntent.metadata.stripeFeeRechargeVat),
    };

    // consider using an assertion library soon to make it easier to check object equality.
    if (JSON.stringify(actualDataFromStripe) !== JSON.stringify(expected)) {
        console.error({ expected, actualDataFromStripe });
        throw new Error('values in stripe payment intent did not all match expectations');
    }
}
