"use client"

import { useState, useEffect } from "react"
import { Check, ListMusic, Share2, Disc } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useCampaign } from "@/contexts/campaign-context"
import { cn } from "@/lib/utils"
import { searchSpotify } from "@/services/api"

export function StrategyType() {
  const { campaignData, updateCampaignData } = useCampaign()
  const [artistSearch, setArtistSearch] = useState("")
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Get artist name for display
  const getArtistName = () => {
    if (campaignData.trackDetails?.primaryArtistName) {
      return campaignData.trackDetails.primaryArtistName
    } else if (campaignData.trackDetails?.artist) {
      // If primaryArtistName is not set but we have artist name
      return campaignData.trackDetails.artist.split(", ")[0] // Get first artist if multiple
    }
    return null
  }

  const artistName = getArtistName()

  // Fetch artists when search query changes
  useEffect(() => {
    if (artistSearch.length < 3 || campaignData.strategyType !== "playlist") {
      return
    }

    const fetchArtists = async () => {
      setIsLoading(true)
      try {
        const results = await searchSpotify(artistSearch, "artist")
        setArtists(results)
      } catch (error) {
        console.error("Error fetching artists:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtists()
  }, [artistSearch, campaignData.strategyType])

  return (
    <div className="space-y-6 mt-4 w-full">
      <div className="space-y-2 w-full">
        <Label className="text-lg font-medium dark:text-zinc-300">Your Promotion Strategy</Label>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
          Select the strategy that best fits your goals and budget
        </p>

        <div className="flex flex-col space-y-4">
          {/* Strategy Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => updateCampaignData({ strategyType: "playlist" })}
              className={cn(
                "flex-1 min-w-[120px] py-3 px-4 rounded-full text-sm font-medium transition-all",
                campaignData.strategyType === "playlist"
                  ? "bg-black text-white dark:bg-indigo-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
              )}
            >
              Playlist Promotion
            </button>
            <button
              onClick={() => updateCampaignData({ strategyType: "artist-branding" })}
              className={cn(
                "flex-1 min-w-[120px] py-3 px-4 rounded-full text-sm font-medium transition-all",
                campaignData.strategyType === "artist-branding"
                  ? "bg-black text-white dark:bg-indigo-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
              )}
            >
              {artistName ? `This is ${artistName}` : "Artist Branding"}
            </button>
            <button
              onClick={() => updateCampaignData({ strategyType: "direct" })}
              className={cn(
                "flex-1 min-w-[120px] py-3 px-4 rounded-full text-sm font-medium transition-all",
                campaignData.strategyType === "direct"
                  ? "bg-black text-white dark:bg-indigo-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
              )}
            >
              Direct Promotion
            </button>
          </div>

          {/* Strategy Details Card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 transition-all animate-fadeIn">
            {campaignData.strategyType === "playlist" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <ListMusic className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg dark:text-white">Playlist Promotion</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Recommended Strategy</p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900 dark:hover:text-green-300">
                    Lower Cost
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  Promote your release in a curated playlist alongside similar artists. This strategy typically results
                  in a lower cost per listener and better targeting.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Lower cost per stream</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Better audience targeting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Long-term growth potential</span>
                  </li>
                </ul>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200 w-full dark:bg-zinc-800 dark:border-zinc-700 mt-4">
                  <p className="text-sm text-black dark:text-zinc-300">
                    Every release you drop gets promoted and added to your own playlist. It updates over time with your
                    music and similar artists — becoming a 24/7 growing asset for all your future releases.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    You're in full control — your playlist is yours to keep, grow, and share.
                  </p>
                </div>
              </div>
            )}

            {campaignData.strategyType === "direct" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Share2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg dark:text-white">Direct Promotion</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Faster Results</p>
                  </div>
                  <Badge className="ml-auto bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900 dark:hover:text-red-300">
                    Higher Cost
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  Promote your release directly to potential listeners. This approach typically delivers faster results
                  but may have a higher cost per listener.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Faster initial results</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Direct artist promotion</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">More control over targeting</span>
                  </li>
                </ul>
              </div>
            )}

            {campaignData.strategyType === "artist-branding" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Disc className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg dark:text-white">
                      {artistName ? `This is ${artistName}` : "Artist Branding Playlist"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Artist-Focused Playlist</p>
                  </div>
                  <Badge className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                    Artist Focus
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  A "This Is" style playlist featuring only your songs. Turn listeners into fans by showcasing your best
                  work.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Dedicated artist showcase</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Higher conversion to fans</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-zinc-300">Multiple streams per listener</span>
                  </li>
                </ul>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200 w-full dark:bg-zinc-800 dark:border-zinc-700 mt-4">
                  <p className="text-sm text-black dark:text-zinc-300">
                    A "This Is" style playlist with only your songs. Think "This Is Taylor Swift" or "Coldplay Radio" –
                    a playlist featuring only your tracks (or mostly yours, with a couple of influences, like a "Eminem
                    & Friends" vibe).
                  </p>
                  <p className="text-sm text-black dark:text-zinc-300 mt-2">
                    The goal is to turn listeners into converts and get the most out of one click. By starting with your
                    best or most recent track, you increase the chances they'll keep listening and stream more of your
                    songs.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                    This approach maximizes streams per listener and builds a stronger artist-fan connection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
