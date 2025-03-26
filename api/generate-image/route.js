import { NextResponse } from 'next/server';

// Remove the edge runtime for testing
// export const runtime = 'edge';

export async function POST(request) {
    try {
        const { prompt } = await request.json();
        console.log('API route hit! Received prompt:', prompt);

        if (!process.env.HUGGING_FACE_API_KEY) {
            console.error('Missing Hugging Face API key');
            return NextResponse.json(
                { error: 'Server configuration error - Missing API key' },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                }),
            }
        );

        console.log('Hugging Face API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API error:', errorText);
            return NextResponse.json(
                { error: `Hugging Face API error: ${errorText}` },
                { status: response.status }
            );
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`;
        
        return NextResponse.json({ image: base64Image });
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}