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

    const { paymentMethodId, customerId, amount, description, campaignId } = await request.json()

    if (!paymentMethodId || !amount) {
      return NextResponse.json({ success: false, error: "Payment method ID and amount are required" }, { status: 400 })
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      customer: customerId,
      description: description || "Campaign launch payment",
      metadata: {
        campaignId,
      },
      confirm: true, // Confirm the payment immediately
      off_session: true, // Since this is a server-side charge
    })

    // Check if payment succeeded
    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      })
    } else if (paymentIntent.status === "requires_action") {
      // This would happen if the card requires authentication
      return NextResponse.json({
        success: false,
        error: "This payment requires additional authentication",
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment failed with status: ${paymentIntent.status}`,
        status: paymentIntent.status,
      })
    }
  } catch (error) {
    console.error("Error creating charge:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
