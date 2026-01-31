import { useState } from 'react'
import { apiRequest } from '../services/urlService'

interface UrlFormProps {
  onSuccess?: () => void
}

function UrlForm({ onSuccess }: UrlFormProps) {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('url', inputValue)
      
      const data = await apiRequest('POST', formData)
      const shortenedUrl = data.shortUrl || JSON.stringify(data)
      setResult(shortenedUrl)
      setInputValue('')
      
      // Call the onSuccess callback to refresh the list
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter URL to shorten..."
            className="w-full px-5 py-3.5 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-medium mb-2">Shortened URL:</p>
            <p className="text-green-700 break-all">{result}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default UrlForm
