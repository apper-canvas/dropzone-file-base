const Button = ({ children, className = '', onClick, disabled, ...props }) => {
        return (
          <button
            onClick={onClick}
            disabled={disabled}
            className={`
              inline-flex items-center justify-center transition-colors
              ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'active:scale-[0.98] transition-transform'
              }
              ${className}
            `}
            {...props}
          >
            {children}
          </button>
        )
      }
      
      export default Button