import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(textString: string) {
  // remove non ascii chars
  return textString.replace(/[^\x00-\x7F]/g, "");
}
