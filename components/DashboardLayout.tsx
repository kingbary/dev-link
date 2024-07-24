"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useEffect } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiLink } from 'react-icons/fi'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Skeleton } from './ui/skeleton'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { BeatLoader } from 'react-spinners'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    function isActive(path: string) {
        return pathname === path;
    }
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status === "loading") return;
        if (session.status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [session, router]);

    if (session.status === "loading") {
        return (
            <div className="w-screen h-screen bg-[#FAFAFA] flex justify-center items-center">
                <BeatLoader color="#633CFF" size={20} />
            </div>
        );
    }

    if (session.status === "unauthenticated") {
        toast.error("You're not authorized!");
        return null;
    }

    return (
        <div className='min-h-screen text-[#737373] bg-lightGray p-4 sm:p-6'>
            <div className='bg-white flex justify-between px-0 sm:px-6 py-4 rounded-xl'>
                <div className='flex items-center gap-2 px-0 sm:px-8 text-2xl text-primary font-extrabold'>
                    <Image src={'/logo.svg'} className='size-[32px]' width={26} height={26} alt='dev links logo' />
                    <p className='hidden sm:block'>devlinks</p>
                </div>
                <div className='flex items-center gap-4'>
                    <Link href={"/link"} className={`text-gray-500 font-semibold flex items-center gap-2 px-[27px] py-[11px] rounded-lg ${isActive("/link") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                        <FiLink size={20} strokeWidth={2.2} />
                        <p className='hidden sm:block'>Links</p>
                    </Link>
                    <Link href={"/profile"} className={`font-semibold flex items-center text-gray-500 gap-2 px-[27px] py-[11px] rounded-lg ${isActive("/profile") ? 'bg-lightPurple text-secondary' : 'hover:bg-lightPurple hover:text-secondary'}`}>
                        <CgProfile size={20} />
                        <p className='hidden sm:block'>Profile Details</p>
                    </Link>
                </div>
                <Button variant={'outline'} className='w-fit  sm:max-w-[114px]'>
                    <span className='hidden sm:block'>Preview</span>
                    <MdOutlineRemoveRedEye size={20} className='sm:hidden' />
                </Button>
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
