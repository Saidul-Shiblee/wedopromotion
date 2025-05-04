"use client"

import { Button } from "@/components/ui/button"
import { useCampaign } from "@/contexts/campaign-context"
import { useState } from "react"
import { AlertCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface StepNavigationProps {
  onSubmit?: () => Promise<void>
  isMobileNav?: boolean
}

export function StepNavigation({ onSubmit, isMobileNav = false }: StepNavigationProps) {
  const { activeStep, prevStep, nextStep, isSubmitting, reviewedCampaign, validateCurrentStep } = useCampaign()
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleSubmit = async () => {
    if (!onSubmit) return

    setIsProcessing(true)
    try {
      await onSubmit()
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNextStep = () => {
    // Clear any previous validation errors
    setValidationError(null)

    // Check if the current step is valid
    const isValid = validateCurrentStep()

    if (!isValid) {
      // Set appropriate validation error message based on the current step
      if (activeStep === "choose-track") {
        setValidationError("Please select a track before proceeding")
      } else if (activeStep === "strategy-type") {
        setValidationError("Please select a promotion strategy before proceeding")
      } else if (activeStep === "ad-creation") {
        setValidationError("Please select at least one target country")
      }
      return
    }

    // If valid, proceed to next step
    nextStep()

    // Scroll to top on mobile when changing steps
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className={isMobile ? "mt-0" : "mt-6"}>
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}
      <div className={`${isMobileNav ? "flex" : "hidden sm:flex"} justify-between`}>
        <Button
          type="button"
          onClick={prevStep}
          disabled={activeStep === "choose-track" || isSubmitting || isProcessing}
          className="border-black text-black hover:bg-black hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 flex items-center gap-1"
          variant="outline"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && "Previous"}
        </Button>
        {activeStep === "budget" ? (
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white flex items-center gap-2"
            disabled={!reviewedCampaign || isSubmitting || isProcessing}
            size={isMobile ? "sm" : "default"}
          >
            {isSubmitting || isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isMobile ? "Creating..." : "Creating Campaign..."}</span>
              </>
            ) : (
              <>
                <span>Launch Campaign</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNextStep}
            className="bg-black hover:bg-black/90 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 flex items-center gap-1"
            disabled={isProcessing}
            size={isMobile ? "sm" : "default"}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isMobile ? "Next" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
