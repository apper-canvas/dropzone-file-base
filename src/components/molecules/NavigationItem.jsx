import Icon from '@/components/atoms/Icon'
      import Button from '@/components/atoms/Button'
      
      const NavigationItem = ({ item, activeView, handleNavigation }) => {
        return (
          <Button
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
            <Icon 
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
          </Button>
        )
      }
      
      export default NavigationItem