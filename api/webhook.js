import { buffer } from 'micro';
const Stripe = require('stripe');
const nodemailer = require('nodemailer');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 

export const config = {
    api: { bodyParser: false }, // Necessary for Stripe signature verification
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // HANDLE SUCCESSFUL PAYMENT
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.payment_link) {
            try {
                // Retrieve the metadata we hid in Step 1
                const paymentLink = await stripe.paymentLinks.retrieve(session.payment_link);
                const { downloadUrl, assetTitle } = paymentLink.metadata;
                
                // Use the email they typed into Stripe during checkout
                const customerEmail = session.customer_details?.email;

                if (downloadUrl && customerEmail) {
                    console.log(`Sending Email #2 to ${customerEmail}`);
                    
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    // SEND EMAIL #2 (The Delivery)
                    await transporter.sendMail({
                        from: `"QuickAsset" <${process.env.EMAIL_USER}>`,
                        to: customerEmail,
                        subject: `Download Your Asset: ${assetTitle}`,
                        html: `
                            <div style="font-family: sans-serif; color: #1e293b; max-width: 500px;">
                                <h2 style="color: #0f172a;">Order Confirmed</h2>
                                <p>Thank you for your purchase. Your asset is ready for download.</p>
                                
                                <p style="margin: 24px 0;">
                                    <a href="${downloadUrl}" style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                                        Download File
                                    </a>
                                </p>
                        
                                <p style="font-size: 12px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                                    Link expires in 24 hours.<br>
                                    Direct Link: <a href="${downloadUrl}" style="color: #64748b;">${downloadUrl}</a>
                                </p>
                            </div>`
                    });
                }
            } catch (err) {
                console.error('Error sending fulfillment:', err);
            }
        }
    }

    res.status(200).json({ received: true });
}
