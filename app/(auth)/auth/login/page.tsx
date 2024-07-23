"use client";
import AuthLayout from '@/components/ui/AuthLayout'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({ mode: "all" })
    const onSubmit = (data: FieldValues) => {
        console.log(data)
    }

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <h1 className='text-[32px] font-bold'>Login</h1>
                    <p className='text-gray-500 mt-1'>Add your details below to get back into the app</p>
                </div>
                <div className='flex flex-col gap-6 mt-10'>
                    <div>
                        <label htmlFor="email" className={`text-xs mb-2 ${errors?.email ? "text-destructive" : ""}`}>
                            Email address
                        </label>
                        <div className='relative'>
                            <input
                                {...register("email", {
                                    required: "Can't be empty", pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                id="email"
                                className={`w-full py-3 pl-10 pr-[105px] border ${errors?.email ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                placeholder='e.g. alex@email.com'
                            />
                            <Image src={"/assets/icons/envelope.svg"} className="absolute top-1/2 left-4 -translate-y-1/2" width={16} height={16} alt='' />
                            {errors?.email && (
                                <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.email.message as string}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className={`text-xs mb-2 ${errors?.password ? "text-destructive" : ""}`}>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                {...register("password", { required: "Can't be empty" })}
                                type="password"
                                id="password"
                                className={`w-full py-3 px-10 pr-[105px] border ${errors?.password ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                placeholder='Enter your password'
                            />
                            <Image src={"/assets/icons/lock.svg"} className="absolute top-1/2 left-4 -translate-y-1/2" width={16} height={16} alt='' />
                            {errors?.password && (
                                <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.password.message as string}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Button type="submit">Login</Button>
                    </div>
                    <p className='text-gray-500 text-center'>Don’t have an account? <Link href={"/create-account"} className='text-secondary hover:text-secondary/80'>Create account</Link></p>
                </div>
            </form>
        </AuthLayout>
    )
}
