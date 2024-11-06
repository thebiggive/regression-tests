import Stripe from "Stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

/**
 * @param {string} email
 */
// eslint-disable-next-line import/prefer-default-export
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
