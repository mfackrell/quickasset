export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Get the code from the request body
    // Vercel parses JSON automatically, so we try/catch just in case
    let code;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        code = body.code;
    } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    if (!code) {
        return res.status(400).json({ error: 'Missing code parameter' });
    }

    // 3. Send to Stripe
    const params = new URLSearchParams();
    params.append('client_secret', process.env.STRIPE_SECRET_KEY);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');

    try {
        const stripeResponse = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            body: params
        });
        
        const data = await stripeResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
