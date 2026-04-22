import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  const randomLetters = Array.from({length: 2}, ()=> 
    letters[Math.floor(Math.random() * letters.length)]
  ).join("")
  const randomNumbers = Math.floor(1000 + Math.random() * 9000)

  return `${randomLetters}${randomNumbers}`
}