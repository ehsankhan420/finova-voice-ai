"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Mic,
  Upload,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  Volume2,
  Wand2,
  FileAudio,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { processVoice, synthesizeSpeech } from "@/lib/api"
import { useTheme } from "next-themes"

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [textResponse, setTextResponse] = useState("")
  const [audioResponse, setAudioResponse] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [requestId, setRequestId] = useState<string | null>(null)
  const [audioVisualization, setAudioVisualization] = useState<number[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const { theme } = useTheme()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random audio visualization data
  useEffect(() => {
    if (isPlaying && audioResponse) {
      const generateVisualization = () => {
        const newVisualization = Array.from({ length: 50 }, () => Math.random() * 50 + 10)
        setAudioVisualization(newVisualization)
        animationFrameRef.current = requestAnimationFrame(generateVisualization)
      }

      generateVisualization()

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    } else if (!isPlaying) {
      setAudioVisualization([])
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, audioResponse])

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setProgress(0)
      setTextResponse("")
      setAudioResponse(null)
      setRequestId(null)

      // Show success toast
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} has been selected.`,
        variant: "default",
      })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" })
        setFile(audioFile)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        // Show success toast
        toast({
          title: "Recording Complete",
          description: `Your ${formatTime(recordingTime)} audio has been recorded successfully.`,
          variant: "default",
        })
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Show recording started toast
      toast({
        title: "Recording Started",
        description: "Speak now. Click the button again to stop recording.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a voice file or record audio first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(10)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("prompt", prompt || "Please transcribe this audio and respond appropriately.")

      // Process voice with Gemini
      setProgress(30)
      const { text, requestId } = await processVoice(formData)
      setTextResponse(text)
      setRequestId(requestId)

      // Synthesize speech
      setProgress(80)
      const { audioUrl } = await synthesizeSpeech(text, requestId)

      // Construct full URL for audio
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const fullAudioUrl = `${apiBaseUrl}${audioUrl}`
      setAudioResponse(fullAudioUrl)
      setProgress(100)

      toast({
        title: "Processing Complete",
        description: "Your voice has been processed successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error processing voice:", error)
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your voice.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const resetForm = () => {
    setFile(null)
    setTextResponse("")
    setAudioResponse(null)
    setProgress(0)
    setPrompt("")
    setRequestId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    toast({
      title: "Form Reset",
      description: "All inputs and responses have been cleared.",
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="overflow-hidden border-2 shadow-lg transition-all hover:shadow-xl dark:bg-card/95 backdrop-blur-sm animate-scale-in relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
        <CardContent className="p-6 sm:p-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-custom" />
                <span>Prompt (Optional)</span>
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter a prompt for the AI (e.g., 'Summarize this audio' or 'Answer the question in the recording')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px] resize-none transition-all focus:ring-2 focus:ring-primary/50 focus:border-primary bg-card/50 backdrop-blur-sm"
                disabled={isProcessing}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 sm:p-8 transition-all hover:border-primary/50 group bg-card/50 backdrop-blur-sm">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
                disabled={isProcessing || isRecording}
              />

              {file ? (
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-3 mx-auto w-fit group-hover:scale-110 transition-transform animate-pulse-custom">
                    <FileAudio className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-lg">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="mt-2 flex items-center justify-center">
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ready to process
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-3 mx-auto w-fit group-hover:scale-110 transition-transform animate-float">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-lg">Upload or Record Audio</p>
                  <p className="text-sm text-muted-foreground">MP3, WAV, or M4A up to 10MB</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 justify-center mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isProcessing || isRecording}
                  className="flex items-center gap-2 transition-all hover:bg-primary hover:text-primary-foreground button-hover"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>

                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={cn(
                    "flex items-center gap-2 transition-all button-hover",
                    isRecording ? "animate-pulse-custom" : "hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                  {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : "Record Audio"}
                </Button>
              </div>
            </div>

            {progress > 0 && progress < 100 && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Wand2 className="h-4 w-4 mr-2 animate-spin-custom" />
                    Processing...
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 transition-all bg-muted/50">
                  <div className="h-full bg-gradient-to-r from-[#0e3b62] to-[#29a3d6] animate-gradient rounded-full"></div>
                </Progress>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                type="submit"
                disabled={!file || isProcessing || isRecording}
                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-[#0e3b62] via-[#1a6b9e] to-[#29a3d6] hover:opacity-90 transition-opacity animate-gradient button-hover"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin-custom" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Process Voice
                  </>
                )}
              </Button>

              {(file || textResponse || audioResponse) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isProcessing || isRecording}
                  className="w-full sm:w-auto flex items-center gap-2 transition-all hover:bg-destructive hover:text-destructive-foreground button-hover"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </form>

          {textResponse && (
            <div
              className="mt-8 space-y-4 animate-fade-up opacity-0"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-custom" />
                AI Response
              </h3>
              <div className="rounded-lg border bg-card/50 backdrop-blur-sm p-5 shadow-inner transition-all hover:shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <p className="whitespace-pre-wrap relative z-10">{textResponse}</p>
              </div>
            </div>
          )}

          {audioResponse && (
            <div
              className="mt-6 space-y-4 animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary animate-pulse-custom" />
                Voice Response
              </h3>
              <div className="flex flex-col gap-4 rounded-lg border bg-card/50 backdrop-blur-sm p-5 shadow-inner transition-all hover:shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={togglePlayback}
                    className="h-14 w-14 rounded-full transition-transform hover:scale-105 bg-primary/10 hover:bg-primary hover:text-primary-foreground button-hover"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <span className="text-sm font-medium">{isPlaying ? "Playing audio..." : "Click to play"}</span>
                  <audio ref={audioRef} src={audioResponse} onEnded={handleAudioEnded} className="hidden" />
                </div>

                {/* Audio visualization */}
                <div className="h-16 w-full flex items-center justify-center gap-[2px] p-2 bg-muted/30 rounded-lg overflow-hidden">
                  {isPlaying ? (
                    audioVisualization.map((height, index) => (
                      <div
                        key={index}
                        className="w-1.5 bg-gradient-to-t from-primary/40 to-primary rounded-full transition-all duration-75"
                        style={{
                          height: `${height}%`,
                          opacity: theme === "dark" ? 0.9 : 0.8,
                        }}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Audio visualization will appear during playback</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}

