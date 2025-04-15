
import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const Container = React.forwardRef<
  HTMLDivElement,
  ContainerProps
>(({ className, children, size = "lg", ...props }, ref) => {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "container px-4 mx-auto",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Container.displayName = "Container"
