import { apiRequest } from '../services/urlService'

interface UrlListProps {
  urlList: any[]
  loading: boolean
  onDelete?: () => void
  onPreview?: (url: string) => void
}

function UrlList({ urlList, loading, onDelete, onPreview }: UrlListProps) {
  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return
    }

    try {
      await apiRequest('DELETE', null, id)
      if (onDelete) {
        onDelete()
      }
    } catch (err) {
      alert('Failed to delete URL')
      console.error('Delete error:', err)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">All Shortened URLs</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : urlList.length === 0 ? (
        <p className="text-gray-500 text-sm">No shortened URLs yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {urlList.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative group">
              <div className="text-sm pr-12">
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Original:</span>{' '}
                  <span className="break-all">{item.longUrl || item.url || 'N/A'}</span>
                </p>
                <p className="text-blue-600">
                  <span className="font-medium">Short:</span>{' '}
                  <button
                    onClick={() => {
                      const shortUrl = item.shortUrl || item.short || JSON.stringify(item)
                      if (onPreview && shortUrl) {
                        onPreview(shortUrl)
                      }
                    }}
                    className="break-all text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {item.shortUrl || item.short || JSON.stringify(item)}
                  </button>
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id || index)}
                className="absolute top-3 right-3 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UrlList
