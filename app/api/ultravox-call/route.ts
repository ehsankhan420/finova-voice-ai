import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the Ultravox API key from environment variables
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Ultravox API key not configured" }, { status: 500 })
    }

    // Parse the request body
    const { action, voiceId, sessionId } = await request.json()

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
          return NextResponse.json(
            { error: "Failed to start Ultravox call", details: errorData },
            { status: startResponse.status },
          )
        }

        const startData = await startResponse.json()
        return NextResponse.json(startData)

      case "end":
        // End an active call session
        if (!sessionId) {
          return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
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
          return NextResponse.json(
            { error: "Failed to end Ultravox call", details: errorData },
            { status: endResponse.status },
          )
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in Ultravox call API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

