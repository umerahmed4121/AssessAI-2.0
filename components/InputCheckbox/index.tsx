import React from 'react'

interface InputCheckboxProps {
    name: string
    label: string
    value: string
    required?: boolean
    disabled?: boolean
    defaultChecked?: boolean
}

const InputCheckbox = (
    {
        name,
        label,
        value,
        required,
        disabled,
        defaultChecked,
    }: InputCheckboxProps
) => {
    return (

        <label className='flex items-center gap-2'>
            <input
                type='checkbox'
                name={name}
                value={value}
                required={required}
                disabled={disabled}
                defaultChecked={defaultChecked}
            />
            <label htmlFor={name}>{label}</label>
        </label>
    )
}

export default InputCheckbox