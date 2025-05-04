"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define types for our campaign data
export type CampaignStep = "choose-track" | "strategy-type" | "ad-creation" | "budget"

// Track details type
export type TrackDetails = {
  id: string
  name: string
  artist: string
  artistId?: string
  primaryArtistName?: string
  imageUrl: string
  albumName: string
  duration: number
  releaseDate: string
  spotifyUrl: string
}

// Artist type
export type ArtistInfo = {
  id: string
  name: string
  imageUrl?: string
}

// Update the CampaignData type to include payment information
export type CampaignData = {
  // Track selection
  selectedTrack: string | null
  trackDetails: TrackDetails | null
  similarArtists: (string | ArtistInfo)[]
  // Strategy type
  strategyType: "playlist" | "direct" | "artist-branding" | null
  // Playlist building (now part of strategy)
  genres: string[]
  selectedArtists: string[]
  // Ad creation
  adTitle: string
  adDescription: string
  selectedVideo: string | null
  selectedTopAds: string[]
  adStyle: "ai-generated" | "custom" | null
  targetCountries: string[]
  // Budget
  budget: number
  // Payment
  paymentMethodId?: string | null
  customerId?: string | null
  // Misc
  objective: string
}

type CampaignContextType = {
  // Campaign data
  campaignData: CampaignData
  updateCampaignData: (data: Partial<CampaignData>) => void

  // Step management
  activeStep: CampaignStep
  setActiveStep: (step: CampaignStep) => void
  nextStep: () => void
  prevStep: () => void

  // Form state
  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  reviewedCampaign: boolean
  setReviewedCampaign: (reviewed: boolean) => void

  // Validation
  validateCurrentStep: () => boolean

  // Subscription
  isAnnualBilling: boolean
  setIsAnnualBilling: (isAnnual: boolean) => void
  selectedPlan: string | null
  setSelectedPlan: (plan: string | null) => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: ReactNode }) {
  // Campaign data state
  const [campaignData, setCampaignData] = useState<CampaignData>({
    // Track selection
    selectedTrack: null,
    trackDetails: null,
    similarArtists: [],
    // Strategy type - set default to "playlist"
    strategyType: "playlist",
    // Playlist building
    genres: [],
    selectedArtists: [],
    // Ad creation
    adTitle: "",
    adDescription: "",
    selectedVideo: null,
    selectedTopAds: [],
    adStyle: "ai-generated",
    targetCountries: [],
    // Budget
    budget: 20,
    // Payment
    paymentMethodId: null,
    // Misc
    objective: "stream-growth",
  })

  // Step management
  const [activeStep, setActiveStep] = useState<CampaignStep>("choose-track")

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewedCampaign, setReviewedCampaign] = useState(false)

  // Subscription state
  const [isAnnualBilling, setIsAnnualBilling] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Update campaign data with memoized callback to prevent unnecessary re-renders
  const updateCampaignData = useCallback((data: Partial<CampaignData>) => {
    setCampaignData((prev) => {
      // Check if the data is actually different before updating
      const hasChanges = Object.entries(data).some(([key, value]) => {
        const k = key as keyof CampaignData
        return prev[k] !== value
      })

      if (!hasChanges) {
        return prev // Return the previous state if nothing changed
      }

      return { ...prev, ...data }
    })
  }, [])

  // Step navigation with memoized callbacks
  const nextStep = useCallback(() => {
    setActiveStep((prev) => {
      switch (prev) {
        case "choose-track":
          return "strategy-type"
        case "strategy-type":
          return "ad-creation"
        case "ad-creation":
          return "budget"
        default:
          return prev
      }
    })
  }, [])

  const prevStep = useCallback(() => {
    setActiveStep((prev) => {
      switch (prev) {
        case "strategy-type":
          return "choose-track"
        case "ad-creation":
          return "strategy-type"
        case "budget":
          return "ad-creation"
        default:
          return prev
      }
    })
  }, [])

  // Validation
  const validateCurrentStep = useCallback(() => {
    console.log("Validating step:", activeStep)

    switch (activeStep) {
      case "choose-track":
        return !!campaignData.selectedTrack

      case "strategy-type":
        return !!campaignData.strategyType

      case "ad-creation":
        return Array.isArray(campaignData.targetCountries) && campaignData.targetCountries.length > 0

      case "budget":
        return campaignData.budget >= 5 && reviewedCampaign

      default:
        return true
    }
  }, [
    activeStep,
    campaignData.selectedTrack,
    campaignData.strategyType,
    campaignData.targetCountries,
    campaignData.budget,
    reviewedCampaign,
  ])

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        updateCampaignData,
        activeStep,
        setActiveStep,
        nextStep,
        prevStep,
        isSubmitting,
        setIsSubmitting,
        reviewedCampaign,
        setReviewedCampaign,
        validateCurrentStep,
        isAnnualBilling,
        setIsAnnualBilling,
        selectedPlan,
        setSelectedPlan,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider")
  }
  return context
}
