"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'

type InputProps = {
  label: string
  name: string
  height?: number
  required?: boolean
  hidden?: boolean
  getRef?: (ref: HTMLTextAreaElement | null) => void
  className?: string
  onChange?: (e: any) => void
  onKeyUp?: (e: any) => void
  onBlur?: (e: any) => void

  value?: string
}

const InputTextArea = ({
  label,
  name,
  height =100,
  required,
  hidden,
  getRef,
  className,
  onChange,
  onKeyUp,
  onBlur,
  value,
  ...props
}: InputProps
) => {

  const labelRef = useRef<HTMLLabelElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  getRef && getRef(inputRef.current)


  return (
    <>
      <div className={`${styles.wrapper} ${className}`} >

        <textarea
          ref={inputRef}
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          style={{
            resize: 'none',
            height: (height && height > 50) ? `${height}px` : '50px'
          }}
          onFocus={() => {
            if(height && height > 50){
              labelRef.current?.setAttribute('style', `transform: translateY(-${(height * 0.5)}px)`)
            }
            
          }}
          onBlur={() => {
            if(height && height > 50){
              if(!inputRef.current?.value){
                labelRef.current?.setAttribute('style', `transform: translateY(-${((height * 0.5) - 25)}px); font-size: 1rem;`)
              }
            }
            onBlur && onBlur(inputRef.current?.value)
            
          }}
          {...props}
        />
        <label
          ref={labelRef}
          htmlFor={name}
          style={{
            transform: `translateY(-${(height && height > 50) ? ((height * 0.5) - 25) : 0}px)`,
          }}

        >
          {label}
        </label>
      </div>

    </>
  )
}

export default InputTextArea
