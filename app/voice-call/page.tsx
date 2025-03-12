"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Declare the Ultravox types

export default function VoiceCallPage() {
  const router = useRouter()
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState("mark")
  const [callStatus, setCallStatus] = useState("idle") // idle, connecting, active, ended
  const [transcript, setTranscript] = useState("")
  const [toolResponse, setToolResponse] = useState<{
    name?: string
    email?: string
    organization?: string
    useCase?: string
  }>({})

  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const [availableVoices, setAvailableVoices] = useState<{ id: string; name: string }[]>([])
  const [isLoadingVoices, setIsLoadingVoices] = useState(false)

  const callSessionRef = useRef<UltravoxCallSession | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const ultravoxRef = useRef<UltravoxClient | null>(null)

  // Check if Ultravox SDK is available
  useEffect(() => {
    const checkUltravoxSDK = () => {
      if (typeof window !== "undefined" && window.Ultravox) {
        setSdkLoaded(true)
        initializeUltravox()
      } else {
        // If not available after 5 seconds, show error
        setTimeout(() => {
          if (typeof window === "undefined" || !window.Ultravox) {
            setSdkError("Ultravox SDK not loaded. Please refresh the page.")
          }
        }, 5000)
      }
    }

    checkUltravoxSDK()

    // Cleanup function
    return () => {
      if (callSessionRef.current) {
        handleEndCall()
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Initialize Ultravox client
  const initializeUltravox = () => {
    try {
      if (typeof window !== "undefined" && window.Ultravox) {
        ultravoxRef.current = new window.Ultravox({
          apiKey: process.env.NEXT_PUBLIC_ULTRAVOX_API_KEY || "zru54jkb.WQnoNV06ytmLhJLCLHVthXaP8Z88NlKF",
        })

        console.log("Ultravox client initialized")
        fetchAvailableVoices()
      }
    } catch (error) {
      console.error("Failed to initialize Ultravox client:", error)
      setSdkError(`Failed to initialize Ultravox client: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Fetch available voices
  const fetchAvailableVoices = async () => {
    setIsLoadingVoices(true)
    try {
      // In a real implementation, you would fetch from your server endpoint
      // const response = await fetch('/api/ultravox-voices')
      // const voices = await response.json()

      // For now, use mock data
      const mockVoices = [
        { id: "mark", name: "Mark" },
        { id: "sarah", name: "Sarah" },
        { id: "alex", name: "Alex" },
        { id: "emma", name: "Emma" },
      ]

      setAvailableVoices(mockVoices)
    } catch (error) {
      console.error("Error fetching voices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch available voices",
        variant: "destructive",
      })
    } finally {
      setIsLoadingVoices(false)
    }
  }

  const handleStartCall = async () => {
    if (!ultravoxRef.current) {
      setSdkError("Ultravox client not initialized")
      return
    }

    try {
      setCallStatus("connecting")

      // Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      toast({
        title: "Connecting",
        description: "Establishing voice connection...",
      })

      // Create call options
      const callOptions: UltravoxCallOptions = {
        voice: selectedVoice,
        stream: stream,
        onTranscript: (text: string) => {
          setTranscript((prev) => prev + text)
        },
        onToolCall: (data: any) => {
          console.log("Tool call received:", data)
          if (data && data.name === "collect_user_info") {
            setToolResponse({
              name: data.arguments?.name || "",
              email: data.arguments?.email || "",
              organization: data.arguments?.organization || "",
              useCase: data.arguments?.use_case || "",
            })

            toast({
              title: "Information Collected",
              description: "User information has been collected",
            })
          }
        },
      }

      // Start the call
      const session = await ultravoxRef.current.createCall(callOptions)

      callSessionRef.current = session
      setIsCallActive(true)
      setCallStatus("active")

      toast({
        title: "Call Active",
        description: "You are now connected to the voice assistant",
      })

      // Set up event listeners
      session.on("ended", () => {
        setIsCallActive(false)
        setCallStatus("ended")
        setTimeout(() => setCallStatus("idle"), 2000)

        toast({
          title: "Call Ended",
          description: "The voice call has ended",
        })
      })

      session.on("error", (error: any) => {
        console.error("Call error:", error)
        setCallStatus("idle")
        setSdkError(`Call error: ${error.message || "Unknown error"}`)

        toast({
          title: "Call Error",
          description: error.message || "An error occurred during the call",
          variant: "destructive",
        })
      })
    } catch (error) {
      console.error("Failed to start call:", error)
      setCallStatus("idle")
      setSdkError(`Failed to start call: ${error instanceof Error ? error.message : "Unknown error"}`)

      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to start the voice call",
        variant: "destructive",
      })
    }
  }

  const handleEndCall = async () => {
    if (callSessionRef.current) {
      try {
        await callSessionRef.current.end()

        toast({
          title: "Call Ended",
          description: "You've disconnected from the voice assistant",
        })
      } catch (error) {
        console.error("Error ending call:", error)

        toast({
          title: "Error",
          description: "Failed to properly end the call",
          variant: "destructive",
        })
      }

      callSessionRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    setIsCallActive(false)
    setCallStatus("ended")
    setTimeout(() => setCallStatus("idle"), 2000)
  }

  const toggleMute = () => {
    if (callSessionRef.current) {
      try {
        callSessionRef.current.setMicrophoneMuted(!isMuted)

        // Also mute the actual media stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = isMuted // Toggle the current state (if muted, enable it)
          })
        }

        setIsMuted(!isMuted)

        toast({
          title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
          description: isMuted ? "Others can now hear you" : "Others cannot hear you",
        })
      } catch (error) {
        console.error("Error toggling mute:", error)

        toast({
          title: "Error",
          description: "Failed to toggle microphone",
          variant: "destructive",
        })
      }
    }
  }

  const toggleAudio = () => {
    if (callSessionRef.current) {
      try {
        callSessionRef.current.setAudioEnabled(!isAudioEnabled)
        setIsAudioEnabled(!isAudioEnabled)

        toast({
          title: isAudioEnabled ? "Audio Disabled" : "Audio Enabled",
          description: isAudioEnabled ? "You cannot hear others" : "You can now hear others",
        })
      } catch (error) {
        console.error("Error toggling audio:", error)

        toast({
          title: "Error",
          description: "Failed to toggle audio",
          variant: "destructive",
        })
      }
    }
  }

  const goBack = () => {
    if (isCallActive) {
      handleEndCall()
    }
    router.push("/")
  }

  return (
    <motion.div
      className="min-h-screen transition-colors duration-300 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="noise"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_50%)] animate-gradient"></div>
      </div>

      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Icon-swk7WBmbgmNpfLAhcW7L0zgvSEnqeu.png"
                alt="FINOVA Logo"
                width={40}
                height={40}
                className="h-10 w-auto transition-transform hover:scale-105"
                style={{ objectFit: "contain" }}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
            <h1 className="text-lg font-semibold">FINOVA Voice Call</h1>
          </motion.div>
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {sdkError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{sdkError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Config Panel */}
          <motion.div
            className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6">Config</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="voice-select" className="text-sm font-medium text-muted-foreground uppercase">
                  VOICE
                </label>
                <Select
                  value={selectedVoice}
                  onValueChange={setSelectedVoice}
                  disabled={isCallActive || !sdkLoaded || isLoadingVoices}
                >
                  <SelectTrigger id="voice-select" className="w-full">
                    <SelectValue placeholder={isLoadingVoices ? "Loading voices..." : "Select a voice"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full py-6 text-lg"
                onClick={isCallActive ? handleEndCall : handleStartCall}
                disabled={callStatus === "connecting" || !sdkLoaded}
                variant={isCallActive ? "destructive" : "default"}
              >
                {!sdkLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading SDK...
                  </>
                ) : callStatus === "connecting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : callStatus === "active" ? (
                  "End Call"
                ) : callStatus === "ended" ? (
                  "Call Ended"
                ) : (
                  "Start Call"
                )}
              </Button>

              {isCallActive && (
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    className={cn("flex-1", isMuted && "bg-destructive/10 text-destructive border-destructive/20")}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1",
                      !isAudioEnabled && "bg-destructive/10 text-destructive border-destructive/20",
                    )}
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                    {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    callStatus === "active" ? "bg-green-500 animate-pulse" : "bg-red-500",
                  )}
                />
                <span className="text-sm font-medium">{callStatus === "active" ? "ON" : "OFF"}</span>
              </div>
            </div>
          </motion.div>

          {/* Conversation Panel */}
          <motion.div
            className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">Ultravox Assistant Demo</h2>

            <div
              className={cn(
                "flex items-center gap-2 mb-4",
                callStatus === "active" ? "text-green-500" : "text-red-500",
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  callStatus === "active" ? "bg-green-500 animate-pulse" : "bg-red-500",
                )}
              />
              <span className="text-sm font-medium">{callStatus === "active" ? "ON" : "OFF"}</span>
            </div>

            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              {callStatus === "idle" && !transcript && (
                <p className="text-muted-foreground">
                  This agent has been prompted to provide basic information about the FINOVA voice assistant. The agent
                  will casually ask for information about you and report what it's learned via a tool call.
                </p>
              )}

              {transcript && (
                <div className="space-y-4">
                  <p className="text-sm text-foreground">{transcript}</p>
                </div>
              )}

              {callStatus === "active" && !transcript && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Waiting for response...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tool Response Panel */}
          <motion.div
            className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-6">Tool Response</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">NAME:</p>
                <p className="text-sm">{toolResponse.name || "-"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">EMAIL:</p>
                <p className="text-sm">{toolResponse.email || "-"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ORGANIZATION:</p>
                <p className="text-sm">{toolResponse.organization || "-"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">USE CASE:</p>
                <p className="text-sm">{toolResponse.useCase || "-"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Toaster />
    </motion.div>
  )
}

