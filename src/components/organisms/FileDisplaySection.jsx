import Icon from '@/components/atoms/Icon'
      import Button from '@/components/atoms/Button'
      import Text from '@/components/atoms/Text'
      import FileCardItem from '@/components/molecules/FileCardItem'
      import FileRowItem from '@/components/molecules/FileRowItem'
      
      const FileDisplaySection = ({ files, viewMode, onDelete, onRename, activeView }) => {
        if (files.length === 0) {
          return (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FolderOpen" className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeView === 'recent' ? 'No recent uploads' : 'No files uploaded yet'}
              </h3>
              <Text type="p" className="text-gray-600">
                {activeView === 'recent' 
                  ? 'Files uploaded in the last 7 days will appear here'
                  : 'Start by uploading your first file using the area above'
                }
              </Text>
            </div>
          )
        }
      
        return (
          <>
            {/* Files Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {files.length} file{files.length !== 1 ? 's' : ''}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  disabled
                  className="px-3 py-1 text-sm text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
                  title="Bulk operations coming soon"
                >
                  <Icon name="CheckSquare" className="h-4 w-4 mr-1 inline" />
                  Select
                </Button>
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
                  <FileCardItem 
                    key={file.id} 
                    file={file} 
                    onDelete={onDelete}
                    onRename={onRename}
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
                    <FileRowItem 
                      key={file.id} 
                      file={file} 
                      onDelete={onDelete}
                      onRename={onRename}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )
      }
      
      export default FileDisplaySection