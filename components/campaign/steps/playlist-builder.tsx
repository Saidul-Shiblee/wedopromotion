"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCampaign } from "@/contexts/campaign-context"

// Mock function to simulate Spotify API calls
const searchSpotify = async (query: string, type: "artist" | "track") => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${type}-${i}`,
    name: `${query} ${type} ${i + 1}`,
  }))
}

export function PlaylistBuilder() {
  const { campaignData, updateCampaignData } = useCampaign()
  const [artistSearch, setArtistSearch] = useState("")

  const { data: artists, isLoading: isLoadingArtists } = useQuery({
    queryKey: ["artists", artistSearch],
    queryFn: () => searchSpotify(artistSearch, "artist"),
    enabled: artistSearch.length > 2,
  })

  return (
    <div className="space-y-6 mt-4 w-full">
      <div className="space-y-2 w-full">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200 w-full dark:bg-zinc-800 dark:border-zinc-700">
          <p className="text-sm text-black dark:text-zinc-300">
            Every track you promote with us will be saved and assigned to one of our A&Rs. Your dedicated playlist will
            be built and updated over time to feature your music alongside relevant artists.
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            Your playlist will also be used for your future releases, helping you grow long-term.
          </p>
        </div>
      </div>
      <div className="space-y-2 w-full">
        <Label htmlFor="artist-search" className="dark:text-zinc-300">
          Which artists inspire your music?
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                id="artist-search"
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                placeholder="Type to find artists similar to your style"
                className="w-full border-gray-200 focus:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-gray-200 shadow-md dark:border-zinc-700" align="start">
            {isLoadingArtists ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">Searching...</div>
            ) : artists && artists.length > 0 ? (
              <div className="max-h-[320px] overflow-auto py-1">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                    onClick={() => {
                      updateCampaignData({
                        selectedArtists: campaignData.selectedArtists.includes(artist.id)
                          ? campaignData.selectedArtists.filter((id) => id !== artist.id)
                          : [...campaignData.selectedArtists, artist.id],
                      })
                    }}
                  >
                    <div className="h-10 w-10 rounded bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                      <img src="/placeholder.svg?height=40&width=40" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate dark:text-zinc-300">{artist.name}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">Artist</p>
                    </div>
                    {campaignData.selectedArtists.includes(artist.id) && (
                      <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                ))}
              </div>
            ) : artistSearch.length > 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">No artists found</div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">Type to search for artists</div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
