"use client"

import { useTransition, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

import { CampaignProvider, useCampaign } from "@/contexts/campaign-context"
import { StepIndicator } from "@/components/campaign/step-indicator"
import { StepNavigation } from "@/components/campaign/step-navigation"
import { CampaignPreview } from "@/components/campaign/campaign-preview"
import { TrackSelector } from "@/components/campaign/steps/track-selector"
import { AdCreator } from "@/components/campaign/steps/ad-creator"
import { BudgetPlanner } from "@/components/campaign/steps/budget-planner"
import { StrategyType } from "@/components/campaign/steps/strategy-type"

// Define the steps for the campaign creation process
const CAMPAIGN_STEPS = [
  { id: "choose-track", label: "Choose Track" },
  { id: "strategy-type", label: "Strategy Type" },
  { id: "ad-creation", label: "Ad Settings" },
  { id: "budget", label: "Budget & Payment" },
]

// Webhook URL for campaign data submission
// In a production environment, this should come from environment variables
const WEBHOOK_URL = "https://hook.eu1.make.com/1idpoguninj5mf726khtabetwx9mgnay"

// Add error handling for ResizeObserver loop error
if (typeof window !== "undefined") {
  const originalErrorHandler = window.onerror
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    // Check if the error is a ResizeObserver loop error
    if (
      msg.toString().includes("ResizeObserver loop") ||
      (error && error.message && error.message.includes("ResizeObserver loop"))
    ) {
      // Just return true to prevent the error from being logged to the console
      return true
    }

    // Check if it's a Script error from GTM or other third-party scripts
    if (msg === "Script error." && !url && !lineNo && !columnNo) {
      console.warn("Third-party script error detected. This is often normal behavior.")
      return true
    }

    // Call the original error handler for other errors
    return originalErrorHandler ? originalErrorHandler(msg, url, lineNo, columnNo, error) : false
  }
}

// Main component wrapper with providers
export default function CreateCampaignPage() {
  return (
    <CampaignProvider>
      <CreateCampaignContent />
    </CampaignProvider>
  )
}

