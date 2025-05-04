import type { SpotifySearchResponse, SpotifyTrack, SpotifyArtist } from "@/types/spotify"

// Function to search tracks on Spotify
export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  if (!query || query.length < 2) {
    return []
  }

  try {
    console.log(`Searching for tracks: "${query}"`)
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error ${response.status}:`, errorData)
      throw new Error(`${response.status}: ${errorData.error || "Unknown error"}`)
    }

    const data: SpotifySearchResponse = await response.json()
    return data.tracks?.items || []
  } catch (error) {
    console.error("Failed to search Spotify tracks:", error)
    throw error
  }
}

// Function to search artists on Spotify
export async function searchSpotifyArtists(query: string): Promise<SpotifyArtist[]> {
  if (!query || query.length < 2) {
    return []
  }

  try {
    console.log(`Searching for artists: "${query}"`)
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=artist`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error ${response.status}:`, errorData)
      throw new Error(`${response.status}: ${errorData.error || "Unknown error"}`)
    }

    const data: SpotifySearchResponse = await response.json()
    return data.artists?.items || []
  } catch (error) {
    console.error("Failed to search Spotify artists:", error)
    throw error
  }
}

// Format duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Get the best available image from Spotify images array
export function getBestImage(images: { url: string; height: number; width: number }[], size = 64): string {
  if (!images || images.length === 0) {
    return `/placeholder.svg?height=${size}&width=${size}`
  }

  // Try to find an image close to the requested size
  const sorted = [...images].sort((a, b) => {
    const aDiff = Math.abs((a.height || 300) - size)
    const bDiff = Math.abs((b.height || 300) - size)
    return aDiff - bDiff
  })

  return sorted[0].url
}

// Spotify API credentials from environment variables
const SPOTIFY_CLIENT_ID = "109e5a4514934ed5971bef34134fb90e"
const SPOTIFY_CLIENT_SECRET = "8f885585f4e842af8dc180e375d5cc11"

// Function to get Spotify access token
export async function getSpotifyAccessToken() {
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
