import type { CampaignData } from "@/contexts/campaign-context"

// Validate campaign data for each step
export function validateStep(step: string, data: Partial<CampaignData>): { valid: boolean; message?: string } {
  switch (step) {
    case "choose-track":
      if (!data.selectedTrack) {
        return { valid: false, message: "Please select a track before proceeding" }
      }
      return { valid: true }

    case "build-playlist":
      if (!data.selectedArtists || data.selectedArtists.length === 0) {
        return { valid: false, message: "Please select at least one artist that inspires your music" }
      }
      return { valid: true }

    case "ad-creation":
      if (!data.adTitle) {
        return { valid: false, message: "Please enter a title for your ad" }
      }
      return { valid: true }

    case "budget":
      if (!data.budget || data.budget < 5) {
        return { valid: false, message: "Budget must be at least $5" }
      }
      return { valid: true }

    default:
      return { valid: true }
  }
}

// Calculate estimated reach based on budget
export function calculateEstimatedReach(budget: number): { min: number; max: number } {
  return {
    min: Math.floor(budget * 300),
    max: Math.floor(budget * 870),
  }
}

// Calculate estimated playlist followers based on budget (renamed from streams)
export function calculateEstimatedFollowers(budget: number): { min: number; max: number } {
  return {
    min: Math.floor(budget * 3),
    max: Math.floor(budget * 6),
  }
}
