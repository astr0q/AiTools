'use client'
import React, { useContext } from 'react'
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/configs/firebaseCofig";
import { AuthContext } from '../_context/AuthContent'
import { useRouter } from 'next/navigation';

const Authentication = ({children}) => {
    const { user } = useContext(AuthContext)
    const provider = new GoogleAuthProvider();
    const router = useRouter();
    
    const onSignInClick = async () => {
        if (user) return // Prevent re-authentication if user is already logged in
        
        // Navigate to login page instead of opening Google auth
        router.push('/login');
    }

    return (
        <div onClick={onSignInClick}>
            {children}
        </div>
    )
}

export default Authentication
