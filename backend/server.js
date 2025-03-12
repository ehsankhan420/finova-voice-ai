import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import fetch from "node-fetch"

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

// In-memory storage for voice requests (replacing MongoDB)
const voiceRequests = []

// Routes
app.get("/", (req, res) => {
  res.send("FINOVA Voice AI API is running")
})

// Process voice with Gemini API
app.post("/api/process-voice", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const filePath = req.file.path
    const prompt = req.body.prompt || "Please transcribe this audio and respond appropriately."

    // Read the file as base64
    const fileBuffer = fs.readFileSync(filePath)
    const base64Audio = fileBuffer.toString("base64")

    // Prepare the request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: base64Audio,
              },
            },
          ],
        },
      ],
      generation_config: {
        temperature: 0.4,
        top_p: 0.95,
        top_k: 40,
      },
    }

    // Make request to Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("Gemini API error:", errorData)
      return res.status(500).json({ error: "Failed to process with Gemini API" })
    }

    const geminiData = await geminiResponse.json()

    // Extract text from Gemini response
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

    // Save the request to in-memory storage
    const requestId = uuidv4()
    const voiceRequest = {
      _id: requestId,
      originalFilename: req.file.originalname,
      storedFilename: req.file.filename,
      prompt: prompt,
      response: text,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      createdAt: new Date(),
    }

    voiceRequests.push(voiceRequest)

    return res.json({ text, requestId })
  } catch (error) {
    console.error("Error processing voice:", error)
    return res.status(500).json({ error: "Failed to process voice" })
  }
})

// Synthesize speech with ElevenLabs API
app.post("/api/synthesize-speech", async (req, res) => {
  try {
    const { text, requestId } = req.body

    if (!text) {
      return res.status(400).json({ error: "No text provided" })
    }

    // Default voice ID for ElevenLabs
    const voiceId = "EXAVITQu4vr4xnSDxMaL"

    // Make request to ElevenLabs API
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!elevenLabsResponse.ok) {
      console.error("ElevenLabs API error:", await elevenLabsResponse.text())
      return res.status(500).json({ error: "Failed to synthesize speech with ElevenLabs API" })
    }

    // Get the audio data
    const audioBuffer = await elevenLabsResponse.arrayBuffer()

    // Save the audio file
    const audioFilename = `${uuidv4()}.mp3`
    const audioPath = path.join(uploadsDir, audioFilename)
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer))

    // Update the in-memory storage if requestId is provided
    if (requestId) {
      const requestIndex = voiceRequests.findIndex((req) => req._id === requestId)
      if (requestIndex !== -1) {
        voiceRequests[requestIndex].audioFilename = audioFilename
      }
    }

    // Return the audio file path
    const audioUrl = `/uploads/${audioFilename}`
    return res.json({ audioUrl })
  } catch (error) {
    console.error("Error synthesizing speech:", error)
    return res.status(500).json({ error: "Failed to synthesize speech" })
  }
})

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Get history of voice requests
app.get("/api/history", async (req, res) => {
  try {
    // Return the in-memory storage, sorted by createdAt in descending order
    const history = [...voiceRequests]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)

    return res.json(history)
  } catch (error) {
    console.error("Error fetching history:", error)
    return res.status(500).json({ error: "Failed to fetch history" })
  }
})

// Ultravox API proxy endpoints
app.get("/api/ultravox-status", async (req, res) => {
  try {
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "Ultravox API key not configured" })
    }

    // Check Ultravox API status
    const response = await fetch("https://api.ultravox.ai/status", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: "Ultravox API is not available" })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.error("Error checking Ultravox API status:", error)
    return res.status(500).json({ error: "Failed to check Ultravox API status" })
  }
})

app.get("/api/ultravox-voices", async (req, res) => {
  try {
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "Ultravox API key not configured" })
    }

    // Fetch available voices from Ultravox API
    const response = await fetch("https://api.ultravox.ai/voices", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch voices from Ultravox API" })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.error("Error fetching Ultravox voices:", error)
    return res.status(500).json({ error: "Failed to fetch Ultravox voices" })
  }
})

app.post("/api/ultravox-call", async (req, res) => {
  try {
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "Ultravox API key not configured" })
    }

    const { action, voiceId, sessionId } = req.body

    // Handle different call actions
    switch (action) {
      case "start":
        // Initialize a call session with Ultravox API
        const startResponse = await fetch("https://api.ultravox.ai/calls", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voice: voiceId || "mark",
            settings: {
              prompt:
                "You are a helpful FINOVA voice assistant. Collect information about the user including their name, email, organization, and use case.",
            },
          }),
        })

        if (!startResponse.ok) {
          const errorData = await startResponse.json()
          return res.status(startResponse.status).json({
            error: "Failed to start Ultravox call",
            details: errorData,
          })
        }

        const startData = await startResponse.json()
        return res.json(startData)

      case "end":
        // End an active call session
        if (!sessionId) {
          return res.status(400).json({ error: "Session ID is required" })
        }

        const endResponse = await fetch(`https://api.ultravox.ai/calls/${sessionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        })

        if (!endResponse.ok) {
          const errorData = await endResponse.json()
          return res.status(endResponse.status).json({
            error: "Failed to end Ultravox call",
            details: errorData,
          })
        }

        return res.json({ success: true })

      default:
        return res.status(400).json({ error: "Invalid action" })
    }
  } catch (error) {
    console.error("Error in Ultravox call API route:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/ultravox-token", (req, res) => {
  try {
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "Ultravox API key not configured" })
    }

    // Return the API key (in a real production app, you might want to generate a temporary token instead)
    return res.json({ apiKey })
  } catch (error) {
    console.error("Error in Ultravox token API route:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

