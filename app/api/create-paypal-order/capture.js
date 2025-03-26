export async function POST(request) {
    try {
        const { orderID } = await request.json();

        const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
                ).toString("base64")}`,
            },
        });

        const order = await response.json();
        return Response.json(order);
    } catch (error) {
        console.error("Error:", error);
        return Response.json({ error: "Failed to capture order" }, { status: 500 });
    }
}