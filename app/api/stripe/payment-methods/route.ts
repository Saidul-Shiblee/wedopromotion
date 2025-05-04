import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your live secret key, with proper error handling
const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY

  if (!apiKey) {
    console.error("Missing Stripe API key. Please set STRIPE_SECRET_KEY environment variable.")
    return null
  }

  return new Stripe(apiKey, {
    apiVersion: "2023-10-16",
  })
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient()

    if (!stripe) {
      return NextResponse.json(
        {
          success: false,
          error: "Stripe is not configured. Please contact support.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { paymentMethodId, email, name } = body

    if (!paymentMethodId) {
      return NextResponse.json({ success: false, error: "Payment method ID is required" }, { status: 400 })
    }

    // Retrieve the payment method to get details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    // Create a customer and attach the payment method
    const customer = await stripe.customers.create({
      email: email || "customer@example.com",
      name: name || "Customer",
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    console.log("Created Stripe customer:", customer.id)

    // Return the customer and payment method info
    return NextResponse.json({
      success: true,
      customerId: customer.id,
      paymentMethodId,
      paymentMethod: {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand || "unknown",
        last4: paymentMethod.card?.last4 || "0000",
        expMonth: paymentMethod.card?.exp_month || 12,
        expYear: paymentMethod.card?.exp_year || 2030,
      },
    })
  } catch (error) {
    console.error("Stripe API error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
