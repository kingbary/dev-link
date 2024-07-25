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
import PhonePreview from './PhonePreview'

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    function isActive(path: string) {
        return pathname === path;
    }
    const session = useSession();
    const id = session.data?.user.id
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
                <Link href={`/link-preview/${id}`} className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary min-h-[46px] px-4 py-2'>
                    <span className='hidden sm:block'>Preview</span>
                    <MdOutlineRemoveRedEye size={20} className='sm:hidden' />
                </Link>
            </div>
            <div className='flex gap-6 my-6 max-h-[771px]'>
                <div className='hidden lg:flex w-[45%]'>
                    <div className='bg-white flex justify-center items-center rounded-xl py-20 w-full'>
                        <PhonePreview />
                    </div>
                </div>
                <div className='bg-white w-[55%] flex flex-grow rounded-xl'>
                    {children}
                </div>
            </div>
        </div>
    )
}
