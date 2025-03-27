'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from "@/configs/firebaseCofig"; // Make sure path is correct
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from 'sonner';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import { db } from '@/configs/firebaseCofig';
import { doc, setDoc } from 'firebase/firestore';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const createUser = useMutation(api.users.createNewUser);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Add error states
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            toast.error('Please check the form for errors');
            return;
        }

        try {
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update Firebase profile
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Create user in Convex
            console.log("Creating Convex user:", { name, email });
            const convexUser = await createUser({
                name: name,
                email: email,
                pictureURL: userCredential.user.photoURL || "",
            });
            
            console.log("Convex user created:", convexUser);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-gray-500">Enter your information to get started</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}