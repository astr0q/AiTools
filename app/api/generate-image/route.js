import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt } = await request.json();
        console.log('Starting image generation with prompt:', prompt);

        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);
        
        // Use Pollinations API
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Convert to base64
        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        return NextResponse.json({
            image: `data:image/jpeg;base64,${base64Image}`
        });

    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 