"use client"

import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { IoCloudUpload } from 'react-icons/io5'

type InputProps = {
    name: string
    label: string
    required?: boolean
    hidden?: boolean
    getRef?: (ref: HTMLInputElement | null) => void
    className?: string
    onChange?: (e: any) => void
    height?: string
    multiple?: boolean
    accept?: string
    value?: string
}

const InputFile = ({
    name,
    label,
    required,
    hidden,
    getRef,
    className,
    onChange,
    value,
    height,
    multiple,
    accept,
    ...props
}: InputProps
) => {

    const h = height ? `h-[${height}]` : 'h-32'
    const [imagePreview, setImagePreview] = useState<File[] | []>([])

    const [wrapperWidth, setWrapperWidth] = useState<number>(0)

    const wrapperRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (wrapperRef) {
            setWrapperWidth(wrapperRef.current?.offsetWidth as number)
            console.log(wrapperWidth);
        }
    }, [])



    return (
        <>
            <div
                ref={wrapperRef}
                className={`mt-2 border border-faded rounded-md p-2 min-w-32 w-full`}
                style={{ height: height }}
            >
                <span className='max-w-[27%] absolute text-xs -translate-y-4 px-1 bg-primary dark:bg-dark_secondary'>{label}</span>
                <input
                    type='file'
                    id={name}
                    name={name}
                    required={required}
                    value={value}
                    multiple={multiple}
                    accept={accept}
                    onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setImagePreview([...files]);

                        onChange && onChange(e)
                    }
                    }
                    {...props}
                    className='w-full hidden'
                />
                <label htmlFor={name} className='w-full h-full flex items-center gap-2 cursor-pointer overflow-hidden' >
                    {imagePreview.length > 0 ?
                        imagePreview.map((img, index) => (
                            <div key={index} className='w-full h-full'>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt='image'
                                    className='object-contain w-full h-full'
                                    
                                />
                            </div>
                        ))
                        :
                        <div className='w-full flex flex-col'>
                            <span className='flex justify-center text-5xl'><IoCloudUpload /></span>

                            <span className='text-center'>
                                {multiple ? 'Choose files...' : 'Choose a file...'}
                            </span>
                        </div>
                    }


                </label>

            </div>

        </>
    )
}

export default InputFile
