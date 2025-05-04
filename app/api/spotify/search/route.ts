import { NextResponse } from "next/server"

// Spotify API credentials from environment variables
const SPOTIFY_CLIENT_ID = "109e5a4514934ed5971bef34134fb90e"
const SPOTIFY_CLIENT_SECRET = "8f885585f4e842af8dc180e375d5cc11"

// Function to get Spotify access token
async function getSpotifyAccessToken() {
  try {
    const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Spotify token error: ${response.status}`, errorText)
      throw new Error(`Failed to get Spotify access token: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Spotify authentication error:", error)
    throw error
  }
}

// Search Spotify API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "track"

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    console.log(`Searching Spotify for ${type}: "${query}"`)

    // Get access token
    const accessToken = await getSpotifyAccessToken()
    console.log("Successfully obtained Spotify access token")

    // Search Spotify
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`
    console.log(`Making request to: ${searchUrl}`)

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Spotify API error: ${response.status}`, errorText)
      throw new Error(`Spotify API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Successfully retrieved ${type} data from Spotify`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Spotify search error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search Spotify" },
      { status: 500 },
    )
  }
}
