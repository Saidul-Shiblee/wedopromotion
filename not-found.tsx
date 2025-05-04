import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-zinc-950">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-black hover:bg-black/90 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Link href="/dashboard/create-campaign">Create Campaign</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
