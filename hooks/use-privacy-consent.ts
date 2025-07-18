"use client"

import { useState, useEffect } from "react"

interface PrivacyConsentState {
  hasConsented: boolean
  consentDate: string | null
  version: string
}

const PRIVACY_VERSION = "1.0.0"
const STORAGE_KEY = "yyc3-privacy-consent"

export function usePrivacyConsent() {
  const [consentState, setConsentState] = useState<PrivacyConsentState>({
    hasConsented: false,
    consentDate: null,
    version: PRIVACY_VERSION,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从localStorage读取同意状态
    const loadConsentState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsedState = JSON.parse(stored) as PrivacyConsentState
          // 检查版本是否匹配
          if (parsedState.version === PRIVACY_VERSION) {
            setConsentState(parsedState)
          } else {
            // 版本不匹配，需要重新同意
            setConsentState({
              hasConsented: false,
              consentDate: null,
              version: PRIVACY_VERSION,
            })
          }
        }
      } catch (error) {
        console.error("Failed to load privacy consent state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConsentState()
  }, [])

  const giveConsent = () => {
    const newState: PrivacyConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      version: PRIVACY_VERSION,
    }

    setConsentState(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }

  const revokeConsent = () => {
    const newState: PrivacyConsentState = {
      hasConsented: false,
      consentDate: null,
      version: PRIVACY_VERSION,
    }

    setConsentState(newState)
    localStorage.removeItem(STORAGE_KEY)
  }

  const requiresConsent = () => {
    return !consentState.hasConsented
  }

  return {
    ...consentState,
    isLoading,
    giveConsent,
    revokeConsent,
    requiresConsent,
  }
}
