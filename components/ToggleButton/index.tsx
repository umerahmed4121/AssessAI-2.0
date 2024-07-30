import React from 'react'

const ToggleButton = ({enable, onChange, className, circleClassName}: {
    enable: boolean,
    onChange: () => void,
    className: string,
    circleClassName: string

}) => {
    return (
        <button

            className={`${className} rounded-full p-1 flex items-center transition-[display] duration-300 ease-in-out ${enable ? 'justify-end bg-secondary' : 'justify-start bg-primary-light border border-primary-light-2'}`}
            onClick={() => {
                onChange()
                enable = !enable
            }}
        >
            <div
                className={`${circleClassName} bg-white rounded-full shadow-md `}
            ></div>
        </button>
    )
}

export default ToggleButton