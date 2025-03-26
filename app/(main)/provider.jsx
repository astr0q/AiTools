'use client'
import React, { useEffect, useContext } from 'react'
import { SidebarProvider} from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { AuthContext } from '@/app/_context/AuthContent'
import { useRouter } from 'next/navigation'


const DashbaordProvider = ({children}) => {

  const { user } = useContext(AuthContext);
  const router = useRouter();
   useEffect(()=>{
    user && CheckUserAuthenticated();
   },[user])

   const CheckUserAuthenticated = async ()=>{
    if(!user){
      router.replace('/');
    }
   }
  
  return (
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full'>
          <AppHeader />
          <div className='p-10'>
            {children}
          </div>
        </div>
      </SidebarProvider>
  )
}

export default DashbaordProvider