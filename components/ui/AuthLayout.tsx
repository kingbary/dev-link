import Image from 'next/image'
import React, { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='bg-lightGray min-h-screen flex items-center justify-center text-primary'>
            <div className='flex flex-col items-center'>
                <div className='flex items-center gap-2 mb-[51px] text-[32px] text-primary font-extrabold'>
                    <Image src={'/logo.svg'} width={33} height={33} alt='dev links logo' />
                    devlinks
                </div>
                <div className="bg-white w-full p-10 sm:min-w-[476px] sm:rounded-[12px]">
                    {children}
                </div>
            </div>
        </div>
    )
}
