// Spotify API response types
export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyArtist {
  id: string
  name: string
  uri: string
  href: string
  external_urls: {
    spotify: string
  }
  images?: SpotifyImage[]
}

export interface SpotifyAlbum {
  id: string
  name: string
  uri: string
  images: SpotifyImage[]
  release_date: string
  artists: SpotifyArtist[]
}

export interface SpotifyTrack {
  id: string
  name: string
  uri: string
  href: string
  duration_ms: number
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  popularity: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
    href: string
    next: string | null
    previous: string | null
  }
  artists?: {
    items: SpotifyArtist[]
    total: number
    limit: number
    offset: number
    href: string
    next: string | null
    previous: string | null
  }
}
