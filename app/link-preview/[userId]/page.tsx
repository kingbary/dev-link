import SocialsCardLink from '@/components/SocialsCardLink'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaLinkedin } from 'react-icons/fa6'
import { IoLogoYoutube } from 'react-icons/io5'
import { PiGithubLogoFill } from 'react-icons/pi'

export default function Page() {
    return (
        <div className='bg-lightGray pb-20 min-h-screen'>
            <div className='sm:bg-secondary px-6 pt-6 pb-4 sm:pb-[255px] rounded-b-[32px]'>
                <div className='sm:bg-white flex justify-between w-full sm:px-6 py-4 rounded-xl'>
                    <Link href={"/"} className='flex items-center px-4 font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary rounded-md h-[46px]'>Back to editor</Link>
                    <Button className='w-fit  sm:max-w-[114px]'>Share Link</Button>
                </div>
            </div>
            <div className='flex justify-center mt-0 sm:-mt-36'>
                <div className='sm:bg-white w-full max-w-[348px] flex flex-col justify-center px-14 py-12 rounded-3xl sm:shadow-grayShadow'>
                    <div className='flex flex-col items-center gap-6 mb-14'>
                        <div className='flex items-center justify-center size-[104px] border-[4px] border-secondary rounded-full overflow-hidden'>
                            <Image src={"/assets/images/avatar3.png"} width={104} height={104} alt='' />
                        </div>
                        <div>
                            <h1 className='text-[32px] text-center font-bold'>Ben Wright</h1>
                            <p className='text-center'>ben@example.com</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <SocialsCardLink bgColor='bg-primary' link='skdskdd' platformName='Github' platformIcon={<PiGithubLogoFill />} />
                        <SocialsCardLink bgColor='bg-[#EE3939]' link='skdskdd' platformName='Youtube' platformIcon={<IoLogoYoutube />} />
                        <SocialsCardLink bgColor='bg-[#2D68FF]' link='skdskdd' platformName='LinkedIn' platformIcon={<FaLinkedin />} />
                    </div>
                </div>
            </div>
        </div>
    )
}
