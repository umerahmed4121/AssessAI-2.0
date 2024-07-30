import React from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Toast = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      limit={1}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  )
}

export {Toast, toast}