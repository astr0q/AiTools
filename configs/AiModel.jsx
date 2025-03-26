export async function generateImage(prompt) {
    console.log('Starting image request with prompt:', prompt);
    
    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`API error: ${response.statusText}`);
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
        )

        if (!response.ok) {
            throw new Error('Voice-over generation failed')
        }

        const blob = await response.blob()
        return URL.createObjectURL(blob)
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}
