'use client'
import React, { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/app/_context/AuthContent'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'

export const creditPlans = [
    {
        id: 1,
        name: '5 Credits',
        price: 1,
        credits: 5,
    },
    {
        id: 2,
        name: '10 Credits',
        price: 3,
        credits: 10,
    },
    {
        id: 3,
        name: '50 Credits',
        price: 5,
        credits: 50,
    },
    {
        id: 4,
        name: '100 Credits',
        price: 10,
        credits: 100,
    },
    {
        id: 5,
        name: '200 Credits',
        price: 15,
        credits: 200,
    },
    {
        id: 6,
        name: '400 Credits',
        price: 30,
        credits: 400,
    },
    
]

const BillingContent = () => {
    const { user, setUser} = useContext(AuthContext);
    const [credits, setCredits] = useState([]);
    const updateUserCredits = useMutation(api.users.UpdateUserCredits);
    const onPaymentSuccess = async (cost, credits) => {
        const result = await updateUserCredits({
            uid: user?._id,
            credits: Number(credits)
        })
        setUser(prev=>({...prev, credits: result.credits}));
        toast.success('Payment successful');
    }
    const onPaymentCancel = () => {
        toast.error('Payment cancelled');
    }
  return (
    <div className='max-w-[600px] mx-auto p-6'>
        <h1 className='text-3xl font-bold mb-8'>Credits</h1>
        <div className='flex flex-col gap-6'>
            <div className='border border-white rounded-xl p-6 bg-black/20 backdrop-blur-sm'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-200'>Total Credits</h2>
                        <p className='text-sm text-gray-400 mt-1'>1 Credit = 1 Image</p>
                    </div>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-3xl font-bold text-white'>{credits.length}</span>
                        <span className='text-gray-300'>Credits</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-sm'>If your credits becomes 0, you will not be able to generate images.</p>
                <p className='text-sm'>You can buy more credits from the options below.</p>
            </div>
            <div>
                <h2 className='text-lg font-bold'>Buy Credits</h2>
                <p className='text-sm'>You can buy more credits from the options below.</p>
                <div className='flex flex-col gap-4 mt-4 max-w-[600px]'>
                    {creditPlans.map((plan) => (
                        <div key={plan.id} className='flex justify-between border border-white rounded-lg p-4'>
                            <p className='text-lg'>{plan.name}</p>
                            <div className='flex items-center gap-4'>
                                <p className='text-lg'>${plan.price}</p>
                                <PayPalButtons 
                                    createOrder={async () => {
                                        try {
                                            const response = await fetch("/api/create-paypal-order", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    price: plan.price,
                                                    credits: plan.credits
                                                }),
                                            });
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            const data = await response.json();
                                            return data.id;
                                        } catch (error) {
                                            console.error('Error:', error);
                                            toast.error('Failed to create order');
                                            throw error;
                                        }
                                    }}
                                    onApprove={async (data) => {
                                        try {
                                            const response = await fetch("/api/capture-paypal-order", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    orderID: data.orderID
                                                })
                                            });
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            const orderData = await response.json();
                                            if (orderData.status === 'COMPLETED') {
                                                await onPaymentSuccess(plan.price, plan.credits);
                                            }
                                        } catch (error) {
                                            console.error('Error:', error);
                                            toast.error('Payment failed');
                                            throw error;
                                        }
                                    }}
                                    style={{ layout: "horizontal", height: 35 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

const page = () => {
    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture"
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <BillingContent />
        </PayPalScriptProvider>
    )
}

export default page
