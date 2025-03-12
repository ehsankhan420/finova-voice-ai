import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the Ultravox API key from environment variables
    const apiKey = process.env.ULTRAVOX_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Ultravox API key not configured" }, { status: 500 })
    }

    // Fetch available voices from Ultravox API
    const response = await fetch("https://api.ultravox.ai/voices", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch voices from Ultravox API" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Ultravox voices:", error)
    return NextResponse.json({ error: "Failed to fetch Ultravox voices" }, { status: 500 })
  }
}

