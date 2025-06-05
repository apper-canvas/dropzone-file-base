import { useRef, useState } from 'react'
      import { motion } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'
      
      const UploadDropzone = ({ onFilesSelected }) => {
        const [isDragOver, setIsDragOver] = useState(false)
        const fileInputRef = useRef(null)
      
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
          onFilesSelected(droppedFiles)
        }
      
        const handleFileSelect = (event) => {
          const selectedFiles = Array.from(event.target.files)
          onFilesSelected(selectedFiles)
        }
      
        return (
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
                <Icon 
                  name={isDragOver ? 'Download' : 'Upload'} 
                  className="h-8 w-8" 
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isDragOver ? 'Drop files here' : 'Drag files here or click to browse'}
                </h3>
                <Text type="p" className="text-gray-600">
                  Upload multiple files at once. All file types supported.
                </Text>
              </div>
              
              <Button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                <Icon name="Plus" className="h-5 w-5 mr-2" />
                Select Files
              </Button>
            </div>
          </motion.div>
        )
      }
      
      export default UploadDropzone