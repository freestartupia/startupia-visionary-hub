import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from '@/integrations/supabase/client';

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

export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  // First check if the base slug is available
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle();
  
  // If no post with this slug exists, use the base slug
  if (!data) {
    return baseSlug;
  }
  
  // Otherwise, append a random string to make it unique
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomString}`;
}
