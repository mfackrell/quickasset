const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // 1. Security Checks
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { title, price, accountId } = JSON.parse(req.body);

        if (!accountId) {
            return res.status(400).json({ error: 'No connected account found' });
        }

        // 2. Create the Price on the SELLER'S account
        // We use {stripeAccount: accountId} to tell Stripe "Do this on their behalf"
        const priceRecord = await stripe.prices.create({
            currency: 'usd',
            unit_amount: Math.round(price * 100), // Convert dollars to cents
            product_data: {
                name: title,
            },
        }, {
            stripeAccount: accountId, // <--- THE MAGIC HEADER
        });

        // 3. Create the Payment Link with your 5% Fee
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{
                price: priceRecord.id,
                quantity: 1,
            }],
            application_fee_percent: 5, // You keep 5% of every sale
        }, {
            stripeAccount: accountId,
        });

        // 4. Send the link back to the frontend
        return res.status(200).json({ url: paymentLink.url });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
