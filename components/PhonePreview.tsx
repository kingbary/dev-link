import React, { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'
import { fetchLinks } from '@/utils/query/get-link-data'
import { useSession } from 'next-auth/react'
import { FaArrowRight } from 'react-icons/fa6'
import Link from 'next/link'
import { socialsObject } from '@/utils/data/data'

export default async function PhonePreview() {
    const { data } = useSession()

    const linksData = fetchLinks(data?.user.id ?? '')
    const { links } = await linksData

    const skeleton = <div className='w-full flex flex-col gap-5'>
        <Skeleton className="w-full h-11 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-lg" />
    </div>

    return (
        <div className='max-h-[631px]'>
            <div className='bg-[url(/assets/icons/phone-outside-frame.svg)] bg-center flex items-center justify-center w-[307px] h-[631px]'>
                <div className='bg-[url(/assets/icons/phone-inner-frame.svg)] bg-center flex justify-center w-[285px] h-[611px] px-[23px] pt-[53px]'>
                    <div className='flex flex-col items-center w-full'>
                        <Skeleton className="size-24 rounded-full mb-[25px]" />
                        <Skeleton className="w-[160px] h-4 rounded-full mb-[13px]" />
                        <Skeleton className="w-[72px] h-2 rounded-full mb-[56px]" />
                        {!links?.length
                            ? skeleton
                            : <Suspense fallback={skeleton}>
                                <div className='w-full flex flex-col gap-5'>
                                    {links.map((item) => {
                                        const color = socialsObject[item.platform as keyof typeof socialsObject]?.color ?? ''
                                        return (
                                            <Link key={item.uid} href={item.url} className={`w-full flex items-center justify-between h-11 px-3 text-white rounded-lg bg-[${color}] hover:opacity-80`}>
                                                {item.platform}
                                                <FaArrowRight size={16} color='white' />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </Suspense>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
