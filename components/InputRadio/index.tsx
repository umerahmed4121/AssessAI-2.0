"use client"

import React from 'react'
import styles from './index.module.css'

interface InputRadioProps {
    name: string
    label: string
    value: string
    required?: boolean
    disabled?: boolean
    className?: string
    defaultChecked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputRadio = (
    {
        name,
        label,
        value,
        required,
        disabled,
        defaultChecked,
        onChange,
        className
    }: InputRadioProps
) => {
    return (

        <div className={`${styles.wrapper} ${className}`}>
            <input 
                id={value}
                type='radio'
                name={name}
                value={value}
                required={required}
                disabled={disabled}
                defaultChecked={defaultChecked}
                onChange={onChange}
                
                
            />
            <label htmlFor={value}>{label}</label>
        </div>
    )
}

export default InputRadio