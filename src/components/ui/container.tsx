
import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = React.forwardRef<
  HTMLDivElement,
  ContainerProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "container px-4 mx-auto",
      className
    )}
    {...props}
  >
    {children}
  </div>
))

Container.displayName = "Container"
