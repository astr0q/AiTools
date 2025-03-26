'use client'
import { ThemeProvider } from "next-themes"
import { AuthContext } from "./_context/AuthContent"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/configs/firebaseCofig"
import { api } from "../convex/_generated/api"
import { useMutation } from "convex/react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const paypalOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
}

function Provider({ children }) {
  const [user, setUser] = useState()
  const createUser = useMutation(api.users.createNewUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Create user in Convex with matching fields
        await createUser({
          name: user.displayName || "",
          email: user.email || "",
          pictureURL: user.photoURL || "",
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [createUser])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <PayPalScriptProvider options={paypalOptions}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </PayPalScriptProvider>
    </AuthContext.Provider>
  )
}

export default Provider
