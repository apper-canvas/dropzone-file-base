import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import NavigationItem from '@/components/molecules/NavigationItem'
      import ProgressBarWithInfo from '@/components/molecules/ProgressBarWithInfo'
      
      const Sidebar = ({ navigationItems, activeView, handleNavigation }) => {
        return (
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
            <div className="flex flex-col flex-1 min-h-0">
              {/* Logo */}
              <div className="flex items-center h-16 px-6 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Upload" className="h-5 w-5 text-white" />
                  </div>
                  <Text type="span" className="text-xl font-bold text-gray-900">DropZone</Text>
                </div>
              </div>
      
              {/* Navigation */}
              <nav className="mt-6 flex-1 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem 
                    key={item.id} 
                    item={item} 
                    activeView={activeView} 
                    handleNavigation={handleNavigation} 
                  />
                ))}
              </nav>
      
              {/* Storage Info */}
              <ProgressBarWithInfo />
            </div>
          </div>
        )
      }
      
      export default Sidebar