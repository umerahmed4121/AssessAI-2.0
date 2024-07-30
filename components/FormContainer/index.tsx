import React from 'react'

const FormContainer = (
    { children }:
    { children: React.ReactNode }
) => {
  return (
    <div className='flex flex-col m-auto px-[8vw] sm:max-w-sm  sm:px-10 items-center justify-center mt-[10vh]'>
        {children}
    </div>
  )
}

export default FormContainer