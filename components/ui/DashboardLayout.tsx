"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiLink } from 'react-icons/fi'
import { Button } from './button'
import { usePathname } from 'next/navigation'
import { Skeleton } from './skeleton'

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    function isActive(path: string) {
        return pathname === path;
    }

    return (
        <div className='min-h-screen text-[#737373] bg-lightGray p-6'>
            <div className='bg-white flex justify-between px-6 py-4 rounded-xl'>
                <div className='flex items-center gap-2 px-8 text-2xl text-primary font-extrabold'>
                    <Image src={'/logo.svg'} width={26} height={26} alt='dev links logo' />
                    devlinks
                </div>
                <div className='flex items-center gap-4'>
                    <Link href={"/link"} className={`text-gray-500 font-semibold flex items-center gap-2 px-[27px] py-[11px] rounded-lg ${isActive("/link") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                        <FiLink size={20} strokeWidth={2.2} />
                        Links
                    </Link>
                    <Link href={"/profile"} className={`font-semibold flex items-center text-gray-500 gap-2 px-[27px] py-[11px] rounded-lg ${isActive("/profile") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                        <CgProfile size={20} />
                        Profile Details
                    </Link>
                </div>
                <Button variant={'outline'} className='max-w-[114px]'>Preview</Button>
            </div>
            <div className='flex gap-6 my-6'>
                <div className='hidden lg:flex w-[45%]'>
                    <div className='bg-white flex justify-center items-center rounded-xl py-20 w-full'>
                        <div className='max-h-[631px]'>
                            <div className='bg-[url(/assets/icons/phone-outside-frame.svg)] bg-center flex items-center justify-center w-[307px] h-[631px]'>
                                <div className='bg-[url(/assets/icons/phone-inner-frame.svg)] bg-center flex justify-center w-[285px] h-[611px] px-[23px] pt-[53px]'>
                                    <div className='flex flex-col items-center w-full'>
                                        <Skeleton className="size-24 rounded-full mb-[25px]" />
                                        <Skeleton className="w-[160px] h-4 rounded-full mb-[13px]" />
                                        <Skeleton className="w-[72px] h-2 rounded-full mb-[56px]" />
                                        <div className='w-full flex flex-col gap-5'>
                                            <Skeleton className="w-full h-11 rounded-lg" />
                                            <Skeleton className="w-full h-11 rounded-lg" />
                                            <Skeleton className="w-full h-11 rounded-lg" />
                                            <Skeleton className="w-full h-11 rounded-lg" />
                                            <Skeleton className="w-full h-11 rounded-lg" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white w-[55%] flex flex-grow rounded-xl'>
                    {children}
                </div>
            </div>
        </div>
    )
}
