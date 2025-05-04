import { type NextRequest, NextResponse } from "next/server"
import { getSpotifyAccessToken } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const artistId = searchParams.get("id")

  if (!artistId) {
    return NextResponse.json({ error: "Artist ID is required" }, { status: 400 })
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching artist:", error)
    return NextResponse.json({ error: "Failed to fetch artist" }, { status: 500 })
  }
}
