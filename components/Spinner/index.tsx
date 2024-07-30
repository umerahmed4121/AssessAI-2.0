import React from 'react'
import { ThreeDots } from 'react-loader-spinner';
import { colors } from '@/constants'

const Spinner = ({ visible, className }: { visible: boolean, className?: string }) => {
  return (
    <div className={`w-full p-1 flex justify-center items-center ${className}`}>
      <ThreeDots
        visible={visible}
        height="80"
        width="80"
        color={colors.secondary}
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default Spinner