"use client"

import type React from "react"
import type { SpotifyTrack, SpotifyArtist } from "@/types/spotify"

import { useState, useEffect, useCallback, useRef } from "react"
import { Check, X, ChevronDown, ChevronRight, Search, Loader2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCampaign } from "@/contexts/campaign-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { searchSpotifyTracks, searchSpotifyArtists, formatDuration, getBestImage } from "@/lib/spotify"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Genre categories and options
const genreCategories = [
  {
    name: "Dance / Electronic",
    genres: [
      { value: "afro-house", label: "Afro House" },
      { value: "bass", label: "Bass" },
      { value: "bass-house", label: "Bass House" },
      { value: "breaks", label: "Breaks" },
      { value: "chill-out", label: "Chill Out" },
      { value: "deep-house", label: "Deep House" },
      { value: "drum-and-bass", label: "Drum & Bass" },
      { value: "dubstep", label: "Dubstep" },
      { value: "electro-house", label: "Electro House" },
      { value: "electronica", label: "Electronica" },
      { value: "future-house", label: "Future House" },
      { value: "glitch-hop", label: "Glitch Hop" },
      { value: "hard-dance", label: "Hard Dance" },
      { value: "hardcore-hard-techno", label: "Hardcore / Hard Techno" },
      { value: "house", label: "House" },
      { value: "indie-dance-nu-disco", label: "Indie Dance / Nu Disco" },
      { value: "progressive-house", label: "Progressive House" },
      { value: "psy-trance", label: "Psy Trance" },
      { value: "tech-house", label: "Tech House" },
      { value: "techno", label: "Techno" },
      { value: "trance", label: "Trance" },
      { value: "trap", label: "Trap" },
      { value: "trip-hop", label: "Trip-Hop" },
    ],
  },
  {
    name: "Hip-Hop / R&B",
    genres: [
      { value: "r-and-b", label: "R&B" },
      { value: "disco", label: "Disco" },
      { value: "funk", label: "Funk" },
      { value: "hip-hop", label: "Hip-Hop" },
      { value: "rap", label: "Rap" },
      { value: "soul", label: "Soul" },
    ],
  },
  {
    name: "Pop / Rock",
    genres: [
      { value: "acoustic", label: "Acoustic" },
      { value: "alternative", label: "Alternative" },
      { value: "pop", label: "Pop" },
      { value: "country", label: "Country" },
      { value: "folk", label: "Folk" },
      { value: "indie", label: "Indie" },
      { value: "k-pop", label: "K-Pop" },
      { value: "metal", label: "Metal" },
      { value: "punk", label: "Punk" },
      { value: "rock", label: "Rock" },
      { value: "singer-songwriter", label: "Singer Songwriter" },
      { value: "world", label: "World" },
    ],
  },
  {
    name: "Other",
    genres: [
      { value: "blues", label: "Blues" },
      { value: "christian", label: "Christian" },
      { value: "classical", label: "Classical" },
      { value: "dancehall", label: "Dancehall" },
      { value: "dub", label: "Dub" },
      { value: "gospel", label: "Gospel" },
      { value: "jazz", label: "Jazz" },
      { value: "latin", label: "Latin" },
      { value: "reggae", label: "Reggae" },
      { value: "reggaeton", label: "Reggaeton" },
      { value: "other", label: "Other" },
    ],
  },
]

// Flatten genres for searching
const allGenres = genreCategories.flatMap((category) => category.genres)

