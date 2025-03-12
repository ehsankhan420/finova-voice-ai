"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ensureUltravoxLoaded } from "@/app/voice-call/ultravox-loader"

interface UltravoxContextType {
  isLoaded: boolean
  error: Error | null
}

const UltravoxContext = createContext<UltravoxContextType>({
  isLoaded: false,
  error: null,
})

export function useUltravox() {
  return useContext(UltravoxContext)
}

interface UltravoxProviderProps {
  children: ReactNode
}

export function UltravoxProvider({ children }: UltravoxProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    ensureUltravoxLoaded()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err))
  }, [])

  return <UltravoxContext.Provider value={{ isLoaded, error }}>{children}</UltravoxContext.Provider>
}

