import SocialsCardLink from '@/components/SocialsCardLink'
import { Button } from '@/components/ui/button'
import { socialsObject } from '@/utils/data/data'
import { fetchLinks } from '@/utils/query/get-link-data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCircle } from 'react-icons/fa6'

type Params = {
    params: {
        userId: string
    }
}

export default async function Page({ params }: Params) {
    const { userId } = params
    const linksData = fetchLinks(userId as string)
    const { links } = await linksData
    return (
        <div className='bg-lightGray pb-20 min-h-screen'>
            <div className='sm:bg-secondary px-6 pt-6 pb-4 sm:pb-[255px] rounded-b-[32px]'>
                <div className='sm:bg-white flex justify-between w-full sm:px-6 py-4 rounded-xl'>
                    <Link href={"/link"} className='flex items-center px-4 font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary rounded-md h-[46px]'>Back to editor</Link>
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
                        {links?.map((link, idx) => {
                            const color = socialsObject[link.platform as keyof typeof socialsObject]?.color ?? '#1e1e1e'
                            const Icon = socialsObject[link.platform as keyof typeof socialsObject]?.icon ?? FaCircle
                            return (
                                <SocialsCardLink key={idx} bgColor={color} link={link.url} platformName={link.platform} PlatformIcon={Icon} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
