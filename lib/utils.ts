import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe localStorage functions to avoid hydration errors
export function getLocalStorage(key: string, defaultValue: any = null) {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key)
    return value !== null ? value : defaultValue
  }
  return defaultValue
}

export function setLocalStorage(key: string, value: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

export function removeLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}

