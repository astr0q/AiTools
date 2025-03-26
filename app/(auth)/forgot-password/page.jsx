'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/logo.svg';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Add your password reset logic here
            setIsSubmitted(true);
        } catch (error) {
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4 ">
                <div className="w-full max-w-md space-y-8 border border-white rounded-2xl p-4">
                    <div className="flex flex-col items-center">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={50}
                            height={50}
                            className="mb-4"
                        />
                        <h1 className="text-3xl font-bold">Check your email</h1>
                        <p className="text-gray-500 mt-2">
                            We've sent you a password reset link. Please check your email.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="w-full"
                    >
                        <Link href="/login">
                            Back to login
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={50}
                        height={50}
                        className="mb-4"
                    />
                    <h1 className="text-3xl font-bold">Forgot password?</h1>
                    <p className="text-gray-500 mt-2">
                        Enter your email address and we'll send you a reset link
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <Link 
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
