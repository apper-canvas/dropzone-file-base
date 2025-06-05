import Icon from '@/components/atoms/Icon'
      import Input from '@/components/atoms/Input'
      
      const SearchBar = ({ placeholder, disabled = false }) => {
        return (
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={placeholder}
              className={`pl-10 pr-4 py-2 ${disabled ? 'cursor-not-allowed' : ''}`}
              disabled={disabled}
            />
          </div>
        )
      }
      
      export default SearchBar