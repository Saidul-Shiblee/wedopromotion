import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CampaignProvider } from "@/contexts/campaign-context"
import GoogleTagManager from "@/components/google-tag-manager"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SoundCampaign - Spotify Promotion",
  description: "Promote your music on Spotify and grow your audience",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CampaignProvider>
              <GoogleTagManager gtmId="GTM-XXXXX" />
              {children}
            </CampaignProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
