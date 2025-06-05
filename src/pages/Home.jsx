import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [activeView, setActiveView] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const navigationItems = [
    { id: 'all', label: 'All Files', icon: 'Folder', active: true },
    { id: 'recent', label: 'Recent Uploads', icon: 'Clock', active: true },
    { id: 'shared', label: 'Shared', icon: 'Share2', active: false, comingSoon: true },
    { id: 'folders', label: 'Folders', icon: 'FolderOpen', active: false, comingSoon: true },
    { id: 'trash', label: 'Trash', icon: 'Trash2', active: false, comingSoon: true }
  ]

  const handleNavigation = (itemId) => {
    const item = navigationItems.find(nav => nav.id === itemId)
    if (item?.active) {
      setActiveView(itemId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Upload" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DropZone</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 px-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                disabled={item.comingSoon}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors
                  ${activeView === item.id && item.active
                    ? 'bg-primary-light bg-opacity-10 text-primary border-r-2 border-primary'
                    : item.active
                    ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`mr-3 h-5 w-5 ${
                    activeView === item.id && item.active ? 'text-primary' : item.active ? 'text-gray-400' : 'text-gray-300'
                  }`} 
                />
                {item.label}
                {item.comingSoon && (
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Storage Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage</span>
                <ApperIcon name="Info" className="h-4 w-4 text-gray-400" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">4.5 GB of 10 GB used</p>
              <p className="text-xs text-gray-400 mt-1">Analytics coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Logo */}
              <div className="flex items-center lg:hidden">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Upload" className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DropZone</span>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-4 lg:mx-8">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search functionality coming soon..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-3">
                <button
                  disabled
                  className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
                >
                  <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button
                  disabled
                  className="p-2 text-gray-400 hover:text-gray-500 cursor-not-allowed"
                  title="Settings coming soon"
                >
                  <ApperIcon name="Settings" className="h-5 w-5" />
                </button>
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
                <p className="text-gray-600">
                  {activeView === 'all' 
                    ? 'Upload and manage your files with ease' 
                    : 'Your recently uploaded files'
                  }
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="List" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feature Component */}
          <MainFeature viewMode={viewMode} activeView={activeView} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-20">
        <div className="flex justify-around">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              disabled={item.comingSoon}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                activeView === item.id && item.active
                  ? 'text-primary'
                  : item.active
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              <ApperIcon name={item.icon} className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home