export function TrackSelector() {
  const { campaignData, updateCampaignData } = useCampaign()
  const [trackSearch, setTrackSearch] = useState("")
  const [genreSearch, setGenreSearch] = useState("")
  const [artistSearch, setArtistSearch] = useState("")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isGenrePopoverOpen, setIsGenrePopoverOpen] = useState(false)
  const [isArtistPopoverOpen, setIsArtistPopoverOpen] = useState(false)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [isLoadingTracks, setIsLoadingTracks] = useState(false)
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Dance / Electronic"])
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null)
  const [filteredGenres, setFilteredGenres] = useState<
    {
      value: string
      label: string
    }[]
  >([])

  // Add a new state to track which artist is the user
  const [showArtistSelector, setShowArtistSelector] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  // Debounce search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add state for artist images
  const [artistImages, setArtistImages] = useState<{ [artistId: string]: string | null }>({})

  // Function to fetch artist image
  const fetchArtistImage = useCallback(async (artistId: string) => {
    try {
      const response = await fetch(`/api/spotify/artist?id=${artistId}`)
      const data = await response.json()
      if (data.images && data.images.length > 0) {
        return getBestImage(data.images, 60)
      }
      return null
    } catch (error) {
      console.error("Error fetching artist image:", error)
      return null
    }
  }, [])

  // Fetch tracks when search query changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (trackSearch.length < 3) {
      setTracks([])
      return
    }

    // Use a longer delay to ensure typing isn't interrupted
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoadingTracks(true)
      try {
        const results = await searchSpotifyTracks(trackSearch)
        setTracks(results)
      } catch (error) {
        console.error("Error fetching tracks:", error)
        toast({
          title: "Search Error",
          description: "Unable to search Spotify tracks. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTracks(false)
      }
    }, 600) // Increased delay to allow for uninterrupted typing

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [trackSearch])

  // Fetch artists when search query changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (artistSearch.length < 3) {
      setArtists([])
      return
    }

    // Use a longer delay to ensure typing isn't interrupted
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoadingArtists(true)
      try {
        const results = await searchSpotifyArtists(artistSearch)
        setArtists(results)
      } catch (error) {
        console.error("Error fetching artists:", error)
        toast({
          title: "Search Error",
          description: "Unable to search Spotify artists. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingArtists(false)
      }
    }, 600) // Increased delay to allow for uninterrupted typing

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [artistSearch])

  // Modify the handleTrackSelect function to check for multiple artists
  const handleTrackSelect = (track: SpotifyTrack) => {
    setSelectedTrack(track)

    // Check if the track has multiple artists
    if (track.artists.length > 1) {
      setShowArtistSelector(true)
      // Don't update campaign data yet, wait for artist selection
    } else {
      // Single artist, proceed as normal
      updateCampaignData({
        selectedTrack: track.id,
        // Store additional track data in the context
        trackDetails: {
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          artistId: track.artists[0].id, // Store the artist ID for single artist
          imageUrl: getBestImage(track.album.images, 120),
          albumName: track.album.name,
          duration: track.duration_ms,
          releaseDate: track.album.release_date,
          spotifyUrl: track.external_urls.spotify,
        },
      })
      setTrackSearch("")
      setIsPopoverOpen(false)
    }
  }

  // Add a new function to handle artist selection
  const handleArtistIdentitySelect = async (artistId: string) => {
    if (!selectedTrack) return

    const selectedArtist = selectedTrack.artists.find((a) => a.id === artistId)
    if (!selectedArtist) return

    setSelectedArtistId(artistId)

    // Fetch artist image
    const imageUrl = await fetchArtistImage(artistId)
    setArtistImages((prevImages) => ({ ...prevImages, [artistId]: imageUrl }))

    updateCampaignData({
      selectedTrack: selectedTrack.id,
      // Store additional track data in the context with the selected artist
      trackDetails: {
        id: selectedTrack.id,
        name: selectedTrack.name,
        artist: selectedTrack.artists.map((a) => a.name).join(", "),
        artistId: artistId, // Store the selected artist ID
        primaryArtistName: selectedArtist.name, // Store the primary artist name
        imageUrl: getBestImage(selectedTrack.album.images, 120),
        albumName: selectedTrack.album.name,
        duration: selectedTrack.duration_ms,
        releaseDate: selectedTrack.album.release_date,
        spotifyUrl: selectedTrack.external_urls.spotify,
      },
    })

    setShowArtistSelector(false)
    setTrackSearch("")
    setIsPopoverOpen(false)
  }

  // Handle artist selection
  const handleArtistSelect = useCallback(
    (artist: SpotifyArtist) => {
      // Check if artist is already selected
      const artistExists = campaignData.similarArtists.some((a) =>
        typeof a === "string" ? a === artist.id : a.id === artist.id,
      )

      if (artistExists) {
        // Remove artist if already selected
        updateCampaignData({
          similarArtists: campaignData.similarArtists.filter((a) =>
            typeof a === "string" ? a !== artist.id : a.id !== artist.id,
          ),
        })
      } else {
        // Add artist if not already selected
        updateCampaignData({
          similarArtists: [
            ...campaignData.similarArtists,
            {
              id: artist.id,
              name: artist.name,
              imageUrl: artist.images ? getBestImage(artist.images, 40) : undefined,
            },
          ],
        })
      }
    },
    [campaignData.similarArtists, updateCampaignData],
  )

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  // Handle genre search input change
  const handleGenreSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setGenreSearch(value)

      // Only open popover when we have content to show
      if (value.trim().length > 0 && !isGenrePopoverOpen) {
        setIsGenrePopoverOpen(true)
      }
    },
    [isGenrePopoverOpen],
  )

  // Handle track search input change
  const handleTrackSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTrackSearch(value)

      // Open popover when user starts typing and has at least 3 characters
      if (value.length >= 3 && !isPopoverOpen) {
        setIsPopoverOpen(true)
      } else if (value.length === 0) {
        // Close popover only if the field is completely empty
        setIsPopoverOpen(false)
      }
    },
    [isPopoverOpen],
  )

  // Handle artist search input change
  const handleArtistSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setArtistSearch(value)

      // Open popover when user starts typing and has at least 3 characters
      if (value.length >= 3 && !isArtistPopoverOpen) {
        setIsArtistPopoverOpen(true)
      } else if (value.length === 0) {
        // Close popover only if the field is completely empty
        setIsArtistPopoverOpen(false)
      }
    },
    [isArtistPopoverOpen],
  )

  // Filter genres based on search input - optimized with useMemo
  useEffect(() => {
    if (genreSearch.trim()) {
      const searchTerm = genreSearch.toLowerCase().trim()
      setFilteredGenres(allGenres.filter((genre) => genre.label.toLowerCase().includes(searchTerm)))
    } else {
      // Don't clear filtered genres when search is empty
      setFilteredGenres([])
    }
  }, [genreSearch])

  // Handle genre selection with optimized logic
  const handleGenreSelect = useCallback(
    (genreValue: string) => {
      updateCampaignData({
        genres: campaignData.genres.includes(genreValue)
          ? campaignData.genres.filter((g) => g !== genreValue)
          : campaignData.genres.length < 3
            ? [...campaignData.genres, genreValue]
            : campaignData.genres,
      })

      // Only clear search if adding a new genre and not at max limit
      if (!campaignData.genres.includes(genreValue) && campaignData.genres.length < 3) {
        setGenreSearch("")
        setIsGenrePopoverOpen(false)
      }
    },
    [campaignData.genres, updateCampaignData],
  )

  // Handle popover state for genre search
  const handleGenrePopoverChange = useCallback((open: boolean) => {
    // Only allow closing the popover, not opening it (that's handled by typing)
    if (!open) {
      setIsGenrePopoverOpen(false)
      // Don't clear the search when closing if we want to keep the popover open
      // setGenreSearch("")
    }
  }, [])

  // Handle popover state for track search
  const handleTrackPopoverChange = useCallback((open: boolean) => {
    // Only allow closing the popover, not opening it (that's handled by typing)
    if (!open) {
      setIsPopoverOpen(false)
    }
  }, [])

  // Handle popover state for artist search
  const handleArtistPopoverChange = useCallback((open: boolean) => {
    // Only allow closing the popover, not opening it (that's handled by typing)
    if (!open) {
      setIsArtistPopoverOpen(false)
    }
  }, [])

  // Check if artist is selected
  const isArtistSelected = useCallback(
    (artistId: string) => {
      return campaignData.similarArtists.some((a) => (typeof a === "string" ? a === artistId : a.id === artistId))
    },
    [campaignData.similarArtists],
  )

  // Remove artist from selection
  const removeArtist = useCallback(
    (artistId: string) => {
      updateCampaignData({
        similarArtists: campaignData.similarArtists.filter((a) =>
          typeof a === "string" ? a !== artistId : a.id !== artistId,
        ),
      })
    },
    [campaignData.similarArtists, updateCampaignData],
  )

  // Get artist name from selection
  const getArtistName = useCallback(
    (artist: string | { id: string; name: string; imageUrl?: string }) => {
      if (typeof artist === "string") {
        // Try to find in current artists list
        const foundArtist = artists.find((a) => a.id === artist)
        return foundArtist ? foundArtist.name : artist
      }
      return artist.name
    },
    [artists],
  )

  // In the TrackSelector component, add this new function after the other handler functions:
  const inputRef = useRef<HTMLInputElement>(null)
  // Add this new ref for the artist input field
  const artistInputRef = useRef<HTMLInputElement>(null)
  // Add this new ref for the genre input field
  const genreInputRef = useRef<HTMLInputElement>(null)

  // Add this effect to fetch artist images when the dialog opens
  useEffect(() => {
    if (showArtistSelector && selectedTrack) {
      // Fetch images for all artists in the track
      selectedTrack.artists.forEach(async (artist) => {
        try {
          const response = await fetch(`/api/spotify/artist?id=${artist.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.images && data.images.length > 0) {
              setArtistImages((prev) => ({
                ...prev,
                [artist.id]: getBestImage(data.images, 60),
              }))
            }
          }
        } catch (error) {
          console.error(`Error fetching image for artist ${artist.id}:`, error)
        }
      })
    }
  }, [showArtistSelector, selectedTrack])

  return (
    <div className="space-y-4 mt-4 w-full">
      {/* Display selected track if one is selected */}
      {campaignData.selectedTrack && campaignData.trackDetails && (
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
              <img
                src={campaignData.trackDetails.imageUrl || "/placeholder.svg?height=48&width=48"}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium dark:text-zinc-300">{campaignData.trackDetails.name}</p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{campaignData.trackDetails.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              onClick={() => updateCampaignData({ selectedTrack: null, trackDetails: null })}
            >
              Change
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={showArtistSelector && !!selectedTrack}
        onOpenChange={(open) => {
          if (!open) setShowArtistSelector(false)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Which artist are you in this track?</DialogTitle>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
              This helps us focus your campaign on the right artist profile.
            </p>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedTrack?.artists.map((artist) => {
              const artistImage = artistImages[artist.id]

              return (
                <div
                  key={artist.id}
                  onClick={() => handleArtistIdentitySelect(artist.id)}
                  className={`flex items-center gap-4 p-3 rounded-md cursor-pointer ${
                    selectedArtistId === artist.id
                      ? "bg-black text-white dark:bg-indigo-600"
                      : "hover:bg-gray-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {artistImage ? (
                      <img
                        src={artistImage || "/placeholder.svg"}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${selectedArtistId === artist.id ? "text-white" : "dark:text-zinc-300"}`}
                    >
                      {artist.name}
                    </p>
                  </div>
                  {selectedArtistId === artist.id && <Check className="h-5 w-5 text-white" />}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Show track selection only if no track is selected or user is changing */}
      {!campaignData.selectedTrack && (
        <>
          <div className="space-y-2 w-full">
            <Label htmlFor="track-search" className="dark:text-zinc-300">
              Spotify Track
            </Label>
            {/* Update the Popover component for track search */}
            <Popover
              open={isPopoverOpen}
              onOpenChange={(open) => {
                // Only allow closing the popover, not toggling it
                if (!open) {
                  setIsPopoverOpen(false)
                }
              }}
            >
              <PopoverTrigger asChild>
                <div
                  className="relative w-full"
                  onClick={(e) => {
                    // Prevent the popover from toggling when clicking the input
                    e.preventDefault()

                    // If we have 3+ characters and popover is closed, open it
                    if (trackSearch.length >= 3 && !isPopoverOpen) {
                      setIsPopoverOpen(true)
                    }

                    // Focus the input
                    inputRef.current?.focus()
                  }}
                >
                  <Input
                    ref={inputRef}
                    id="track-search"
                    value={trackSearch}
                    onChange={(e) => {
                      setTrackSearch(e.target.value)
                      // Open popover when user has at least 3 characters, but don't interrupt typing
                      if (e.target.value.length >= 3) {
                        // Use setTimeout with 0ms to ensure the UI updates after the current event loop
                        setTimeout(() => {
                          setIsPopoverOpen(true)
                        }, 0)
                      } else if (e.target.value.length === 0) {
                        setIsPopoverOpen(false)
                      }
                    }}
                    onFocus={() => {
                      // Open popover on focus if we have 3+ characters
                      if (trackSearch.length >= 3) {
                        setIsPopoverOpen(true)
                      }
                    }}
                    placeholder="Type your track name"
                    className="w-full border-gray-200 focus:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 border-gray-200 shadow-md dark:border-zinc-700"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                {isLoadingTracks ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching tracks...
                  </div>
                ) : tracks && tracks.length > 0 ? (
                  <div className="max-h-[320px] overflow-auto py-1 w-full">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className="h-10 w-10 rounded bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                          <img
                            src={getBestImage(track.album.images, 40) || "/placeholder.svg"}
                            alt={track.album.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate dark:text-zinc-300">{track.name}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            {track.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-xs text-gray-500 dark:text-zinc-400 mr-2">
                            {formatDuration(track.duration_ms)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trackSearch.length >= 3 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">No tracks found</div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                    Type at least 3 characters to search
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}

      {/* Similar Artists Selection */}
      <div className="space-y-2 w-full">
        <Label htmlFor="artist-search" className="dark:text-zinc-300">
          What are the similar artists it sounds like?
        </Label>
        {/* Update the Popover component for artist search */}
        <Popover
          open={isArtistPopoverOpen}
          onOpenChange={(open) => {
            // Only allow closing the popover, not toggling it
            if (!open) {
              setIsArtistPopoverOpen(false)
            }
          }}
        >
          <PopoverTrigger asChild>
            <div
              className="relative w-full"
              onClick={(e) => {
                // Prevent the popover from toggling when clicking the input
                e.preventDefault()

                // If we have 3+ characters and popover is closed, open it
                if (artistSearch.length >= 3 && !isArtistPopoverOpen) {
                  setIsArtistPopoverOpen(true)
                }

                // Focus the input
                artistInputRef.current?.focus()
              }}
            >
              <Input
                ref={artistInputRef}
                id="artist-search"
                value={artistSearch}
                onChange={(e) => {
                  setArtistSearch(e.target.value)
                  // Open popover when user has at least 3 characters, but don't interrupt typing
                  if (e.target.value.length >= 3) {
                    // Use setTimeout with 0ms to ensure the UI updates after the current event loop
                    setTimeout(() => {
                      setIsArtistPopoverOpen(true)
                    }, 0)
                  } else if (e.target.value.length === 0) {
                    setIsArtistPopoverOpen(false)
                  }
                }}
                onFocus={() => {
                  // Open popover on focus if we have 3+ characters
                  if (artistSearch.length >= 3) {
                    setIsArtistPopoverOpen(true)
                  }
                }}
                placeholder="Type artist name"
                className="w-full border-gray-200 focus:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500"
                autoComplete="off"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 border-gray-200 shadow-md dark:border-zinc-700"
            align="start"
            style={{ width: "var(--radix-popover-trigger-width)" }}
            sideOffset={5}
          >
            <div className="max-h-[320px] overflow-auto">
              {isLoadingArtists ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching artists...
                </div>
              ) : artists.length > 0 ? (
                <div className="py-1">
                  {artists.map((artist) => (
                    <div
                      key={artist.id}
                      className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer ${
                        isArtistSelected(artist.id) ? "bg-gray-50 dark:bg-zinc-800" : ""
                      }`}
                      onClick={() => handleArtistSelect(artist)}
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                        <img
                          src={artist.images ? getBestImage(artist.images, 40) : "/placeholder.svg?height=40&width=40"}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate dark:text-zinc-300">
                          {highlightMatch(artist.name, artistSearch)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Artist</p>
                      </div>
                      {isArtistSelected(artist.id) && <Check className="h-4 w-4 text-green-500 dark:text-green-400" />}
                    </div>
                  ))}
                </div>
              ) : artistSearch.length >= 3 ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                  No artists found matching "{artistSearch}"
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                  Type at least 3 characters to search
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Display selected artists */}
        {campaignData.similarArtists.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {campaignData.similarArtists.map((artist, index) => (
              <Badge
                key={typeof artist === "string" ? artist : artist.id}
                variant="outline"
                className="bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              >
                {getArtistName(artist)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  onClick={() => removeArtist(typeof artist === "string" ? artist : artist.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Genres selection */}
      <div className="space-y-2">
        <Label htmlFor="genre-search" className="dark:text-zinc-300">
          Genres (up to 3)
        </Label>
        {/* Update the Popover component for genre search */}
        <Popover
          open={isGenrePopoverOpen}
          onOpenChange={(open) => {
            // Allow both opening and closing the popover
            setIsGenrePopoverOpen(open)
            if (!open) {
              setGenreSearch("")
            }
          }}
        >
          <PopoverTrigger asChild>
            <div
              className="relative w-full"
              onClick={(e) => {
                // Prevent the popover from toggling when clicking the input
                e.preventDefault()

                // Toggle the popover when clicking the container
                setIsGenrePopoverOpen(!isGenrePopoverOpen)

                // Focus the input
                genreInputRef.current?.focus()
              }}
            >
              <Input
                ref={genreInputRef}
                id="genre-search"
                value={genreSearch}
                onChange={(e) => {
                  const value = e.target.value
                  setGenreSearch(value)
                }}
                onFocus={() => {
                  // Always open popover on focus to show categories
                  setIsGenrePopoverOpen(true)
                }}
                placeholder="Search for genres"
                className="w-full border-gray-200 focus:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 pl-9"
                autoComplete="off"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 border-gray-200 shadow-md dark:border-zinc-700"
            align="start"
            style={{ width: "var(--radix-popover-trigger-width)" }}
            sideOffset={5}
          >
            <div className="max-h-[320px] overflow-auto">
              {genreSearch.trim() ? (
                // Show filtered results when searching
                <div className="py-1">
                  {filteredGenres.length > 0 ? (
                    filteredGenres.map((genre) => (
                      <div
                        key={genre.value}
                        className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer ${
                          campaignData.genres.includes(genre.value) ? "bg-gray-50 dark:bg-zinc-800" : ""
                        }`}
                        onClick={() => handleGenreSelect(genre.value)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate dark:text-zinc-300">
                            {/* Highlight matching text */}
                            {highlightMatch(genre.label, genreSearch)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">Genre</p>
                        </div>
                        {campaignData.genres.includes(genre.value) && (
                          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                      No genres found matching "{genreSearch}"
                    </div>
                  )}
                </div>
              ) : (
                // Always show categorized genres when not searching
                <div>
                  {genreCategories.map((category) => (
                    <Collapsible
                      key={category.name}
                      open={expandedCategories.includes(category.name)}
                      onOpenChange={() => toggleCategory(category.name)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <span className="font-medium text-sm dark:text-zinc-300">{category.name}</span>
                        {expandedCategories.includes(category.name) ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {category.genres.map((genre) => (
                          <div
                            key={genre.value}
                            className={`flex items-center gap-3 px-3 py-2 pl-6 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer ${
                              campaignData.genres.includes(genre.value) ? "bg-gray-50 dark:bg-zinc-800" : ""
                            }`}
                            onClick={() => handleGenreSelect(genre.value)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate dark:text-zinc-300">{genre.label}</p>
                            </div>
                            {campaignData.genres.includes(genre.value) && (
                              <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                            )}
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {campaignData.genres.map((genreValue) => {
            const genre = allGenres.find((g) => g.value === genreValue)
            return (
              <Badge
                key={genreValue}
                variant="outline"
                className="bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              >
                {genre?.label || genreValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  onClick={() =>
                    updateCampaignData({
                      genres: campaignData.genres.filter((g) => g !== genreValue),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
        {campaignData.genres.length >= 3 && (
          <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">Maximum of 3 genres reached</p>
        )}
      </div>
    </div>
  )
}

// Helper function to highlight matching text in search results
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.trim()})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 dark:bg-yellow-900 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
