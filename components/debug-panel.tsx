"use client"

import { useState } from "react"
import { useCampaign } from "@/contexts/campaign-context"
import { Button } from "@/components/ui/button"

export function DebugPanel() {
  const { campaignData, activeStep, nextStep } = useCampaign()
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600" onClick={() => setIsOpen(true)}>
        Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg p-4 max-w-md max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Debug Panel</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Active Step</h4>
          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded mt-1">{activeStep}</div>
        </div>

        <div>
          <h4 className="font-semibold">Campaign Data</h4>
          <pre className="bg-gray-100 dark:bg-zinc-800 p-2 rounded mt-1 text-xs overflow-auto">
            {JSON.stringify(campaignData, null, 2)}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => nextStep()}>Force Next Step</Button>
        </div>
      </div>
    </div>
  )
}
