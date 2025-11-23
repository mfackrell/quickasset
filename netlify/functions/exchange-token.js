exports.handler = async function(event, context) {
    // 1. Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // 2. Get the temporary code from the frontend
    const { code } = JSON.parse(event.body);

    // 3. Send it to Stripe with your Secret Key
    const params = new URLSearchParams();
    params.append('client_secret', process.env.STRIPE_SECRET_KEY);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');

    try {
        const response = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        // 4. Return the result to your frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
