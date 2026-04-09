import { 
  clsx, 
  type ClassValue 
} from 'clsx';

import { 
  twMerge 
} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToWords(n: number): string {
  const words = [
    "zero", "one", "two", "three", "four", 
    "five", "six", "seven", "eight", "nine", "ten"
  ];

  return words[n] || n.toString();
}

export function getCenteredScrollTarget(
  rect: DOMRect,
  stickyOffset: number
): number {
  const absoluteTop = window.scrollY + rect.top;
  
  const viewportHeight = window.innerHeight;
  
  const usableHeight = viewportHeight - stickyOffset;

  if (rect.height > usableHeight) {
    return absoluteTop - stickyOffset;
  }

  const topPadding = (usableHeight - rect.height) / 2;
  
  return absoluteTop - stickyOffset - topPadding + 19;
}
