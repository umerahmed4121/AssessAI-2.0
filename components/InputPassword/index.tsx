"use client"

import React, { useRef, useState } from 'react'
import styles from './index.module.css'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type InputPasswordProps = {
  name: string
  label?: string
  required?: boolean
  hidden?: boolean
  getRef?: any
  className?: string
  onChange?: (e: any) => void
  onKeyUp?: (e: any) => void
  onKeyDown?: (e: any) => void
  value?: string
  autoComplete?: string
}

const InputPassword = ({
  name,
  label,
  required,
  hidden,
  getRef,
  className,
  onChange,
  onKeyDown,
  onKeyUp,
  value,
  autoComplete,
  ...props
}: InputPasswordProps
) => {

  const labelRef = useRef<HTMLLabelElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  getRef && getRef(inputRef)

  return (
    <>
      <div className={`${styles.wrapper} ${className}`} >
        <input
          ref={inputRef}
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          {...props}
          onFocus={() => {
            if (inputRef.current) passwordRef.current?.setAttribute('style', 'border-color: var(--primary); color: var(--primary)')
          }}
          onBlur={() => {
            if (inputRef.current) passwordRef.current?.setAttribute('style', 'border-color: var(--faded) color: var(--faded)')
          }}
          onInvalid={() => {
            if (inputRef.current) passwordRef.current?.setAttribute('style', 'border-color: var(--error) color: var(--error)')
          }}
        />
        <label
          ref={labelRef}
          htmlFor={name}
        >
          {label}
        </label>
        <div
          ref={passwordRef}
          className={styles.passwordToggle}
        >
          {showPassword ? (
            <FaRegEyeSlash
              className='cursor-pointer'
              onClick={() => {
                setShowPassword(!showPassword)
                if (inputRef.current) inputRef.current.type = "password"
              }}
            />
          ) : (
            <FaRegEye
              className='cursor-pointer'
              onClick={() => {
                setShowPassword(!showPassword)
                if (inputRef.current) inputRef.current.type = "text"
              }}
            />
          )
          }
        </div>
      </div>
    </>
  )
}

export default InputPassword