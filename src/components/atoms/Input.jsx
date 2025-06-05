const Input = ({ className = '', type = 'text', ...props }) => {
        return (
          <input
            type={type}
            className={`
              w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              ${className}
            `}
            {...props}
          />
        )
      }
      
      export default Input