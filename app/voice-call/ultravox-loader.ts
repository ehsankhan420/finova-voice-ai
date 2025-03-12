/**
 * This script ensures the Ultravox SDK is loaded properly
 * with a fallback mechanism if the CDN fails
 */

export function ensureUltravoxLoaded(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Ultravox is already loaded
      if (typeof window !== "undefined" && window.Ultravox) {
        console.log("Ultravox SDK already loaded")
        return resolve()
      }
  
      // Set a timeout for the CDN load
      const timeoutId = setTimeout(() => {
        console.warn("Ultravox SDK load timeout, trying fallback")
        loadFallbackSdk().then(resolve).catch(reject)
      }, 5000)
  
      // Create a script element to load the SDK
      const script = document.createElement("script")
      script.src = "https://cdn.ultravox.ai/sdk/v1/ultravox.js"
      script.async = true
  
      script.onload = () => {
        clearTimeout(timeoutId)
        console.log("Ultravox SDK loaded from CDN")
        resolve()
      }
  
      script.onerror = () => {
        clearTimeout(timeoutId)
        console.error("Failed to load Ultravox SDK from CDN, using fallback")
        loadFallbackSdk().then(resolve).catch(reject)
      }
  
      document.head.appendChild(script)
    })
  }
  
  function loadFallbackSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fallbackScript = document.createElement("script")
      fallbackScript.src = "/ultravox-fallback.js"
      fallbackScript.async = true
  
      fallbackScript.onload = () => {
        console.log("Ultravox fallback SDK loaded")
        resolve()
      }
  
      fallbackScript.onerror = () => {
        console.error("Failed to load Ultravox fallback SDK")
        reject(new Error("Failed to load Ultravox SDK"))
      }
  
      document.head.appendChild(fallbackScript)
    })
  }
  
  