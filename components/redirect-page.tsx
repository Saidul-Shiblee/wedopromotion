"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function RedirectPage({ to }: { to: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(to)
  }, [router, to])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin dark:border-zinc-700 dark:border-t-white"></div>
    </div>
  )
}
