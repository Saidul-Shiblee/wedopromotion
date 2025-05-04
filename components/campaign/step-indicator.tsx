"use client"

import { Check } from "lucide-react"
import type { CampaignStep } from "@/contexts/campaign-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect, useState } from "react"
import { useCampaign } from "@/contexts/campaign-context"

// Define default steps
const DEFAULT_STEPS = [
  { id: "choose-track", label: "Choose Track" },
  { id: "strategy-type", label: "Strategy Type" },
  { id: "ad-creation", label: "Ad Settings" },
  { id: "budget", label: "Budget & Payment" },
]

interface StepIndicatorProps {
  activeStep?: CampaignStep
  steps?: Array<{
    id: CampaignStep
    label: string
  }>
}

export function StepIndicator({ activeStep: propActiveStep, steps = DEFAULT_STEPS }: StepIndicatorProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [mounted, setMounted] = useState(false)
  const campaignContext = useCampaign()

  // Use activeStep from props if provided, otherwise from context
  const activeStep = propActiveStep || campaignContext.activeStep

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Find the index of the active step
  const activeIndex = steps.findIndex((s) => s.id === activeStep)

  // Calculate progress percentage
  const progressPercentage = activeIndex === 0 ? 0 : Math.round((activeIndex / (steps.length - 1)) * 100)

  // Safety check for valid activeIndex
  const activeStepLabel = activeIndex >= 0 && activeIndex < steps.length ? steps[activeIndex].label : "Current step"

  // If not mounted yet, render a simplified version to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full mb-4 sm:mb-8">
        <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="w-full mb-4 sm:mb-8">
      <div className="relative flex justify-between px-2 sm:px-5">
        {steps.map((step, index) => {
          // When on subscription page, mark all steps as completed
          // Otherwise, a step is completed if its index is less than the active step's index
          const isCompleted = activeStep === "subscription" || index < activeIndex
          const isActive = activeStep === step.id

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                  isActive
                    ? "bg-black text-white border-black dark:bg-indigo-600 dark:border-indigo-600 scale-110"
                    : isCompleted
                      ? "bg-black text-white border-black dark:bg-indigo-600 dark:border-indigo-600"
                      : "bg-white text-gray-500 border-gray-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span className="text-sm sm:text-base">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium ${
                  isActive || isCompleted ? "text-black dark:text-white" : "text-gray-500 dark:text-zinc-500"
                }`}
              >
                {isMobile
                  ? index === 0
                    ? "Track"
                    : index === 1
                      ? "Strategy"
                      : index === 2
                        ? "Ad"
                        : "Budget"
                  : step.label}
              </span>
            </div>
          )
        })}

        {/* Progress bar container */}
        <div
          className="absolute top-4 sm:top-5 left-[5%] w-[90%] h-0.5 bg-gray-200 dark:bg-zinc-800 -z-10 rounded-full"
          aria-hidden="true"
        ></div>

        {/* Active progress bar */}
        <div
          className="absolute top-4 sm:top-5 left-[5%] h-0.5 bg-black dark:bg-indigo-600 -z-10 transition-all duration-300 rounded-full"
          style={{
            width: `${progressPercentage}%`,
            maxWidth: "90%", // Ensure it doesn't exceed the container width
          }}
          data-step={activeStep}
          aria-label={`Progress: ${progressPercentage}%`}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      {/* Accessible text for screen readers */}
      <div className="sr-only">
        Step {activeIndex + 1} of {steps.length}: {activeStepLabel}
      </div>
    </div>
  )
}
