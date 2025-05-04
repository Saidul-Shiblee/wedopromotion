"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, BarChart, ListMusic } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CampaignSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get campaign details from URL params
  const trackName = searchParams.get("trackName")
  const artistName = searchParams.get("artistName")
  const imageUrl = searchParams.get("imageUrl")
  const budget = searchParams.get("budget")
  const strategyType = searchParams.get("strategyType")
  const campaignId = searchParams.get("campaignId") || `campaign_${Date.now()}`

  // Format strategy type for display
  const formatStrategyType = (type: string | null) => {
    if (!type) return "Playlist Promotion"

    switch (type) {
      case "playlist":
        return "Playlist Promotion"
      case "artist-branding":
        return "Artist Branding"
      case "direct":
        return "Direct Promotion"
      default:
        return "Playlist Promotion"
    }
  }

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)

    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // If no track name is provided, redirect to campaigns page
  useEffect(() => {
    if (mounted && !trackName && !isLoading) {
      router.push("/dashboard/campaigns")
    }
  }, [mounted, trackName, router, isLoading])

  // Handle close button click
  const handleClose = () => {
    router.push("/dashboard/campaigns")
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header with logo and navigation */}
        <header className="z-10 bg-white dark:bg-zinc-950 py-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Image
                src="https://soundcamps.com/wp-content/uploads/2025/03/Logo_light.svg"
                alt="SoundCampaign"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </div>
        </header>

        {/* Success content */}
        <div className="py-8">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Campaign Successfully Paid!</h1>

            {/* Capacity message (moved here) */}
            <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg max-w-lg mx-auto">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                Unfortunately, we're currently at full capacity, working with 120 artists at the same time.
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                We'll notify you as soon as a spot opens up so we can dedicate our full attention to developing your
                artist profile.
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                If you were charged, a refund will be processed as soon as possible.
              </p>
            </div>
          </div>

          {/* Campaign summary card */}
          <Card className="mb-8 border border-gray-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Track image */}
                <div className="flex-shrink-0">
                  {isLoading ? (
                    <Skeleton className="w-24 h-24 rounded-md" />
                  ) : (
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-800">
                      <img
                        src={imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={trackName || "Track"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Campaign details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Campaign ID: {campaignId}</span>
                  </div>

                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-black dark:text-white mb-1">{trackName || "Your Track"}</h2>
                      <p className="text-gray-600 dark:text-zinc-400 mb-4">{artistName || "Your Artist Name"}</p>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        <ListMusic className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">Strategy</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">{formatStrategyType(strategyType)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        <BarChart className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">Daily Budget</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">${budget || "20"}/day</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
