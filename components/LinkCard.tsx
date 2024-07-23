"use client";
import Image from 'next/image'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FiLink } from 'react-icons/fi';
import { RiEqualFill } from 'react-icons/ri'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TbBrandGithubFilled } from 'react-icons/tb';

export default function LinkCard() {
    const { register, formState: { errors, isValid } } = useForm<FieldValues>({ mode: "all" })
    const onSubmit = (data: FieldValues) => {
        console.log(data)
    }
    return (
        <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl'>
            <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                    <RiEqualFill size={20} />
                    <p className='font-bold'>Link #{"1"}</p>
                </div>
                <button className='text-primary'>Remove</button>
            </div>
            <div>
                <div className='mb-3'>
                    <label htmlFor="email" className={`text-xs mb-2`}>
                        Platform
                    </label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="GitHub" />
                        </SelectTrigger>
                        <SelectContent className='relative'>
                            <SelectItem value="github" className="!flex items-center gap-2">
                                {/* <TbBrandGithubFilled className='absolute left-2' /> */}
                                GitHub
                            </SelectItem>
                            <SelectItem value="frontendMentor">Frontend Mentor</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedIn">LinkedIn</SelectItem>
                            <SelectItem value="youTube">YouTube</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="twitch">Twitch</SelectItem>
                            <SelectItem value="devTo">Dev.to</SelectItem>
                            <SelectItem value="codewars">Codewars</SelectItem>
                            <SelectItem value="codepen">Codepen</SelectItem>
                            <SelectItem value="freeCodeCamp">FreeCodeCamp</SelectItem>
                            <SelectItem value="gitLab">GitLab</SelectItem>
                            <SelectItem value="hashnode">Hashnode</SelectItem>
                            <SelectItem value="stackOverflow">Stack Overflow</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="link" className={`text-xs mb-2 ${errors?.link ? "text-destructive" : ""}`}>
                        Link
                    </label>
                    <div className='relative'>
                        <input
                            {...register("link", {
                                required: "Can't be empty", pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid link"
                                }
                            })}
                            type="text"
                            id="link"
                            className={`w-full py-3 pl-10 pr-[105px] border ${errors?.link ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                            placeholder='e.g. https://www.github.com/johnappleseed'
                        />
                        <FiLink className="absolute top-1/2 left-4 -translate-y-1/2" size={16} />
                        {errors?.link && (
                            <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.link.message as string}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
