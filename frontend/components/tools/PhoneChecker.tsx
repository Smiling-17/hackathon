'use client'

import { useState } from 'react'
import { Phone, Loader2 } from 'lucide-react'
import ResultCard from '@/components/ui/ResultCard'

export default function PhoneChecker() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO'
    title: string
    message: string
    confidence?: number
  } | null>(null)

  const handleCheck = async () => {
    if (!phoneNumber.trim()) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          const errorText = await response.text()
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }
        
        // If API returns error in standard format, use it
        if (errorData && errorData.status && errorData.title && errorData.message) {
          setResult({
            status: errorData.status,
            title: errorData.title,
            message: errorData.message,
            confidence: errorData.confidence || 0,
          })
          setLoading(false)
          return
        }
        
        throw new Error(errorData?.message || `API error: ${response.status}`)
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error('Failed to parse API response')
      }
      
      // Validate response format
      if (!data || typeof data !== 'object' || !data.status || !data.title || !data.message) {
        throw new Error('Invalid response format from API')
      }
      
      setResult({
        status: data.status,
        title: data.title,
        message: data.message,
        confidence: data.confidence || 0,
      })
    } catch (error: any) {
      console.error('Error checking phone:', error)
      setResult({
        status: 'DANGER',
        title: 'Error',
        message: error?.message || 'Failed to check phone number. Please try again.',
        confidence: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="w-6 h-6 text-cyber-blue" />
        <h2 className="text-xl font-bold text-white">Phone Checker</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !phoneNumber.trim()}
          className="w-full px-6 py-3 bg-cyber-blue hover:bg-cyber-blue/80 text-slate-950 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Phone Number'
          )}
        </button>

        {result && (
          <div className="mt-4">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </div>
  )
}



