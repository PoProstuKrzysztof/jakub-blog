'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { securityConfig, logSecurityEvent, sanitizeInput } from '@/lib/security/config'
import { Upload, X, FileText, Image, AlertTriangle } from 'lucide-react'

interface SecureFileUploadProps {
  onUpload: (file: File, metadata: FileMetadata) => Promise<void>
  accept?: string[]
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
}

interface FileMetadata {
  originalName: string
  sanitizedName: string
  size: number
  type: string
  hash: string
  isSecure: boolean
  scanResults: SecurityScanResult
}

interface SecurityScanResult {
  hasExecutableContent: boolean
  hasSuspiciousExtensions: boolean
  hasEmbeddedScripts: boolean
  riskLevel: 'low' | 'medium' | 'high'
  warnings: string[]
}

interface UploadState {
  file: File | null
  progress: number
  status: 'idle' | 'scanning' | 'uploading' | 'success' | 'error'
  error: string | null
  metadata: FileMetadata | null
}

export function SecureFileUpload({
  onUpload,
  accept = securityConfig.upload.allowedTypes,
  maxSize = securityConfig.upload.maxFileSize,
  multiple = false,
  disabled = false,
  className = ''
}: SecureFileUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: 'idle',
    error: null,
    metadata: null
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dangerous file extensions and MIME types
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
    '.app', '.deb', '.pkg', '.dmg', '.rpm', '.msi', '.run', '.bin',
    '.sh', '.ps1', '.php', '.asp', '.jsp', '.py', '.rb', '.pl'
  ]

  const dangerousMimeTypes = [
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-winexe',
    'application/x-javascript',
    'text/javascript',
    'application/javascript'
  ]

  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const scanFileContent = async (file: File): Promise<SecurityScanResult> => {
    const result: SecurityScanResult = {
      hasExecutableContent: false,
      hasSuspiciousExtensions: false,
      hasEmbeddedScripts: false,
      riskLevel: 'low',
      warnings: []
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (dangerousExtensions.includes(extension)) {
      result.hasSuspiciousExtensions = true
      result.riskLevel = 'high'
      result.warnings.push(`Dangerous file extension: ${extension}`)
    }

    // Check MIME type
    if (dangerousMimeTypes.includes(file.type)) {
      result.hasExecutableContent = true
      result.riskLevel = 'high'
      result.warnings.push(`Dangerous MIME type: ${file.type}`)
    }

    // For text-based files, scan content
    if (file.type.startsWith('text/') || file.type.includes('xml') || file.type.includes('json')) {
      try {
        const content = await file.text()
        const suspiciousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /eval\s*\(/gi,
          /document\.(write|cookie)/gi,
          /window\.(location|open)/gi,
          /<iframe\b[^>]*>/gi,
          /\bexec\b|\bsystem\b|\bshell_exec\b/gi
        ]

        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content)) {
            result.hasEmbeddedScripts = true
            result.riskLevel = result.riskLevel === 'high' ? 'high' : 'medium'
            result.warnings.push('Suspicious script content detected')
            break
          }
        }
      } catch (error) {
        result.warnings.push('Could not scan file content')
      }
    }

    return result
  }

  const validateFile = (file: File): string | null => {
    // Size validation
    if (file.size > maxSize) {
      return `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    // Type validation
    if (accept.length > 0 && !accept.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }

    // Name validation
    if (file.name.length > 255) {
      return 'File name is too long'
    }

    // Check for null bytes (potential security issue)
    if (file.name.includes('\0')) {
      return 'Invalid file name'
    }

    return null
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Handle single file for now
    
    setUploadState({
      file,
      progress: 0,
      status: 'scanning',
      error: null,
      metadata: null
    })

    try {
      // Basic validation
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Security scanning
      const [hash, scanResults] = await Promise.all([
        calculateFileHash(file),
        scanFileContent(file)
      ])

      const metadata: FileMetadata = {
        originalName: file.name,
        sanitizedName: sanitizeInput.filename(file.name),
        size: file.size,
        type: file.type,
        hash,
        isSecure: scanResults.riskLevel === 'low',
        scanResults
      }

      // Log security events for suspicious files
      if (scanResults.riskLevel !== 'low') {
        logSecurityEvent('suspicious_file_upload', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          riskLevel: scanResults.riskLevel,
          warnings: scanResults.warnings,
          hash,
          timestamp: new Date().toISOString()
        })
      }

      setUploadState(prev => ({
        ...prev,
        status: 'uploading',
        metadata
      }))

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadState(prev => ({ ...prev, progress: i }))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Call the upload handler
      await onUpload(file, metadata)

      setUploadState(prev => ({
        ...prev,
        status: 'success',
        progress: 100
      }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }))
    }
  }, [onUpload, accept, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }, [handleFileSelect, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      progress: 0,
      status: 'idle',
      error: null,
      metadata: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default: return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${uploadState.status === 'idle' ? 'border-gray-300 hover:border-gray-400' : 'border-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept.join(',')}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Max size: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Allowed types: {accept.join(', ')}
        </p>
      </div>

      {/* Upload Progress */}
      {uploadState.status !== 'idle' && uploadState.file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {uploadState.file.type.startsWith('image/') ? (
                <Image className="h-5 w-5 text-blue-500" />
              ) : (
                <FileText className="h-5 w-5 text-gray-500" />
              )}
              <span className="text-sm font-medium truncate max-w-xs">
                {uploadState.file.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              disabled={uploadState.status === 'uploading'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploadState.status === 'uploading' && (
            <Progress value={uploadState.progress} className="w-full" />
          )}

          {/* Security Scan Results */}
          {uploadState.metadata && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Scan</span>
                <div className="flex items-center space-x-1">
                  {getRiskLevelIcon(uploadState.metadata.scanResults.riskLevel)}
                  <span className={`text-sm font-medium ${getRiskLevelColor(uploadState.metadata.scanResults.riskLevel)}`}>
                    {uploadState.metadata.scanResults.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {uploadState.metadata.scanResults.warnings.length > 0 && (
                <div className="space-y-1">
                  {uploadState.metadata.scanResults.warnings.map((warning, index) => (
                    <Alert key={index} variant="destructive" className="py-2">
                      <AlertDescription className="text-xs">
                        {warning}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadState.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{uploadState.error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {uploadState.status === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            File uploaded successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default SecureFileUpload 