// Main content component that uses the campaign context
function CreateCampaignContent() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { activeStep, campaignData, isSubmitting, setIsSubmitting } = useCampaign()
  const [showPreview, setShowPreview] = useState(false)
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const [mounted, setMounted] = useState(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [stableHeight, setStableHeight] = useState<string>("auto")

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)

    // Add a debounced resize handler to help with ResizeObserver issues
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      resizeTimeoutRef.current = setTimeout(() => {
        // Force a small layout shift to break potential resize loops
        setStableHeight("auto")

        // After a small delay, restore normal layout
        setTimeout(() => {
          setStableHeight("auto")
        }, 50)
      }, 200)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [])

  // Update the sendToWebhook function to use the Make.com webhook URL directly
  const sendToWebhook = async (campaignData: any, paymentData: any) => {
    try {
      const campaignId = `campaign_${Date.now()}`

      // Prepare the payload with all campaign settings and payment info
      const payload = {
        id: campaignId,
        createdAt: new Date().toISOString(),
        trackDetails: campaignData.trackDetails,
        strategyType: campaignData.strategyType,
        adSettings: {
          title: campaignData.adTitle,
          description: campaignData.adDescription,
          style: campaignData.adStyle,
          targetCountries: campaignData.targetCountries,
          selectedVideo: campaignData.selectedVideo,
          selectedTopAds: campaignData.selectedTopAds,
        },
        budget: campaignData.budget,
        genres: campaignData.genres,
        selectedArtists: campaignData.selectedArtists,
        payment: {
          paymentMethodId: campaignData.paymentMethodId,
          customerId: campaignData.customerId,
          chargeId: paymentData.paymentIntentId,
          amount: campaignData.budget,
          status: "succeeded",
        },
      }

      // Send the data directly to the Make.com webhook
      console.log("Sending campaign data to webhook:", WEBHOOK_URL)
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error(`Webhook error: ${response.status}`)
      } else {
        console.log("Webhook response status:", response.status)
      }

      return campaignId
    } catch (error) {
      console.error("Failed to send data to webhook:", error)
      // We don't throw the error here to avoid blocking the user flow
      // Just log it and continue
      return `campaign_${Date.now()}`
    }
  }

  // Handle campaign submission
  const handleSubmit = async () => {
    if (!campaignData.paymentMethodId) {
      toast({
        title: "Payment method required",
        description: "Please add a payment method before launching your campaign",
        variant: "destructive",
      })
      return
    }

    // Check if we have a customer ID
    if (!campaignData.customerId) {
      toast({
        title: "Customer information missing",
        description: "Please try adding your payment method again",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create a charge for the campaign launch
      const chargeResponse = await fetch("/api/stripe/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: campaignData.paymentMethodId,
          customerId: campaignData.customerId, // Use the stored customer ID
          amount: campaignData.budget, // Charge the daily budget amount
          description: `Campaign launch for ${campaignData.trackDetails?.name || "unknown track"}`,
          campaignId: `campaign_${Date.now()}`, // Generate a campaign ID
        }),
      })

      const chargeData = await chargeResponse.json()

      if (!chargeData.success) {
        throw new Error(chargeData.error || "Failed to process payment")
      }

      // Send campaign data to webhook
      const campaignId = await sendToWebhook(campaignData, chargeData)

      // Simulate API call to create campaign with payment method
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Campaign launched successfully!",
        description: "Your campaign is now active and will begin running ads",
      })

      // Navigate to the thank you page with campaign details
      startTransition(() => {
        // Construct URL with campaign details
        const params = new URLSearchParams({
          trackName: campaignData.trackDetails?.name || "",
          artistName: campaignData.trackDetails?.artist || "",
          imageUrl: campaignData.trackDetails?.imageUrl || "",
          budget: campaignData.budget.toString(),
          strategyType: campaignData.strategyType || "playlist",
          campaignId: campaignId,
        })

        router.push(`/campaign-success?${params.toString()}`)
      })
    } catch (error) {
      console.error("Failed to create campaign:", error)
      toast({
        title: "Failed to launch campaign",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle close button click
  const handleClose = () => {
    router.push("/dashboard/campaigns")
  }

  // Toggle preview panel on mobile
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with logo and navigation */}
        <header className="z-10 bg-white dark:bg-zinc-950 py-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 pl-0 md:pl-0">
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
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hidden md:flex rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <X className="h-5 w-5 dark:text-zinc-300" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold text-black dark:text-white">Create New Campaign</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Set up your track promotion campaign</p>
          </div>
        </header>

        {/* Step indicator - always visible */}
        <div className="py-4">
          <StepIndicator activeStep={activeStep} steps={CAMPAIGN_STEPS} />
        </div>

        {/* Mobile preview panel (conditionally rendered) */}
        {isMobile && showPreview && (
          <div className="mb-6 animate-fadeIn">
            <CampaignPreview />
          </div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-12" style={{ minHeight: stableHeight }}>
          {/* Main form area */}
          <div className="lg:col-span-2">
            <Card className="bg-white border shadow-sm dark:bg-zinc-900 dark:border-zinc-800 w-full">
              <CardContent className="p-4 sm:p-6">
                {/* Step content */}
                {activeStep === "choose-track" && <TrackSelector />}
                {activeStep === "strategy-type" && <StrategyType />}
                {activeStep === "ad-creation" && <AdCreator />}
                {activeStep === "budget" && <BudgetPlanner />}

                {/* Navigation buttons */}
                <StepNavigation onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </div>

          {/* Always visible Reach & Impact card on mobile - moved below the main form */}
          {isMobile && !showPreview && (
            <div className="mt-6 mb-6 lg:hidden">
              <CampaignPreview showReachCardOnly={true} />
            </div>
          )}

          {/* Desktop preview panel */}
          {!isMobile && (
            <div className="hidden lg:block space-y-6 sticky top-24 self-start">
              <CampaignPreview />
            </div>
          )}
        </div>

        {/* Fixed bottom navigation for mobile */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 p-4 z-20">
            <StepNavigation onSubmit={handleSubmit} isMobileNav={true} />
          </div>
        )}
      </div>
    </div>
  )
}
