'use client'
import React, { useContext } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HomeIcon, BookImage, Search, CreditCard, Gem, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthContext } from '@/app/_context/AuthContent'
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from 'next/navigation'


const MenuItems = [
    {
        title:'Home',
        url: '/dashboard',
        icon:HomeIcon
    },
    {
        title:'Create New Image',
        url: '/create-new-video',
        icon:BookImage
    },
    {
        title: 'AI chat',
        url: '/ai-chat',
        icon:MessageCircle
    },
    {
        title:'Explore',
        url: '/explore',
        icon:Search
    },
    {
        title:'Billing',
        url: '/billing',
        icon:CreditCard
    },
    
]

const AppSidebar = () => {
   const path = usePathname();
   const {user} = useContext(AuthContext);
   
   // Query Convex for user data
   const userData = useQuery(api.users.getUser, { 
     email: user?.email 
   })

   const addCredits = useMutation(api.users.addCredits);

   const handleAddCredits = async () => {
     await addCredits({ 
       email: user?.email, 
       amount: 10  // This will add 10 credits
     });
   };

   return (
    <Sidebar>
      <SidebarHeader>
        <div>
        <div className='flex items-center gap-3 w-full justify-center mt-5'>
        <Image src='/logo.svg' alt='logo' width={40} height={40} />
        <h2 className='text-2xl font-bold'>Ai tools</h2>
        </div>
        <h2 className='text-lg text-gray-500 text-center mt-3'>Find many differant tools for your work</h2>
        </div>
      </SidebarHeader>
        <SidebarContent>
        <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                       {MenuItems.map((menu, index)=>(
                        <SidebarMenuItem className='mt-3' key={index}>
                            <SidebarMenuButton isActive={path === menu.url} className='p-5'>
                                <Link href={menu.url} className='flex items-center gap-4 p-3'>
                                <menu.icon />
                                <span>{menu.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                       ))} 
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup> 
        <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
            <div className='p-5 border rounded-lg mb-6'>
               <div className='flex items-center justify-between'>
                <Gem />
                <h2>{userData?.credits || 0} credits left</h2>
                </div>
                <Button onClick={handleAddCredits} className='w-full mt-3'>
                  Add 10 Credits (Dev)
                </Button>
                <Button className='w-full mt-3' onClick={() => router.push('/billing')}>Buy More Credits</Button> 
            </div>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
