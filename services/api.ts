// Mock function to simulate Spotify API calls
export const searchSpotify = async (query: string, type: "artist" | "track") => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${type}-${i}`,
    name: `${query} ${type} ${i + 1}`,
  }))
}

// Mock function to simulate video search API calls
export const searchVideos = async (query: string, platform: "tiktok" | "meta") => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return Array.from({ length: 4 }, (_, i) => ({
    id: `${platform}-${i}`,
    title: `${query} ${platform} video ${i + 1}`,
    thumbnail: `/placeholder.svg?height=200&width=300`,
    url: "#",
    platform,
  }))
}

// Mock function to simulate AI text generation
export const generateAdText = async (style: string, prompt: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return `${style} style ad text for: ${prompt}`
}

// Mock function to create a campaign
export const createCampaign = async (campaignData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true, id: `campaign-${Date.now()}` }
}

// Mock function to subscribe to a plan
export const subscribeToPlan = async (planId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true, planId }
}
