import { useState } from 'react'
      import { format } from 'date-fns'
      import Icon from '@/components/atoms/Icon'
      
      const FileRowItem = ({ file, onDelete, onRename }) => {
        const [isRenaming, setIsRenaming] = useState(false)
        const [newName, setNewName] = useState(file?.name || '')
      
        const handleRename = () => {
          if (newName.trim() && newName !== file.name) {
            onRename(file.id, newName.trim())
          }
          setIsRenaming(false)
        }
      
        const formatFileSize = (bytes) => {
          if (bytes === 0) return '0 Bytes'
          const k = 1024
          const sizes = ['Bytes', 'KB', 'MB', 'GB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }
      
        const getFileTypeIcon = (mimeType) => {
          if (mimeType?.startsWith('image/')) return 'Image'
          if (mimeType?.startsWith('video/')) return 'Video'
          if (mimeType?.startsWith('audio/')) return 'Music'
          if (mimeType?.includes('pdf')) return 'FileText'
          if (mimeType?.includes('word') || mimeType?.includes('document')) return 'FileText'
          if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return 'FileSpreadsheet'
          if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) return 'Presentation'
          if (mimeType?.includes('zip') || mimeType?.includes('rar')) return 'Archive'
          return 'File'
        }
      
        const getFileTypeColor = (mimeType) => {
          if (mimeType?.startsWith('image/')) return 'bg-green-500'
          if (mimeType?.startsWith('video/')) return 'bg-red-500'
          if (mimeType?.startsWith('audio/')) return 'bg-purple-500'
          if (mimeType?.includes('pdf')) return 'bg-red-600'
          if (mimeType?.includes('word') || mimeType?.includes('document')) return 'bg-blue-600'
          if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return 'bg-green-600'
          if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) return 'bg-orange-500'
          if (mimeType?.includes('zip') || mimeType?.includes('rar')) return 'bg-purple-600'
          return 'bg-gray-500'
        }
      
        if (!file) return null
      
        return (
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Name */}
              <div className="col-span-6 sm:col-span-5 flex items-center space-x-3">
                {file.thumbnailUrl ? (
                  <img 
                    src={file.thumbnailUrl} 
                    alt={file.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.mimeType)}`}>
                    <Icon 
                      name={getFileTypeIcon(file.mimeType)} 
                      className="h-5 w-5 text-white" 
                    />
                  </div>
                )}
                
                {isRenaming ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 text-sm font-medium border border-gray-300 rounded px-2 py-1"
                    autoFocus
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename()
                      if (e.key === 'Escape') setIsRenaming(false)
                    }}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {file.type}
                    </p>
                  </div>
                )}
              </div>
      
              {/* Size */}
              <div className="col-span-2 sm:col-span-2">
                <span className="text-sm text-gray-600">{formatFileSize(file.size)}</span>
              </div>
      
              {/* Modified */}
              <div className="col-span-2 sm:col-span-3 hidden sm:block">
                <span className="text-sm text-gray-600">
                  {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                </span>
              </div>
      
              {/* Actions */}
              <div className="col-span-2 sm:col-span-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setIsRenaming(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name="Edit2" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Icon name="Trash2" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      }
      
      export default FileRowItem