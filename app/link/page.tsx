import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import LinkCard from '@/components/LinkCard'
import React from 'react'
import Image from 'next/image'

export default function Link() {
    return (
        <DashboardLayout>
            <div>
                <div className='w-full flex flex-col gap-6 px-5 py-6 sm:p-10 max-h-[150vh] overflow-y-scroll scrollbar-hide'>
                    <div className='mb-10'>
                        <h2 className='text-2xl sm:text-[32px] text-primary font-bold'>Customize your links</h2>
                        <p>Add/edit/remove links below and then share all your profiles with the world!</p>
                    </div>
                    <Button variant={"outline"}>+ Add new link</Button>
                    <div className='bg-lightGray p-0 sm:p-5 rounded-xl flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center p-5 sm:p-10'>
                            <Image src={"/assets/icons/illustration.svg"} width={249} height={160} alt='' />
                            <h2 className='text-2xl sm:text-[32px] text-primary font-bold mt-10 mb-6'>Let’s get you started</h2>
                            <p className='text-center'>Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them. We’re here to help you share your profiles with everyone!</p>
                        </div>
                    </div>
                    <div className='pb-10 flex flex-col gap-6'>
                        <LinkCard />
                    </div>
                </div>
                <div className='border-t border-[#D9D9D9] px-10 py-6'>
                    <div className='flex justify-end'>
                        <Button className='max-w-[91px]'>Save</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
