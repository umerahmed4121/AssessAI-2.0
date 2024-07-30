import React from 'react'
import { MdOutlineCancel } from "react-icons/md";

const Modal = ({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    type
}:{
    title: string,
    description: string,
    isOpen: boolean,
    onClose: () => void
    onConfirm: () => void
    type?: 'DELETE' | 'CONFIRM'
}) => {

    if(!isOpen) return null

  return (
    <div
    className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center'
    >
        <div
        className='bg-white text-gray-700 p-4 rounded-md shadow-md z-60'
        >
            <div
            className={`flex justify-between items-center p-2 rounded-t-md text-white ${type === 'DELETE' && 'bg-red-600'} ${type === "CONFIRM" && 'bg-blue-700'}`}
            >
            <h1 className="text-xl font-bold">{title}</h1>
            <button
            onClick={onClose}
            >
            <MdOutlineCancel />
            </button>
            </div>
            <p
            className='px-2 py-6'
            >{description}</p>
            <div
            className='flex justify-between'
            >
            <button
            onClick={onClose}
            className='border border-gray-500  p-2 rounded-md'
            >
                Cancel
            </button>
            <button
            onClick={onConfirm}
            className='bg-red-600 text-white     p-2 rounded-md'
            >
                Confirm
            </button>
            </div>
        </div>

    </div>
  )
}

export default Modal