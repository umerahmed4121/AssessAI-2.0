"use client"

import React, { useRef } from 'react'
import styles from './index.module.css'
import { LuAsterisk } from 'react-icons/lu'

type InputProps = {
  type: string
  label: string
  name: string
  required?: boolean
  hidden?: boolean
  getRef?: (ref: HTMLInputElement | null) => void
  className?: string
  onChange?: (e: any) => void
  onKeyUp?: (e: any) => void
  onKeyDown?: (e: any) => void
  value?: string
  min?: number
  max?: number
  style?: React.CSSProperties
  autoComplete?: string
  height?: string
}

const Input = ({
  type,
  label,
  name,
  required,
  hidden,
  getRef,
  className,
  onChange,
  onKeyUp,
  onKeyDown,
  value,
  min,
  max,
  style,
  height,
  autoComplete,
  ...props
}: InputProps
) => {

  const labelRef = useRef<HTMLLabelElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  getRef && getRef(inputRef.current)

  const h = `h-[${height}]`


  return (
    <>
      <div className={`${styles.wrapper} ${className} ${h}`} >

        <input
          ref={inputRef}
          id={name}
          type={type}
          name={name}
          required={required}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          style={style}
          {...props}
        />
        {type === 'color' ?
          (<>

          </>) :
          (<label
            ref={labelRef}
            htmlFor={name}
          >
            {label}
            {required && (
              <span className='text-xs text-red-500'>
                <LuAsterisk />
              </span>

            )}
          </label>)
        }


      </div>
        

    </>
  )
}

export default Input
