export async function POST(request) {
    try {
        const { price, credits } = await request.json();
        
        const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
                ).toString("base64")}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: price.toString(),
                        },
                        description: `${credits} Credits Purchase`,
                    },
                ],
            }),
        });

        const order = await response.json();
        return Response.json(order);
    } catch (error) {
        console.error("Error:", error);
        return Response.json({ error: "Failed to create order" }, { status: 500 });
    }
} 