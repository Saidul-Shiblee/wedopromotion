"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useCampaign } from "@/contexts/campaign-context"
import { StripePaymentForm } from "@/components/payment/stripe-payment-form"
// import { InfoIcon } from 'lucide-react' // Removed InfoIcon import

// Define the payment method display type
interface PaymentMethodDisplay {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  name?: string
}

export function BudgetPlanner() {
  const { campaignData, updateCampaignData, reviewedCampaign, setReviewedCampaign, isSubmitting } = useCampaign()
  const [budget, setBudget] = useState(campaignData.budget || 20)
  const [paymentSaved, setPaymentSaved] = useState(false)
  const [savedPaymentMethod, setSavedPaymentMethod] = useState<PaymentMethodDisplay | null>(null)

  // Handle budget change
  const handleBudgetChange = (value: number[]) => {
    const newBudget = value[0]
    setBudget(newBudget)
    // Update campaign data directly here instead of in an effect
    updateCampaignData({ budget: newBudget })
  }

  // Calculate estimated reach and followers based on budget
  const estimatedReach = {
    min: Math.floor(budget * 300),
    max: Math.floor(budget * 870),
  }

  const estimatedFollowers = {
    min: Math.floor(budget * 3),
    max: Math.floor(budget * 6),
  }

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Handle payment method saved - now also receives customerId
  const handlePaymentMethodSaved = (paymentMethodId: string, customerId: string) => {
    // Simulate getting payment method details from Stripe
    // In a real app, you would fetch this from your server or Stripe
    const mockPaymentMethod: PaymentMethodDisplay = {
      id: paymentMethodId,
      brand: "visa", // This would come from the actual payment method
      last4: "4242", // This would come from the actual payment method
      expMonth: 12,
      expYear: 2030,
    }

    setSavedPaymentMethod(mockPaymentMethod)
    // Store both payment method ID and customer ID
    updateCampaignData({
      paymentMethodId,
      customerId,
    })
    setPaymentSaved(true)
  }

  // Check if we already have a payment method in campaign data
  useEffect(() => {
    if (campaignData.paymentMethodId && !savedPaymentMethod) {
      // In a real app, you would fetch the payment method details from your server
      // For now, we'll just create a mock payment method
      const mockPaymentMethod: PaymentMethodDisplay = {
        id: campaignData.paymentMethodId,
        brand: "visa",
        last4: "4242",
        expMonth: 12,
        expYear: 2030,
      }

      setSavedPaymentMethod(mockPaymentMethod)
      setPaymentSaved(true)
    }
  }, [campaignData.paymentMethodId, savedPaymentMethod])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Campaign Budget</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">
          Set your daily budget for this campaign. You'll only be charged for actual ad spend.
        </p>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="budget" className="dark:text-zinc-300">
              Daily Campaign Budget (USD)
            </Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="budget"
                min={5}
                max={100}
                step={1}
                value={[budget]}
                onValueChange={handleBudgetChange}
                className="flex-1 [&>[role=slider]]:bg-[#1DB954] [&>[role=slider]]:border-[#1DB954] [&>.range]:bg-[#1DB954]"
              />
              <div className="w-16 text-center font-medium text-lg dark:text-white">${budget}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Estimated Daily Reach</h3>
              <p className="text-2xl font-bold mt-1 dark:text-white">
                {formatNumber(estimatedReach.min)} - {formatNumber(estimatedReach.max)}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Potential number of people who will see your ad each day
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Estimated Playlist Followers</h3>
              <p className="text-2xl font-bold mt-1 dark:text-white">
                {formatNumber(estimatedFollowers.min)} - {formatNumber(estimatedFollowers.max)}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Potential number of new playlist followers per day
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Method</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">
          Add a payment method to launch your campaign. You'll only be charged for actual ad spend based on your daily
          budget.
        </p>

        <StripePaymentForm
          amount={budget}
          onPaymentMethodSaved={handlePaymentMethodSaved}
          isSubmitting={isSubmitting}
          savedPaymentMethod={savedPaymentMethod}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reviewedCampaign"
            checked={reviewedCampaign}
            onCheckedChange={(checked) => setReviewedCampaign(checked as boolean)}
            disabled={!paymentSaved || isSubmitting}
            className="data-[state=checked]:bg-[#1DB954] data-[state=checked]:border-[#1DB954]"
          />
          <Label
            htmlFor="reviewedCampaign"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-300"
          >
            I have reviewed my campaign details and am ready to launch
          </Label>
        </div>

        {!paymentSaved && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Please add a payment method before launching your campaign
          </p>
        )}
      </div>
    </div>
  )
}
