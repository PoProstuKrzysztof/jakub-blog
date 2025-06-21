import { useState, useCallback } from 'react'
import { useAuth } from './use-auth'
import type { AuthError } from '@supabase/supabase-js'

interface FormData {
  email: string
  password: string
  confirmPassword?: string
  fullName?: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  fullName?: string
  general?: string
}

interface UseAuthFormOptions {
  onSuccess?: (data: { user?: any; session?: any; error?: string }) => void
  onError?: (error: string) => void
  preserveFormOnError?: boolean
}

export function useAuthForm(options: UseAuthFormOptions = {}) {
  const { signIn, signUp, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    })
  }, [])

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email jest wymagany'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Nieprawidłowy format email'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Hasło jest wymagane'
    if (password.length < 6) return 'Hasło musi mieć co najmniej 6 znaków'
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Potwierdzenie hasła jest wymagane'
    if (password !== confirmPassword) return 'Hasła nie są identyczne'
    return undefined
  }

  const validateForm = useCallback((isSignUp: boolean = false): boolean => {
    const newErrors: FormErrors = {}

    // Validate email
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    // Validate password
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    // Validate confirm password for signup
    if (isSignUp) {
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword || '')
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSignIn = useCallback(async (): Promise<boolean> => {
    if (loading || authLoading || isSubmitting) return false

    clearErrors()
    
    // Validate form
    if (!validateForm(false)) {
      return false
    }

    setLoading(true)
    setIsSubmitting(true)

    try {
      const result = await signIn(formData.email, formData.password)

      if (result.error) {
        setErrors({ general: result.error })
        options.onError?.(result.error)
        
        // Preserve form data on error unless explicitly disabled
        if (!options.preserveFormOnError) {
          setFormData(prev => ({ ...prev, password: '' }))
        }
        
        return false
      }

      // Success
      options.onSuccess?.(result)
      
      // Clear form on success (but not immediately to avoid flash)
      setTimeout(() => {
        clearForm()
      }, 1000)

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      setErrors({ general: errorMessage })
      options.onError?.(errorMessage)
      
      // Preserve form data on error
      if (!options.preserveFormOnError) {
        setFormData(prev => ({ ...prev, password: '' }))
      }
      
      return false
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }, [formData, loading, authLoading, isSubmitting, signIn, validateForm, options, clearForm])

  const handleSignUp = useCallback(async (): Promise<boolean> => {
    if (loading || authLoading || isSubmitting) return false

    clearErrors()
    
    // Validate form
    if (!validateForm(true)) {
      return false
    }

    setLoading(true)
    setIsSubmitting(true)

    try {
      const metadata = formData.fullName ? { full_name: formData.fullName } : undefined
      const result = await signUp(formData.email, formData.password, metadata)

      if (result.error) {
        setErrors({ general: result.error })
        options.onError?.(result.error)
        
        // Preserve form data on error unless explicitly disabled
        if (!options.preserveFormOnError) {
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        }
        
        return false
      }

      // Success
      options.onSuccess?.(result)
      
      // Clear form on success
      clearForm()

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      setErrors({ general: errorMessage })
      options.onError?.(errorMessage)
      
      // Preserve form data on error
      if (!options.preserveFormOnError) {
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      }
      
      return false
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }, [formData, loading, authLoading, isSubmitting, signUp, validateForm, options, clearForm])

  return {
    // Form data
    formData,
    updateField,
    clearForm,
    resetForm: clearForm,
    
    // Validation
    errors,
    clearErrors,
    setErrors,
    
    // Actions
    handleSignIn,
    handleSignUp,
    submitLogin: handleSignIn,
    submitSignup: handleSignUp,
    
    // State
    loading: loading || authLoading,
    isSubmitting,
    
    // Utilities
    isValid: (isSignUp: boolean = false) => validateForm(isSignUp),
    
    // Individual field setters for convenience
    setEmail: (email: string) => updateField('email', email),
    setPassword: (password: string) => updateField('password', password),
    setConfirmPassword: (password: string) => updateField('confirmPassword', password),
    setFullName: (name: string) => updateField('fullName', name),
  }
} 