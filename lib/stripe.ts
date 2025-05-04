import { loadStripe } from "@stripe/stripe-js"

// Keep track of the Stripe instance to avoid recreating it
let stripeInstance: Promise<any> | null = null

// Load the Stripe instance with proper error handling
export const getStripe = () => {
  // Clear any existing instance to ensure we're using the latest key
  stripeInstance = null

  // Get the publishable key from environment variables
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.error("Missing Stripe publishable key. Please check your environment variables.")
    // Return a Promise that resolves to null instead of rejecting
    // This prevents build errors but will still allow the app to handle the missing key gracefully
    return Promise.resolve(null)
  }

  // Create a new instance with the current key
  if (!stripeInstance) {
    stripeInstance = loadStripe(publishableKey)
  }

  return stripeInstance
}
