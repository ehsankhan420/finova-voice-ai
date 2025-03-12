"use client"

import { useState, useEffect, useRef } from "react"

interface UseUltravoxOptions {
  apiKey: string
  onError?: (error: Error) => void
}

interface UltravoxCallOptions {
  // Define the properties for UltravoxCallOptions here
  // Example:
  // userId: string;
  [key: string]: any // Allow any property for flexibility
}

interface UltravoxCallSession {
  // Define the properties for UltravoxCallSession here
  // Example:
  // sessionId: string;
  [key: string]: any // Allow any property for flexibility
}

interface UseUltravoxReturn {
  client: any | null
  isLoaded: boolean
  error: Error | null
  createCall: (options: UltravoxCallOptions) => Promise<UltravoxCallSession>
}

export function useUltravox({ apiKey, onError }: UseUltravoxOptions): UseUltravoxReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const clientRef = useRef<any>(null)

  useEffect(() => {
    // Check if Ultravox SDK is available
    const checkUltravoxSDK = () => {
      if (typeof window !== "undefined" && window.Ultravox) {
        try {
          clientRef.current = new window.Ultravox({ apiKey })
          setIsLoaded(true)
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Failed to initialize Ultravox client")
          setError(error)
          if (onError) onError(error)
        }
      } else {
        // If not available after 5 seconds, show error
        const timeoutId = setTimeout(() => {
          if (typeof window === "undefined" || !window.Ultravox) {
            const error = new Error("Ultravox SDK not loaded. Please refresh the page.")
            setError(error)
            if (onError) onError(error)
          }
        }, 5000)

        return () => clearTimeout(timeoutId)
      }
    }

    checkUltravoxSDK()
  }, [apiKey, onError])

  const createCall = async (options: UltravoxCallOptions): Promise<UltravoxCallSession> => {
    if (!clientRef.current) {
      throw new Error("Ultravox client not initialized")
    }

    try {
      return await clientRef.current.createCall(options)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create call")
      setError(error)
      if (onError) onError(error)
      throw error
    }
  }

  return {
    client: clientRef.current,
    isLoaded,
    error,
    createCall,
  }
}

