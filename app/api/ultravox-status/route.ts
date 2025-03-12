import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the Ultravox API key from environment variables
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Ultravox API key not configured" }, { status: 500 })
    }

    // Check Ultravox API status
    const response = await fetch("https://api.ultravox.ai/status", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Ultravox API is not available" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error checking Ultravox API status:", error)
    return NextResponse.json({ error: "Failed to check Ultravox API status" }, { status: 500 })
  }
}

