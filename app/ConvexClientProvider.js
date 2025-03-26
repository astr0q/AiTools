'use client'
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { AuthContextProvider } from "./_context/AuthContent"
import { ThemeProvider } from "next-themes"

const convex = new ConvexReactClient("http://127.0.0.1:3210")

export default function ConvexClientProvider({ children }) {
  return (
    <ConvexProvider client={convex}>
      <AuthContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthContextProvider>
    </ConvexProvider>
  )
} 