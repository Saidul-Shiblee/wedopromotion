import type React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormErrorProps {
  children?: React.ReactNode
  className?: string
}

export function FormError({ children, className }: FormErrorProps) {
  if (!children) return null

  return (
    <div className={cn("flex items-center gap-2 text-destructive mt-2", className)}>
      <AlertCircle className="h-4 w-4" />
      <p className="text-sm font-medium">{children}</p>
    </div>
  )
}
