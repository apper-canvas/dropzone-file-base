const Text = ({ children, type = 'p', className = '', ...props }) => {
        const Tag = type
        return (
          <Tag className={className} {...props}>
            {children}
          </Tag>
        )
      }
      
      export default Text