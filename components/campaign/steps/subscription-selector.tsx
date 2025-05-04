"use client"

import { CheckCircle2, HelpCircle, CreditCard, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useCampaign } from "@/contexts/campaign-context"

// Subscription plans data
const subscriptionPlans = [
  {
    id: "starter",
    name: "Lite",
    description: "Perfect for new artists just getting started",
    monthlyPrice: 19.99,
    annualPrice: 191.9, // 20% savings
    features: [
      "AI-Powered Meta Ads Management",
      "2x AI-Powered Ad Creatives",
      "Analytics & Insights",
      "Standard Support",
    ],
    popular: false,
    color: "bg-gray-100 dark:bg-zinc-800",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing artists ready to expand their audience",
    monthlyPrice: 49.99,
    annualPrice: 479.9, // 20% savings
    features: [
      "AI-Powered Meta Ads Management",
      "10x AI-Powered Ad Creatives",
      "Advanced Analytics & Insights",
      "Priority Support",
    ],
    popular: true,
    color: "bg-black dark:bg-indigo-900",
    buttonVariant: "default" as const,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For established artists looking to maximize impact",
    monthlyPrice: 99.99,
    annualPrice: 959.9, // 20% savings
    features: [
      "AI-Powered Meta Ads Management",
      "30x AI-Powered Ad Creatives",
      "Advanced Analytics & Insights",
      "24/7 Dedicated Support",
    ],
    popular: false,
    color: "bg-gray-100 dark:bg-zinc-800",
    buttonVariant: "outline" as const,
  },
]

// Feature comparison data for the new comparison table
const planFeatures = {
  categories: [
    {
      name: "Music sharing tools",
      features: [
        { name: "Smart Links", starter: true, pro: true, premium: true, tooltip: "Create custom links for your music" },
        { name: "Download Gates", starter: true, pro: true, premium: true, tooltip: "Collect emails before downloads" },
        {
          name: "Link Gates",
          starter: true,
          pro: true,
          premium: true,
          tooltip: "Require actions before accessing content",
        },
        { name: "Pre-Saves", starter: true, pro: true, premium: true, tooltip: "Allow fans to save upcoming releases" },
      ],
    },
    {
      name: "AI-powered music promotion",
      features: [
        {
          name: "AI-Powered Music Ads",
          starter: false,
          pro: true,
          premium: true,
          tooltip: "Automated ad creation using AI",
        },
        {
          name: "Grow My Spotify Track",
          starter: false,
          pro: true,
          premium: true,
          tooltip: "Targeted promotion for individual tracks",
        },
        {
          name: "Grow My Spotify Playlist",
          starter: false,
          pro: true,
          premium: true,
          tooltip: "Increase followers for your playlists",
        },
      ],
    },
  ],
}

// Testimonials data
const testimonials = [
  {
    quote:
      "My Spotify streams were completely flat, just 4 to 5 streams on a good day. Then I made one small tweak to my target audience using SoundCampaign, and within two weeks, I was averaging 950 streams a day. The results speak for themselves. This really works.",
    author: "Alex J.",
    avatar: "/placeholder.svg?height=64&width=64",
    spotifyScreenshot: "/images/spotify-growth-chart.png",
  },
  {
    quote:
      "For the first time ever, I hit over 1000 streams in a single day. Since starting my campaign, I've been getting good news like clockwork. Every day around this time, I check Spotify for Artists and see another great update!",
    author: "Sarah W.",
    avatar: "/placeholder.svg?height=64&width=64",
    spotifyScreenshot: "/images/spotify-daily-streams.png",
  },
  {
    quote:
      "My progress over the past 3 weeks has been amazing. These might not be huge numbers to everyone, but for me, they're a big deal. My music is very niche, so seeing these results feels like a real win. I started with just over 200 monthly listeners and maybe 200–300 streams. Ads truly work.",
    author: "Michael C.",
    avatar: "/placeholder.svg?height=64&width=64",
    spotifyScreenshot: "/images/spotify-monthly-listeners.png",
  },
]

