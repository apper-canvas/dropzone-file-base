import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import { fileService, uploadProgressService } from '../services'

const MainFeature = ({ viewMode, activeView }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeUploads, setActiveUploads] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState(new Set())
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadFiles()
  }, [activeView])

  const loadFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fileService.getAll()
      const filteredFiles = activeView === 'recent' 
        ? result.filter(file => {
            const uploadDate = new Date(file.uploadedAt)
            const daysDiff = (Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff <= 7
          })
        : result
      setFiles(filteredFiles)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files)
    handleFileUpload(selectedFiles)
  }

  const handleFileUpload = async (filesToUpload) => {
    if (!filesToUpload?.length) return

    const uploadPromises = filesToUpload.map(async (file) => {
      const fileId = `upload-${Date.now()}-${Math.random()}`
      
      // Create upload progress entry
      const uploadProgress = {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        bytesUploaded: 0,
        totalBytes: file.size,
        percentage: 0,
        speed: 0,
        timeRemaining: 0,
        status: 'uploading'
      }

      setActiveUploads(prev => [...prev, uploadProgress])

      try {
        // Simulate file upload with progress updates
        const uploadResult = await simulateFileUpload(file, fileId, (progress) => {
          setActiveUploads(prev => 
            prev.map(upload => 
              upload.fileId === fileId 
                ? { ...upload, ...progress }
                : upload
            )
          )
        })

        // Create file entry
        const newFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          lastModified: file.lastModified,
          thumbnailUrl: await generateThumbnail(file),
          downloadUrl: uploadResult.downloadUrl,
          status: 'completed'
        }

        const savedFile = await fileService.create(newFile)
        setFiles(prev => [savedFile, ...prev])
        
        // Remove from active uploads
        setActiveUploads(prev => prev.filter(upload => upload.fileId !== fileId))
        
        toast.success(`${file.name} uploaded successfully!`)
        
        return savedFile
      } catch (error) {
        setActiveUploads(prev => 
          prev.map(upload => 
            upload.fileId === fileId 
              ? { ...upload, status: 'failed' }
              : upload
          )
        )
        toast.error(`Failed to upload ${file.name}`)
        throw error
      }
    })

    try {
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Some uploads failed:', error)
    }
  }

  const simulateFileUpload = (file, fileId, onProgress) => {
    return new Promise((resolve, reject) => {
      const totalSize = file.size
      let uploadedSize = 0
      const chunkSize = Math.max(totalSize / 20, 1024) // Upload in 20 chunks minimum
      const startTime = Date.now()

      const uploadChunk = () => {
        uploadedSize += chunkSize
        if (uploadedSize > totalSize) uploadedSize = totalSize

        const percentage = Math.round((uploadedSize / totalSize) * 100)
        const elapsedTime = (Date.now() - startTime) / 1000
        const speed = uploadedSize / elapsedTime // bytes per second
        const remainingBytes = totalSize - uploadedSize
        const timeRemaining = remainingBytes / speed

        onProgress({
          bytesUploaded: uploadedSize,
          percentage,
          speed,
          timeRemaining,
          status: 'uploading'
        })

        if (uploadedSize >= totalSize) {
          resolve({
            downloadUrl: `https://storage.dropzone.app/files/${fileId}/${file.name}`
          })
        } else {
          setTimeout(uploadChunk, Math.random() * 200 + 100) // Random delay 100-300ms
        }
      }

      uploadChunk()
    })
  }

  const generateThumbnail = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  }

  const cancelUpload = (fileId) => {
    setActiveUploads(prev => prev.filter(upload => upload.fileId !== fileId))
    toast.info('Upload cancelled')
  }

  const deleteFile = async (fileId) => {
    try {
      await fileService.delete(fileId)
      setFiles(prev => prev.filter(file => file.id !== fileId))
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  const renameFile = async (fileId, newName) => {
    try {
      const updatedFile = await fileService.update(fileId, { name: newName })
      setFiles(prev => prev.map(file => file.id === fileId ? updatedFile : file))
      toast.success('File renamed successfully')
    } catch (error) {
      toast.error('Failed to rename file')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond) => {
    return formatFileSize(bytesPerSecond) + '/s'
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${Math.round(seconds % 60)}s`
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

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileUpload(droppedFiles)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Files</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadFiles}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary bg-opacity-5 scale-[1.02]' 
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <ApperIcon 
              name={isDragOver ? 'Download' : 'Upload'} 
              className="h-8 w-8" 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop files here' : 'Drag files here or click to browse'}
            </h3>
            <p className="text-gray-600">
              Upload multiple files at once. All file types supported.
            </p>
          </div>
          
          <button className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            Select Files
          </button>
        </div>
      </motion.div>

      {/* Active Uploads Panel */}
      <AnimatePresence>
        {activeUploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glassmorphic rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Uploading {activeUploads.length} file{activeUploads.length !== 1 ? 's' : ''}
              </h3>
              <ApperIcon name="Upload" className="h-5 w-5 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-3">
              {activeUploads.map((upload) => (
                <div key={upload.fileId} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(upload.fileName.split('.').pop())}`}>
                        <ApperIcon 
                          name={getFileTypeIcon(upload.fileName)} 
                          className="h-5 w-5 text-white" 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-48">
                          {upload.fileName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(upload.fileSize)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {upload.percentage}%
                        </p>
                        {upload.speed > 0 && (
                          <p className="text-xs text-gray-500">
                            {formatSpeed(upload.speed)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => cancelUpload(upload.fileId)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-300 upload-progress-shimmer"
                      style={{ width: `${upload.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files Display */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FolderOpen" className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeView === 'recent' ? 'No recent uploads' : 'No files uploaded yet'}
          </h3>
          <p className="text-gray-600">
            {activeView === 'recent' 
              ? 'Files uploaded in the last 7 days will appear here'
              : 'Start by uploading your first file using the area above'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Files Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                disabled
                className="px-3 py-1 text-sm text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
                title="Bulk operations coming soon"
              >
                <ApperIcon name="CheckSquare" className="h-4 w-4 mr-1 inline" />
                Select
              </button>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
                <option>Sort by Date</option>
                <option>Sort by Name</option>
                <option>Sort by Size</option>
                <option>Sort by Type</option>
              </select>
            </div>
          </div>

          {/* Files Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {files.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  onDelete={deleteFile}
                  onRename={renameFile}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6 sm:col-span-5">Name</div>
                  <div className="col-span-2 sm:col-span-2">Size</div>
                  <div className="col-span-2 sm:col-span-3 hidden sm:block">Modified</div>
                  <div className="col-span-2 sm:col-span-2">Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {files.map((file) => (
                  <FileRow 
                    key={file.id} 
                    file={file} 
                    onDelete={deleteFile}
                    onRename={renameFile}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const FileCard = ({ file, onDelete, onRename }) => {
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
            <ApperIcon 
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
              <ApperIcon name="Edit2" className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 text-red-600" />
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

const FileRow = ({ file, onDelete, onRename }) => {
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
              <ApperIcon 
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
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainFeature