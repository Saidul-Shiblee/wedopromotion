"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useCampaign } from "@/contexts/campaign-context"
import { formatDuration } from "@/lib/spotify"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState, useRef } from "react"

interface CampaignPreviewProps {
  tracks?: any[]
  videos?: any[]
  showReachCardOnly?: boolean
}

export function CampaignPreview({ tracks, videos, showReachCardOnly = false }: CampaignPreviewProps) {
  const { campaignData, activeStep } = useCampaign()
  const { budget, selectedTrack, adTitle, adDescription, genres } = campaignData
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(false)

  // Simulate loading state for better UX
  useEffect(() => {
    // Skip the animation if already mounted once to reduce layout shifts
    if (mountedRef.current) {
      setIsLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    mountedRef.current = true

    return () => clearTimeout(timer)
  }, [])

  // Only show track preview on steps 2, 3, and 4 (not on step 1)
  const showTrackPreview = activeStep !== "choose-track" && selectedTrack && campaignData.trackDetails

  // If showReachCardOnly is true, only render the Reach & Impact Card
  // But don't show it on mobile when on the budget step
  if (showReachCardOnly) {
    // Hide this card on mobile when on the budget step
    if (activeStep === "budget") {
      return null
    }

    return (
      <Card className="border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base dark:text-white">Your Reach & Impact</CardTitle>
          <CardDescription className="text-xs dark:text-zinc-400">
            Based on your daily budget and target audience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-3">
            <Card className="bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
              <CardContent className="p-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-40" />
                  </>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-xs dark:text-zinc-300">Estimated Daily Reach</Label>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {Math.floor(budget * 300).toLocaleString()} - {Math.floor(budget * 870).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
              <CardContent className="p-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-36 mb-2" />
                    <Skeleton className="h-6 w-40" />
                  </>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-xs dark:text-zinc-300">Estimated Daily Playlist Followers</Label>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {Math.floor(budget * 3).toLocaleString()} - {Math.floor(budget * 6).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Track Preview Section */}
      {showTrackPreview && campaignData.trackDetails ? (
        <Card className="border shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center p-4 h-24">
              <Skeleton className="w-16 h-16 rounded-md mr-4" />
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ) : (
            <div className="flex items-center p-4">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={campaignData.trackDetails.imageUrl || "/placeholder.svg?height=64&width=64"}
                  alt={campaignData.trackDetails.name}
                  className="w-16 h-16 object-cover rounded-md"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold dark:text-white truncate">{campaignData.trackDetails.name}</h3>
                <p className="text-gray-600 dark:text-zinc-400 truncate">{campaignData.trackDetails.artist}</p>
                <span className="text-sm text-gray-500 dark:text-zinc-500">
                  {formatDuration(campaignData.trackDetails.duration)}
                </span>
              </div>
            </div>
          )}
        </Card>
      ) : null}

      {/* Reach & Impact Card */}
      <Card className="border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base dark:text-white">Your Reach & Impact</CardTitle>
          <CardDescription className="text-xs dark:text-zinc-400">
            Based on your daily budget and target audience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-3">
            <Card className="bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
              <CardContent className="p-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-40" />
                  </>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-xs dark:text-zinc-300">Estimated Daily Reach</Label>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {Math.floor(budget * 300).toLocaleString()} - {Math.floor(budget * 870).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
              <CardContent className="p-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-36 mb-2" />
                    <Skeleton className="h-6 w-40" />
                  </>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-xs dark:text-zinc-300">Estimated Daily Playlist Followers</Label>
                    <p className="text-lg font-bold text-black dark:text-white">
                      {Math.floor(budget * 3).toLocaleString()} - {Math.floor(budget * 6).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
