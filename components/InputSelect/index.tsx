
import React, { useRef } from 'react'
import styles from './index.module.css'

type InputSelectProps = {
    name: string
    label: string
    required?: boolean
    className?: string
    defaultValue?: string
    value?: string
    onChange?: (e: any) => void
    children: React.ReactNode
}

const InputSelect = (
    {
        name,
        label,
        required,
        defaultValue,
        value,
        onChange,
        className,
        children
    }: InputSelectProps

) => {

    const selectRef = useRef<HTMLSelectElement>(null)

    return (
        <div className={`${styles.wrapper} ${className}`} >

            <select
                ref={selectRef}
                name={name}
                required={required}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}

            >
                <option  disabled>--- Select a {label.toLowerCase()} ---</option>
                {children}
            </select>
            <label
                htmlFor={name}
                onClick={()=>{
                    selectRef.current?.focus()
                }}
            >
                {label}
            </label>
        </div>
    )
}

export default InputSelect