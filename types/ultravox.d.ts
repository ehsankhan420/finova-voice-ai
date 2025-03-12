// Type definitions for Ultravox SDK
interface UltravoxCallOptions {
    voice: string
    stream: MediaStream
    onTranscript?: (text: string) => void
    onToolCall?: (data: any) => void
  }
  
  interface UltravoxCallSession {
    id: string
    setMicrophoneMuted: (muted: boolean) => void
    setAudioEnabled: (enabled: boolean) => void
    end: () => Promise<void>
    on: (event: "ended" | "error", callback: (data?: any) => void) => void
  }
  
  interface UltravoxClient {
    createCall: (options: UltravoxCallOptions) => Promise<UltravoxCallSession>
  }
  
  interface Window {
    Ultravox: {
      new (options: { apiKey: string }): UltravoxClient
    }
  }
  
  