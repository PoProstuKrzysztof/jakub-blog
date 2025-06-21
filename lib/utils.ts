// Simplified version of clsx functionality
function clsx(...inputs: any[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      const result = clsx(...input)
      if (result) classes.push(result)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key)
      }
    }
  }
  
  return classes.join(' ')
}

// Simple tailwind merge - removes duplicate classes
function simpleTwMerge(classNames: string): string {
  const classes = classNames.split(' ').filter(Boolean)
  const classMap = new Map<string, string>()
  
  for (const className of classes) {
    // Extract base class name (e.g., 'text-red-500' -> 'text', 'bg-blue-100' -> 'bg')
    const baseClass = className.split('-')[0]
    classMap.set(baseClass, className)
  }
  
  return Array.from(classMap.values()).join(' ')
}

export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[]

export function cn(...inputs: ClassValue[]) {
  const classString = clsx(...inputs)
  return simpleTwMerge(classString)
}
