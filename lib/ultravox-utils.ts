/**
 * Utility functions for working with the Ultravox SDK
 */

/**
 * Fetches available voices from the Ultravox API
 */
export async function fetchUltravoxVoices(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch("/api/ultravox-voices")
  
      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching Ultravox voices:", error)
      // Return some default voices as fallback
      return [
        { id: "mark", name: "Mark" },
        { id: "sarah", name: "Sarah" },
        { id: "alex", name: "Alex" },
        { id: "emma", name: "Emma" },
      ]
    }
  }
  
  /**
   * Checks if the browser supports the required features for Ultravox
   */
  export function checkBrowserSupport(): { supported: boolean; reason?: string } {
    if (typeof navigator === "undefined") {
      return { supported: false, reason: "Navigator API not available" }
    }
  
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { supported: false, reason: "Media devices API not supported" }
    }
  
    return { supported: true }
  }
  
  /**
   * Safely ends an Ultravox call session
   */
  export async function safelyEndCall(session: any): Promise<void> {
    if (!session) return
  
    try {
      // First try the end method
      if (typeof session.end === "function") {
        await session.end()
        return
      }
  
      // Fall back to disconnect if end is not available
      if (typeof session.disconnect === "function") {
        await session.disconnect()
        return
      }
    } catch (error) {
      console.error("Error ending Ultravox call:", error)
      throw error
    }
  }
  
  /**
   * Creates a mock Ultravox session for testing
   */
  export function createMockUltravoxSession(): any {
    return {
      id: `session-${Date.now()}`,
  
      setMicrophoneMuted: (muted: boolean) => {
        console.log(`Microphone ${muted ? "muted" : "unmuted"}`)
      },
  
      setAudioEnabled: (enabled: boolean) => {
        console.log(`Audio ${enabled ? "enabled" : "disabled"}`)
      },
  
      end: async () => {
        console.log("Ending call session")
        return Promise.resolve()
      },
  
      on: (event: string, callback: Function) => {
        console.log(`Registered listener for ${event} event`)
      },
    }
  }
  
  