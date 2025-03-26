'use client'
import React, { useContext } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { AuthContext } from '@/app/_context/AuthContent'

const AppHeader = () => {
    const { user } = useContext(AuthContext);
    
    return (
        <div className='p-3 flex justify-between items-center'>
            <SidebarTrigger />
            {user?.pictureURL && (
                <Image 
                    src={user.pictureURL} 
                    alt='user' 
                    width={40} 
                    height={40}
                    className="rounded-full"
                />
            )}
        </div>
    )
}

export default AppHeader
