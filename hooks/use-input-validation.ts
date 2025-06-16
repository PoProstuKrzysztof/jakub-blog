import { useState, useCallback } from 'react'
import { validationPatterns, sanitizeInput, logSecurityEvent } from '@/lib/security/config'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean | string
  sanitize?: boolean
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface ValidationErrors {
  [key: string]: string
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
  sanitizedData: Record<string, string>
}

export function useInputValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || value.trim().length === 0)) {
      return `${name} is required`
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) {
      return null
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters long`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} must not exceed ${rule.maxLength} characters`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${name} format is invalid`
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value)
      if (typeof customResult === 'string') {
        return customResult
      }
      if (customResult === false) {
        return `${name} is invalid`
      }
    }

    return null
  }, [rules])

  const validateAll = useCallback((data: Record<string, string>): ValidationResult => {
    setIsValidating(true)
    
    const newErrors: ValidationErrors = {}
    const sanitizedData: Record<string, string> = {}
    
    // Detect potential security threats
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript protocol
      /on\w+\s*=/gi, // Event handlers
      /eval\s*\(/gi, // eval() calls
      /document\.(write|cookie)/gi, // Document manipulation
      /window\.(location|open)/gi, // Window manipulation
      /<iframe\b[^>]*>/gi, // Iframe tags
      /\bselect\b.*\bfrom\b.*\bwhere\b/gi, // SQL injection patterns
      /\bunion\b.*\bselect\b/gi, // SQL union attacks
      /\bdrop\b.*\btable\b/gi, // SQL drop commands
    ]

    for (const [key, value] of Object.entries(data)) {
      // Security check
      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value))
      if (isSuspicious) {
        logSecurityEvent('suspicious_input_detected', {
          field: key,
          value: value.substring(0, 100), // Log only first 100 chars
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
        })
        newErrors[key] = 'Invalid input detected'
        continue
      }

      // Field validation
      const error = validateField(key, value)
      if (error) {
        newErrors[key] = error
      }

      // Sanitization
      const rule = rules[key]
      if (rule?.sanitize) {
        sanitizedData[key] = sanitizeInput.html(value)
      } else {
        sanitizedData[key] = value
      }
    }

    setErrors(newErrors)
    setIsValidating(false)

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
      sanitizedData
    }
  }, [rules, validateField])

  const validateSingle = useCallback((name: string, value: string): boolean => {
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }))
    return !error
  }, [validateField])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  return {
    errors,
    isValidating,
    validateAll,
    validateSingle,
    clearErrors,
    clearError
  }
}

// Predefined validation rules for common fields
export const commonValidationRules: ValidationRules = {
  email: {
    required: true,
    pattern: validationPatterns.email,
    sanitize: true
  },
  password: {
    required: true,
    minLength: 12,
    pattern: validationPatterns.strongPassword,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character'
      return true
    }
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: validationPatterns.username,
    sanitize: true
  },
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true
  },
  content: {
    required: true,
    minLength: 10,
    maxLength: 50000,
    sanitize: true
  },
  slug: {
    required: true,
    pattern: validationPatterns.slug,
    sanitize: true
  },
  url: {
    pattern: validationPatterns.url,
    sanitize: true
  },
  phoneNumber: {
    pattern: validationPatterns.phoneNumber,
    sanitize: true
  }
}

export default useInputValidation 