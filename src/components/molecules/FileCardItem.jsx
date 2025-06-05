import { useState } from 'react'
      import { motion } from 'framer-motion'
      import { format } from 'date-fns'
      import Icon from '@/components/atoms/Icon'
      
      const FileCardItem = ({ file, onDelete, onRename }) => {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden file-card-hover shadow-sm"
          >
            {/* File Preview */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
              {file.thumbnailUrl ? (
                <img 
                  src={file.thumbnailUrl} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getFileTypeColor(file.mimeType)}`}>
                  <Icon 
                    name={getFileTypeIcon(file.mimeType)} 
                    className="h-8 w-8 text-white" 
                  />
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <Icon name="Edit2" className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <Icon name="Trash2" className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
      
            {/* File Info */}
            <div className="p-3">
              {isRenaming ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-sm font-medium border border-gray-300 rounded px-2 py-1"
                    autoFocus
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename()
                      if (e.key === 'Escape') setIsRenaming(false)
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-gray-900 text-sm truncate mb-1" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{format(new Date(file.uploadedAt), 'MMM d')}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      }
      
      export default FileCardItem