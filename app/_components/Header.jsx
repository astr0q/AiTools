'use client'
import React, { useContext, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Authentication from './Authentication'
import Link from 'next/link'
import { useAuth } from '../_context/AuthContent'
import UserDropdown from './UserDropdown'

const Header = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Add any necessary side effects here
  }, [])

  return (
    <header className='p-4 border-b flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className='text-xl font-bold px-3'>AI tools for you</h1>
      </div>

      <div className='flex items-center gap-4'>
        {!user ? (
          <Authentication>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </Authentication>
        ) : (
          <div className='flex items-center gap-4'>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <UserDropdown
              userImage={user.photoURL}
              userName={user.displayName || user.email}
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
