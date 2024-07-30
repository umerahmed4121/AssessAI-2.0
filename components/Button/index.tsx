"use client"

import clsx from 'clsx';
import React from 'react'
import styles from './index.module.css'
import { useFormStatus } from 'react-dom';

type ButtonProps = {
    appearance: 'primary' | 'secondary'
    type: 'submit' | 'button' | 'reset'
    children: React.ReactNode
    disabled?: boolean
    color?: string
    background?: string
    onClick?: (e?: any) => void
    className?: string
    height?: string

}

const Button = ({
    appearance,
    type,
    children,
    disabled,
    color,
    background,
    className,
    onClick,
    height,
    ...props
} : ButtonProps

) => {

    const { pending } = useFormStatus();

    const h = `h-[${height}]`
    
    return (
        <button
        type={type}
        disabled={disabled || pending}
        aria-disabled={pending || false}
        onClick={onClick}
        className={clsx(
            styles.button,
            styles[appearance],
            (disabled || pending)  && styles.disabled,
            className,
            height && h
        )
        }
        {...props}
        >
            {children}
        </button>

    )
}

export default Button