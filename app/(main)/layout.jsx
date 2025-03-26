import React from 'react'
import DashbaordProvider from './provider'
const DashboardLayout = ({children}) => {
  return (
    <div>
        <DashbaordProvider>
            {children}
        </DashbaordProvider>
    </div>
  )
}

export default DashboardLayout
