"use client";
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/ui/DashboardLayout'
import Image from 'next/image'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'

export default function Profile() {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FieldValues>({ mode: "all" })
    const onSubmit = (data: FieldValues) => {
        console.log(data)
    }
    return (
        <DashboardLayout>
            <div className='w-full'>
                <div className='w-full flex flex-col gap-6 p-5 sm:p-10 max-h-[150vh] overflow-y-scroll scrollbar-hide'>
                    <div className='mb-10'>
                        <h2 className='text-[32px] text-primary font-bold'>Profile Details</h2>
                        <p>Add your details to create a personal touch to your profile.</p>
                    </div>
                    <div className='bg-lightGray p-5 rounded-xl w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-3 items-center gap-6'>
                            <p>Profile picture</p>
                            <div className='bg-lightPurple flex flex-col items-center justify-center size-[193px] rounded-xl'>
                                <Image src={"/assets/icons/upload-image-icon.svg"} width={40} height={40} alt='' />
                                <p className='text-secondary font-semibold'>+ Upload Image</p>
                            </div>
                            <p className='text-xs px-4'>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                        </div>
                    </div>
                    <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl w-full'>
                        <div className='flex justify-between flex-col sm:flex-row sm:items-center'>
                            <label htmlFor="firstName" className={`text-xs mb-2 ${errors?.firstName ? "text-destructive" : ""}`}>
                                First Name*
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("firstName", {
                                        required: "Can't be empty"
                                    })}
                                    type="text"
                                    id="firstName"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.firstName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. John'
                                />
                                {errors?.firstName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.firstName.message as string}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                            <label htmlFor="lastName" className={`text-xs mb-2 ${errors?.lastName ? "text-destructive" : ""}`}>
                                Last Name*
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("lastName", {
                                        required: "Can't be empty",
                                    })}
                                    type="email"
                                    id="lastName"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.lastName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. Appleseed'
                                />
                                {errors?.lastName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.lastName.message as string}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                            <label htmlFor="email" className={`text-xs mb-2 ${errors?.email ? "text-destructive" : ""}`}>
                                Email address
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("email")}
                                    type="email"
                                    id="email"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.email ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. alex@email.com'
                                />
                                {errors?.email && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.email.message as string}</p>
                                )}
                            </div>
                        </div>
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
