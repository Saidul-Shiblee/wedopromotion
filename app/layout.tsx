import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CampaignProvider } from "@/contexts/campaign-context"
import GoogleTagManager from "@/components/google-tag-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SoundCampaign - Spotify Promotion",
  description: "Promote your music on Spotify and grow your audience",
    generator: 'v0.dev'
}

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CampaignProvider>
              <GoogleTagManager gtmId="GTM-XXXXX" />
              {children}
            </CampaignProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
