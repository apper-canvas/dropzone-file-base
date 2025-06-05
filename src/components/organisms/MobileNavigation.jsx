import Icon from '@/components/atoms/Icon'
      import Button from '@/components/atoms/Button'
      
      const MobileNavigation = ({ navigationItems, activeView, handleNavigation }) => {
        return (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-20">
            <div className="flex justify-around">
              {navigationItems.slice(0, 4).map((item) => (
                <Button
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
                  <Icon name={item.icon} className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>
        )
      }
      
      export default MobileNavigation