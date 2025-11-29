'use client'

import { useState } from 'react'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'
import ResultCard from '@/components/ui/ResultCard'

export default function LocationChecker() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO'
    title: string
    message: string
    confidence?: number
  } | null>(null)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch('/api/check-location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
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
          console.error('Error checking location:', error)
          setResult({
            status: 'DANGER',
            title: 'Error',
            message: error?.message || 'Failed to check location. Please try again.',
            confidence: 0,
          })
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError('Unable to retrieve your location. Please enable location permissions.')
        setLoading(false)
      }
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-cyber-red" />
        <h2 className="text-xl font-bold text-white">Safe Location Checker</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Check the safety status of your current location based on reported incidents.
        </p>

        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full px-6 py-3 bg-cyber-red hover:bg-cyber-red/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Get My Safety Status
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </div>
  )
}



