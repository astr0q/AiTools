'use client'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from "convex/react";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button"
import { generateImage } from '@/configs/AiModel'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api } from "@/convex/_generated/api";
import { Download, Trash2, X } from "lucide-react";

// Add helper function at the top level
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const CreateNewImage = () => {
    const router = useRouter();
    const auth = getAuth();
    const saveImage = useMutation(api.images.saveImage);
    const deductCredit = useMutation(api.users.deductCredit);
    const credits = useQuery(api.users.getUserCredits, {
        email: auth.currentUser?.email || ""
    });
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);

    const userImages = useQuery(api.images.getUserImages, {
        userId: auth.currentUser?.uid || "",
    });

    const deleteImage = useMutation(api.images.deleteImage);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                setError("Please login to continue");
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    const handleGenerate = async () => {
        try {
            if (!auth.currentUser) {
                throw new Error("Please login first");
            }
    
            if (credits < 1) {
                throw new Error("You don't have enough credits");
            }
    
            setLoading(true);
            setError(null);
    
            console.log('Starting image generation with prompt:', prompt);
            const base64Image = await generateImage(prompt);
            
            // The base64Image is already in the correct format
            setImages(prev => [...prev, base64Image]);
            
            // Save to database
            await saveImage({
                userId: auth.currentUser.uid,
                prompt: prompt,
                imageUrl: base64Image
            });

            // Deduct credit
            await deductCredit({
                email: auth.currentUser.email
            });
            
        } catch (error) {
            console.error('Generation error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (imageUrl) => {
        setPreviewImage(imageUrl);
    }

    const handleDownload = async (imageUrl) => {
        try {
            // Check if the image is a base64 string
            if (imageUrl.startsWith('data:image')) {
                // For base64 images
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `generated-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // For regular URLs
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `generated-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const handleDelete = async (imageId) => {
        try {
            // Call your mutation to delete the image
            await deleteImage({
                id: imageId,
                userId: auth.currentUser.uid
            });
            
            // Close the preview
            setPreviewImage(null);
            
            // Refresh the images list (Convex will handle this automatically)
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div className="relative">
            {/* Top section with side-by-side layout */}
            <div className="flex gap-6">
                {/* Left Side - Input */}
                <div className="w-1/2 p-6 bg-gray border border-gray-700 rounded-2xl shadow-lg overflow-y-auto">
                    <div className="max-w-xl mx-auto space-y-6">
                        <h1 className="text-2xl font-bold text-white">Create AI Image</h1>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Enter your prompt</label>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Enter your prompt here..."
                                    className="w-full h-32 p-4 text-gray-200 bg-gray- rounded-xl border border-gray focus:outline-none focus:border-white resize-none"
                                    disabled={loading}
                                />
                                <p className="text-sm text-gray-400">
                                    Keep prompts descriptive and clear for better results.
                                </p>
                            </div>
                            
                            <Button 
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="w-full py-4 text-white bg-gray rounded-xl border border-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 
                                    `Generating Image${retryCount > 0 ? ` (Attempt ${retryCount + 1}/4)` : ''}...` : 
                                    'Generate Image'
                                }
                            </Button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500">
                                <p className="font-medium">Error:</p>
                                <p>{error}</p>
                                {error.includes('loading') && (
                                    <p className="text-sm mt-2">The model is warming up. We'll retry automatically.</p>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="text-center p-4 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500 animate-pulse">
                                <p className="font-medium">Generating your image...</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    {retryCount > 0 ? 
                                        'The model is warming up. We\'ll retry automatically.' : 
                                        'This may take a few moments.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Generated Image */}
                <div className="w-1/2 p-6 bg-gray border border-gray-700 rounded-2xl shadow-lg overflow-y-auto">
                    <div className="max-w-xl mx-auto bor">
                        {images.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-white">Generated Images</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Generated image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 rounded-b-lg">
                                                <p className="text-sm text-white truncate">
                                                    {prompt}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            setImages([]);
                                            setRetryCount(0);
                                        }}
                                        className="flex-[0.6] py-4 text-gray-200 bg-gray-800 rounded-xl border border-gray-600 hover:bg-gray-700"
                                    >
                                        Generate New Images
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400">No images generated yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom section - Generated Images Gallery */}
            <div className="mt-8 p-6 bg-gray border border-gray-700 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Your Generated Images</h2>
                
                {userImages === undefined ? (
                    <div className="text-gray-400">Loading your images...</div>
                ) : userImages.length === 0 ? (
                    <div className="text-gray-400">No images generated yet</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userImages.map((image) => (
                            <div key={image._id} className="relative group aspect-square w-full">
                                <img
                                    src={image.imageUrl}
                                    alt={image.prompt}
                                    className="object-cover rounded-lg border border-gray-700 transition-transform group-hover:scale-105 cursor-pointer"
                                    onClick={() => handleImageClick(image.imageUrl)}
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 rounded-b-lg">
                                    <p className="text-sm text-white truncate">
                                        {image.prompt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add this preview overlay */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setPreviewImage(null);
                    }}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh] bg-gray-800 rounded-lg p-2">
                        {/* Close button */}
                        <button
                            className="absolute -top-2 -right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-white transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                        
                        {/* Image */}
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        
                        {/* Action buttons */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(previewImage);
                                }}
                                className="bg-gray-700 hover:bg-gray-600"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const imageData = userImages.find(img => img.imageUrl === previewImage);
                                    if (imageData) {
                                        handleDelete(imageData._id);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateNewImage;
