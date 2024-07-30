import React from 'react'

const Page = (
    {
        children,
        showPage

    }: {
        children: React.ReactNode,
        showPage: boolean
    }
) => {
    return (
        <div
            className={`${showPage ? "w-full h-auto opacity-100" : "w-0 h-0 opacity-0"}`}
        >
            {children}
        </div>
    )
}

export default Page