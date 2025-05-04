"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-zinc-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          An unexpected error occurred. We've been notified and are working to fix the issue.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-white"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
