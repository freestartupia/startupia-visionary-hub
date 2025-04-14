
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]/g, '-')        // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '')      // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-')        // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')            // Trim hyphens from start
    .replace(/-+$/, '');           // Trim hyphens from end
}
