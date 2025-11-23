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

        // Convert price to cents (Stripe always uses cents)
        const priceInCents = Math.round(price * 100);
        
        // Calculate your 5% platform fee manually
        const platformFee = Math.round(priceInCents * 0.05);

        // 2. Create the Price on the SELLER'S account
        const priceRecord = await stripe.prices.create({
            currency: 'usd',
            unit_amount: priceInCents,
            product_data: {
                name: title,
            },
        }, {
            stripeAccount: accountId, 
        });

        // 3. Create the Payment Link
        // CORRECTION: application_fee_amount must be at the TOP LEVEL for Payment Links
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{
                price: priceRecord.id,
                quantity: 1,
            }],
            application_fee_amount: platformFee, // <--- Correct placement (Top Level)
        }, {
            stripeAccount: accountId,
        });

        // 4. Send the link back to the frontend
        return res.status(200).json({ url: paymentLink.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
