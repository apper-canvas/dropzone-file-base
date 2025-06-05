import { motion, AnimatePresence } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import ProgressBar from '@/components/atoms/ProgressBar'
      import Text from '@/components/atoms/Text'
      
      const ActiveUploadsPanel = ({ activeUploads, cancelUpload }) => {
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
      
        const getFileTypeIcon = (fileName) => {
          const mimeType = fileName.split('.').pop() // Simple extension based mime type
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(mimeType)) return 'Image'
          if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(mimeType)) return 'Video'
          if (['mp3', 'wav', 'ogg'].includes(mimeType)) return 'Music'
          if (mimeType === 'pdf') return 'FileText'
          if (['doc', 'docx'].includes(mimeType)) return 'FileText'
          if (['xls', 'xlsx'].includes(mimeType)) return 'FileSpreadsheet'
          if (['ppt', 'pptx'].includes(mimeType)) return 'Presentation'
          if (['zip', 'rar', '7z'].includes(mimeType)) return 'Archive'
          return 'File'
        }
      
        const getFileTypeColor = (fileName) => {
          const mimeType = fileName.split('.').pop()
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(mimeType)) return 'bg-green-500'
          if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(mimeType)) return 'bg-red-500'
          if (['mp3', 'wav', 'ogg'].includes(mimeType)) return 'bg-purple-500'
          if (mimeType === 'pdf') return 'bg-red-600'
          if (['doc', 'docx'].includes(mimeType)) return 'bg-blue-600'
          if (['xls', 'xlsx'].includes(mimeType)) return 'bg-green-600'
          if (['ppt', 'pptx'].includes(mimeType)) return 'bg-orange-500'
          if (['zip', 'rar', '7z'].includes(mimeType)) return 'bg-purple-600'
          return 'bg-gray-500'
        }
      
        return (
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
                  <Icon name="Upload" className="h-5 w-5 text-primary animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  {activeUploads.map((upload) => (
                    <div key={upload.fileId} className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(upload.fileName)}`}>
                            <Icon 
                              name={getFileTypeIcon(upload.fileName)} 
                              className="h-5 w-5 text-white" 
                            />
                          </div>
                          <div>
                            <Text type="p" className="font-medium text-gray-900 truncate max-w-48">
                              {upload.fileName}
                            </Text>
                            <Text type="p" className="text-sm text-gray-500">
                              {formatFileSize(upload.fileSize)}
                            </Text>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Text type="p" className="text-sm font-medium text-gray-900">
                              {upload.percentage}%
                            </Text>
                            {upload.speed > 0 && (
                              <Text type="p" className="text-xs text-gray-500">
                                {formatSpeed(upload.speed)}
                              </Text>
                            )}
                          </div>
                          <button
                            onClick={() => cancelUpload(upload.fileId)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Icon name="X" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <ProgressBar progress={upload.percentage} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }
      
      export default ActiveUploadsPanel