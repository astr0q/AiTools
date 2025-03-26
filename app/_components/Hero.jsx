'use client'
import React, { useContext } from 'react'
import { Button } from "@/components/ui/button";
import Authentication from './Authentication';
import { AuthContext } from '../_context/AuthContent'

const Hero = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className='p-10 flex flex-col items-center justify-center mt-24 md:px-20 lg:px-36 xl:px-48'>
      <h2 className='text-5xl font-bold text-center'>
        AI short video generator
      </h2>
      <p className='mt-4 text-2xltext-center text-gray-500'>Generate costum videos, photos, audios, and more things with AI</p>

      <div className='mt-7 gap-8 flex'>
        <Button variant='secondary' size='lg'>Explore</Button>
        {!user ? (
          <Authentication>
            <Button size='lg'>Get Started</Button>
          </Authentication>
        ) : (
          <Button size='lg'>Dashboard</Button>
        )}
      </div>
    </div>
  )
}

export default Hero
