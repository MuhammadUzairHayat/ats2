"use client"

import { SessionProvider } from "next-auth/react"
import React from "react"

export function NextSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      session={null}
      refetchInterval={300}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}
