"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, CreditCard, Check } from "lucide-react"
import { getStripe } from "@/lib/stripe"
import { toast } from "@/hooks/use-toast"

// Styles for the Stripe CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
}

interface PaymentMethodDisplay {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  name?: string
}

interface StripeFormProps {
  amount: number
  onPaymentMethodSaved: (paymentMethodId: string, customerId: string) => void
  isSubmitting?: boolean
  savedPaymentMethod?: PaymentMethodDisplay | null
}

// The inner form component that uses Stripe hooks
function StripeForm({ amount, onPaymentMethodSaved, isSubmitting = false, savedPaymentMethod }: StripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDisplay | null>(savedPaymentMethod || null)
  const [showForm, setShowForm] = useState(!savedPaymentMethod)

  // Update local state if savedPaymentMethod changes
  useEffect(() => {
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod)
      setShowForm(false)
    }
  }, [savedPaymentMethod])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet or failed to initialize
      setErrorMessage("Payment system is not available. Please try again later.")
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Get the CardElement
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      // Create a payment method
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          email,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!stripePaymentMethod) {
        throw new Error("Payment method creation failed")
      }

      // Send the payment method ID to your server
      const response = await fetch("/api/stripe/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: stripePaymentMethod.id,
          email,
          name: cardholderName,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to save payment method")
      }

      // Set the payment method in local state
      if (stripePaymentMethod.card) {
        setPaymentMethod({
          id: stripePaymentMethod.id,
          brand: stripePaymentMethod.card.brand,
          last4: stripePaymentMethod.card.last4,
          expMonth: stripePaymentMethod.card.exp_month,
          expYear: stripePaymentMethod.card.exp_year,
          name: cardholderName,
        })
      }

      // Hide the form and show the selected payment method
      setShowForm(false)

      // Notify the parent component with both payment method ID and customer ID
      onPaymentMethodSaved(stripePaymentMethod.id, data.customerId)

      toast({
        title: "Payment method saved",
        description: "Your payment method has been saved successfully",
      })
    } catch (err) {
      console.error("Payment error:", err)
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred")

      toast({
        title: "Payment error",
        description: err instanceof Error ? err.message : "Failed to process payment method",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to handle changing the payment method
  const handleChangePaymentMethod = () => {
    setShowForm(true)
    setPaymentMethod(null)
  }

  // Format card expiration date
  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`
  }

  // Get card brand icon/name
  const getCardBrandDisplay = (brand: string) => {
    switch (brand) {
      case "visa":
        return "Visa"
      case "mastercard":
        return "Mastercard"
      case "amex":
        return "American Express"
      case "discover":
        return "Discover"
      default:
        return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }

  return (
    <Card className="w-full border border-gray-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Billing Information</CardTitle>
        <CardDescription>Your card will be charged ${amount.toFixed(2)} daily</CardDescription>
        {/* Add credit card logos */}
        <div className="flex items-center mt-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tvWK9Iah92vbiGrpdgqVE2ynl6qM5K.png"
            alt="Accepted payment methods: Visa, Mastercard, Diners Club, Discover, JCB"
            className="h-10 object-contain"
          />
        </div>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                disabled={isProcessing || isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isProcessing || isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-element">Card Details</Label>
              <div className="p-3 border rounded-md border-gray-200 dark:border-zinc-700 dark:bg-zinc-800">
                <CardElement id="card-element" options={cardElementOptions} />
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-md">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Lock className="h-3 w-3 mr-1" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </form>
        ) : paymentMethod ? (
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="h-5 w-5 text-gray-600 dark:text-zinc-300" />
              </div>
              <div>
                <div className="flex items-center">
                  <p className="font-medium dark:text-white">
                    {getCardBrandDisplay(paymentMethod.brand)} •••• {paymentMethod.last4}
                  </p>
                  <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Expires {formatExpiry(paymentMethod.expMonth, paymentMethod.expYear)}
                  {paymentMethod.name ? ` • ${paymentMethod.name}` : ""}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
      {showForm && (
        <CardFooter className="flex justify-end border-t border-gray-100 dark:border-zinc-800 pt-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isProcessing || isSubmitting || !stripe}
            className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Wrapper component that provides the Stripe context
export function StripePaymentForm(props: StripeFormProps) {
  // Force refresh the Stripe instance to ensure it uses the latest key
  const [stripePromise] = useState(() => {
    // Clear any cached instances
    return getStripe()
  })

  // Add a debug message to verify the key being used (will only show in development)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      console.log(`Using Stripe key: ${key ? key.substring(0, 8) + "..." : "undefined"}`)
    }
  }, [])

  return (
    <Elements stripe={stripePromise}>
      <StripeForm {...props} />
    </Elements>
  )
}
