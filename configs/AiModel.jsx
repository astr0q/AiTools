export async function generateImage(prompt) {
    console.log('Starting image request with prompt:', prompt);
    
    try {
        // Log to verify API key is available (remove in production)
        console.log('API Key available:', !!process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY);

        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', response.status, errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.image) {
            throw new Error('No image data received');
        }

        return data.image; // This will be a base64 string
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

export const generateVoiceOver = async (text) => {
    try {
        // Verify API key is present
        if (!process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
            throw new Error('Hugging Face API key is not configured');
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/coqui/XTTS-v2",
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: text,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Voice-over API error:', response.status, errorText);
            throw new Error(`Voice-over generation failed: ${response.status}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
