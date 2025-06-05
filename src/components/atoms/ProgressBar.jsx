const ProgressBar = ({ progress, className = '', barClassName = '' }) => {
        return (
          <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
            <div 
              className={`h-full bg-secondary rounded-full transition-all duration-300 upload-progress-shimmer ${barClassName}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )
      }
      
      export default ProgressBar