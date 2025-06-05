import { useState, useEffect, useRef } from 'react'
      import { toast } from 'react-toastify'
      import { fileService } from '@/services'
      import Sidebar from '@/components/organisms/Sidebar'
      import MobileNavigation from '@/components/organisms/MobileNavigation'
      import UploadDropzone from '@/components/organisms/UploadDropzone'
      import ActiveUploadsPanel from '@/components/organisms/ActiveUploadsPanel'
      import FileDisplaySection from '@/components/organisms/FileDisplaySection'
      import Icon from '@/components/atoms/Icon'
      import Button from '@/components/atoms/Button'
      import SearchBar from '@/components/molecules/SearchBar'
      import Text from '@/components/atoms/Text'
      
      const HomePage = () => {
        const [activeView, setActiveView] = useState('all')
        const [viewMode, setViewMode] = useState('grid')
        const [files, setFiles] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [activeUploads, setActiveUploads] = useState([])
        
        const navigationItems = [
          { id: 'all', label: 'All Files', icon: 'Folder', active: true },
          { id: 'recent', label: 'Recent Uploads', icon: 'Clock', active: true },
          { id: 'shared', label: 'Shared', icon: 'Share2', active: false, comingSoon: true },
          { id: 'folders', label: 'Folders', icon: 'FolderOpen', active: false, comingSoon: true },
          { id: 'trash', label: 'Trash', icon: 'Trash2', active: false, comingSoon: true }
        ]
      
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
      
        const handleNavigation = (itemId) => {
          const item = navigationItems.find(nav => nav.id === itemId)
          if (item?.active) {
            setActiveView(itemId)
          }
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
                <Icon name="AlertTriangle" className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Files</h3>
              <Text type="p" className="text-gray-600 mb-4">{error}</Text>
              <Button
                onClick={loadFiles}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </Button>
            </div>
          )
        }
      
        return (
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar 
              navigationItems={navigationItems} 
              activeView={activeView} 
              handleNavigation={handleNavigation} 
            />
      
            <div className="flex-1 lg:pl-64">
              {/* Header */}
              <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    {/* Mobile Logo */}
                    <div className="flex items-center lg:hidden">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <Icon name="Upload" className="h-5 w-5 text-white" />
                      </div>
                      <Text type="span" className="text-xl font-bold text-gray-900">DropZone</Text>
                    </div>
      
                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-4 lg:mx-8">
                      <SearchBar placeholder="Search functionality coming soon..." disabled />
                    </div>
      
                    {/* Header Actions */}
                    <div className="flex items-center space-x-3">
                      <Button
                        disabled
                        className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
                      >
                        <Icon name="Filter" className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        disabled
                        className="p-2 text-gray-400 hover:text-gray-500 cursor-not-allowed"
                        title="Settings coming soon"
                      >
                        <Icon name="Settings" className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
      
              {/* Page Content */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Header */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {activeView === 'all' ? 'All Files' : 'Recent Uploads'}
                      </h1>
                      <Text type="p" className="text-gray-600">
                        {activeView === 'all' 
                          ? 'Upload and manage your files with ease' 
                          : 'Your recently uploaded files'
                        }
                      </Text>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                          onClick={() => setViewMode('grid')}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'grid' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon name="Grid3X3" className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setViewMode('list')}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'list' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon name="List" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="space-y-6">
                  <UploadDropzone onFilesSelected={handleFileUpload} />
                  <ActiveUploadsPanel activeUploads={activeUploads} cancelUpload={cancelUpload} />
                  <FileDisplaySection 
                    files={files} 
                    viewMode={viewMode} 
                    onDelete={deleteFile} 
                    onRename={renameFile} 
                    activeView={activeView}
                  />
                </div>
              </main>
            </div>
      
            <MobileNavigation 
              navigationItems={navigationItems} 
              activeView={activeView} 
              handleNavigation={handleNavigation} 
            />
          </div>
        )
      }
      
      export default HomePage