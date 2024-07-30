"use client"

import React from 'react'
import { Bars } from 'react-loader-spinner'
import { colors } from '@/constants'

const Loader = ({visible, dashboard} : {
    visible: boolean,
    dashboard?: boolean
}) => {
    return (
        visible && (
        <div 
        className={`fixed z-20 bg-[#00000080] my_blur flex justify-center items-center ${dashboard?"h-[calc(100vh-60px)] w-full sm:w-[70%] lg:w-[80%] top-[60px] sm:left-[30%] lg:left-[20%]":"w-full h-screen top-0 left-0"}`}>

        <Bars
            height="80"
            width="80"
            color={colors.secondary}
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    </div>)
        
    )
}

export default Loader