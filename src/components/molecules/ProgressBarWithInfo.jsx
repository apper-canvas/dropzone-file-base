import ProgressBar from '@/components/atoms/ProgressBar'
      import Label from '@/components/atoms/Label'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      
      const ProgressBarWithInfo = () => {
        return (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Storage</Label>
                <Icon name="Info" className="h-4 w-4 text-gray-400" />
              </div>
              <ProgressBar progress={45} barClassName="bg-primary" />
              <Text type="p" className="text-xs text-gray-500 mt-1">4.5 GB of 10 GB used</Text>
              <Text type="p" className="text-xs text-gray-400 mt-1">Analytics coming soon</Text>
            </div>
          </div>
        )
      }
      
      export default ProgressBarWithInfo