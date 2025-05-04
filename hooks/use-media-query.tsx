"use client"

import { useState, useEffect, useRef } from "react"

export function useMediaQuery(query: string): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)
  const mediaQueryRef = useRef<MediaQueryList | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)

    // Create a media query list
    const mediaQuery = window.matchMedia(query)
    mediaQueryRef.current = mediaQuery

    // Set the initial value with a small delay to avoid ResizeObserver issues
    timeoutRef.current = setTimeout(() => {
      setMatches(mediaQuery.matches)
    }, 10)

    // Define a debounced callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set the new value with a small delay
      timeoutRef.current = setTimeout(() => {
        setMatches(event.matches)
      }, 50)
    }

    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleChange)

    // Clean up
    return () => {
      if (mediaQueryRef.current) {
        mediaQueryRef.current.removeEventListener("change", handleChange)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query])

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false
}