export function SubscriptionSelector({ onSubscribe }: { onSubscribe: (planId: string) => Promise<void> }) {
  const { isAnnualBilling, setIsAnnualBilling, isSubmitting, selectedPlan, setActiveStep } = useCampaign()

  // Function to go back to the budget step
  const handleBackToCampaign = () => {
    setActiveStep("budget")
  }

  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col gap-4 mb-8 animate-fadeIn">
        {/* Green notification */}
        <div className="relative bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-base font-medium text-green-800 dark:text-green-300">
                Campaign settings saved successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your campaign settings have been saved and are almost ready to launch. Please choose a plan below.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mt-6 mb-2">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Benefits</h3>
          <ul className="space-y-4">
            <li className="flex">
              <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1 mr-3" />
              <div>
                <p className="font-medium text-black dark:text-white text-sm">0% Commission on Your Ad Spend</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Unlike competitors who take{" "}
                  <span className="font-bold">
                    up to 20% of your Meta Ads budget, we charge absolutely no commission
                  </span>{" "}
                  on your ad spend. Every dollar of your budget goes directly toward promoting your music, maximizing
                  your campaign's reach and effectiveness.
                </p>
              </div>
            </li>
            <li className="flex">
              <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1 mr-3" />
              <div>
                <p className="font-medium text-black dark:text-white text-sm">Cost-effective promotion</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Traditional marketing agencies charge an average of <span className="font-bold">$900 per month</span>{" "}
                  for music promotion services, which is often prohibitive for independent artists. Our plans offer the
                  same professional promotion at a fraction of the cost, with flexible options to match your career
                  stage and budget.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Choose Your Plan</h2>
        <p className="text-gray-500 dark:text-zinc-400 mb-1">Try for Free. Cancel Anytime.</p>
        <p className="text-gray-500 dark:text-zinc-400 mb-6">
          Select the plan that best fits your promotional needs and budget
        </p>

        <div className="flex items-center justify-center space-x-2 mb-8">
          <span
            className={`text-sm ${!isAnnualBilling ? "font-medium text-black dark:text-white" : "text-gray-500 dark:text-zinc-400"}`}
          >
            Monthly
          </span>
          <Switch
            checked={isAnnualBilling}
            onCheckedChange={setIsAnnualBilling}
            className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-indigo-600"
          />
          <span
            className={`text-sm ${isAnnualBilling ? "font-medium text-black dark:text-white" : "text-gray-500 dark:text-zinc-400"}`}
          >
            Annual{" "}
            <Badge className="ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900 dark:hover:text-green-300">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-hidden border",
              plan.popular ? "border-black dark:border-indigo-600 shadow-lg" : "border-gray-200 dark:border-zinc-700",
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-black dark:bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}
            <CardHeader className={cn("pb-8", plan.color, plan.popular ? "text-white" : "dark:text-white")}>
              <CardTitle className={plan.popular ? "text-white" : ""}>{plan.name}</CardTitle>
              <CardDescription className={plan.popular ? "text-white/80" : "dark:text-zinc-400"}>
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${isAnnualBilling ? (plan.annualPrice / 12).toFixed(2) : plan.monthlyPrice}
                </span>
                <span className="text-sm ml-1">/ month</span>

                {isAnnualBilling && (
                  <div className="mt-1 text-sm">
                    <span className={plan.popular ? "text-white/80" : "text-gray-500 dark:text-zinc-400"}>
                      Billed annually
                    </span>
                  </div>
                )}
                <div className="mt-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                    7-day free trial
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  plan.buttonVariant === "default"
                    ? "bg-black hover:bg-black/90 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                    : "border-black text-black hover:bg-black hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700",
                )}
                variant={plan.buttonVariant}
                onClick={() => onSubscribe(plan.id)}
                disabled={isSubmitting}
              >
                {isSubmitting && selectedPlan === plan.id ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  <>Try for Free</>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
          <span className="text-sm text-gray-500 dark:text-zinc-400">
            Need help choosing? Contact our support team for guidance
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
          <span className="text-sm text-gray-500 dark:text-zinc-400">Secure payment processing</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
          <span className="text-sm text-gray-500 dark:text-zinc-400">30-day money-back guarantee</span>
        </div>
      </div>

      <div className="mt-20">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-3 dark:text-white">What Our Artists Say</h3>
          <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Join thousands of artists who have grown their audience with our platform.
          </p>
        </div>

        {/* Desktop Grid View (hidden on mobile) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-lg flex flex-col h-full"
            >
              {/* Spotify Screenshot */}
              <div className="w-full bg-gray-50 dark:bg-zinc-800 relative">
                <div className="pt-[75%] relative">
                  <img
                    src={testimonial.spotifyScreenshot || "/placeholder.svg"}
                    alt="Spotify for Artists statistics"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <svg
                    className="h-6 w-6 text-gray-300 dark:text-zinc-700 mb-2"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-700 dark:text-zinc-300 line-clamp-6">{testimonial.quote}</p>
                </div>

                <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback className="bg-black text-white dark:bg-indigo-600">
                      {testimonial.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h4 className="font-semibold text-sm text-black dark:text-white">{testimonial.author}</h4>
                    <div className="flex items-center mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-zinc-400">Verified review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel (hidden on desktop) */}
        <div className="md:hidden relative">
          <div className="overflow-x-auto pb-8 -mx-4 px-4 flex snap-x snap-mandatory scrollbar-hide">
            <div className="flex space-x-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md border border-gray-100 dark:border-zinc-800 flex-shrink-0 w-[85vw] max-w-sm snap-center"
                >
                  {/* Spotify Screenshot */}
                  <div className="w-full bg-gray-50 dark:bg-zinc-800 relative">
                    <div className="pt-[75%] relative">
                      <img
                        src={testimonial.spotifyScreenshot || "/placeholder.svg"}
                        alt="Spotify for Artists statistics"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="p-5">
                    <div className="mb-4">
                      <svg
                        className="h-6 w-6 text-gray-300 dark:text-zinc-700 mb-2"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-gray-700 dark:text-zinc-300 line-clamp-5">{testimonial.quote}</p>
                    </div>

                    <div className="flex items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback className="bg-black text-white dark:bg-indigo-600">
                          {testimonial.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h4 className="font-semibold text-sm text-black dark:text-white">{testimonial.author}</h4>
                        <div className="flex items-center mt-0.5">
                          <span className="text-xs text-gray-500 dark:text-zinc-400">Verified review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-700"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe Instructions */}
          <div className="text-center mt-4 text-sm text-gray-500 dark:text-zinc-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Swipe to see more
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <Button
          type="button"
          onClick={handleBackToCampaign}
          className="border-black text-black hover:bg-black hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
          variant="outline"
        >
          Back to campaign settings
        </Button>
      </div>
    </div>
  )
}
