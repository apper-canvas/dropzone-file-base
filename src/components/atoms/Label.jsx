const Label = ({ children, className = '', ...props }) => {
        return (
          <span className={`text-sm text-gray-600 ${className}`} {...props}>
            {children}
          </span>
        )
      }
      
      export default Label