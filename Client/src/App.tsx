import { useState, useEffect } from 'react'
import { apiRequest } from './services/urlService'
import UrlForm from './components/UrlForm'
import UrlList from './components/UrlList'

function App() {
  const [urlList, setUrlList] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fetchUrlList = async () => {
    setLoadingList(true)
    try {
      const data = await apiRequest('GET', null)
      const urls = Array.isArray(data) ? data : []
      setUrlList(urls)
    } catch (err) {
      console.error('Failed to fetch URL list:', err)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchUrlList()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <UrlForm onSuccess={fetchUrlList} />
        <UrlList 
          urlList={urlList} 
          loading={loadingList} 
          onDelete={fetchUrlList}
          onPreview={setPreviewUrl}
        />
        {previewUrl && (
          <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Preview</p>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe
              src={previewUrl}
              className="w-full h-96 border-0"
              title="URL Preview"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
