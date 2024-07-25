"use client";
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FiLink } from 'react-icons/fi';
import { RiEqualFill } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TbBrandGithubFilled } from 'react-icons/tb';
import { FaDev, FaFacebook, FaFreeCodeCamp, FaGitlab, FaHashnode, FaLinkedin, FaStackOverflow, FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { SiCodewars } from 'react-icons/si';

interface LinkCardProps {
    index: number;
    platform: string;
    link: string;
    onRemove: (index: number) => void;
    onChange: (index: number, field: 'platform' | 'link', value: string) => void;
}

const socials = [
    { id: 1, icon: <TbBrandGithubFilled size={16} />, platform: "GitHub", color: "#1A1A1A" },
    { id: 2, icon: <FaLinkedin size={16} />, platform: "LinkedIn", color: "#2D68FF" },
    { id: 3, icon: <FaYoutube size={16} />, platform: "YouTube", color: "#EE3939" },
    { id: 4, icon: <FaTwitter size={16} />, platform: "Twitter", color: "#43B7E9" },
    { id: 5, icon: <FaTwitch size={16} />, platform: "Twitch", color: "#EE3FC8" },
    { id: 6, icon: <FaDev size={16} />, platform: "Dev.to", color: "#333333" },
    { id: 7, icon: <SiCodewars size={16} />, platform: "Codewars", color: "#8A1A50" },
    { id: 8, icon: <FaFreeCodeCamp size={16} />, platform: "FreeCodeCamp", color: "#302267" },
    { id: 9, icon: <FaGitlab size={16} />, platform: "GitLab", color: "#EB4925" },
    { id: 10, icon: <FaHashnode size={16} />, platform: "Hashnode", color: "#0330D1" },
    { id: 11, icon: <FaStackOverflow size={16} />, platform: "Stack Overflow", color: "#EC7100" },
    { id: 12, icon: <FaFacebook size={16} />, platform: "Facebook", color: "#EC7100" },
];

export default function LinkCard({ index, platform, link, onRemove, onChange }: LinkCardProps) {
    const { register, formState: { errors } } = useForm<FieldValues>({ mode: "all" });

    return (
        <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl'>
            <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                    <RiEqualFill size={20} />
                    <p className='font-bold'>Link #{index + 1}</p>
                </div>
                <button onClick={() => onRemove(index)} className='text-primary hover:opacity-80'>Remove</button>
            </div>
            <div>
                <div className='mb-3'>
                    <label htmlFor="platform" className={`text-xs mb-2`}>Platform</label>
                    <Select onValueChange={(value) => onChange(index, 'platform', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={platform || "Select Platform"} />
                        </SelectTrigger>
                        <SelectContent className='relative'>
                            {socials.map((item) => (
                                <SelectItem key={item.id} value={item.platform}>
                                    <div className="flex items-stretch gap-1">
                                        {item.icon}
                                        <span className='mb-1'>{item.platform}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="link" className={`text-xs mb-2 ${errors?.link ? "text-destructive" : ""}`}>Link</label>
                    <div className='relative'>
                        <input
                            {...register("link", {
                                required: "Can't be empty",
                                pattern: {
                                    value: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
                                    message: "Invalid URL",
                                },
                            })}
                            type="text"
                            id="link"
                            value={link}
                            onChange={(e) => onChange(index, 'link', e.target.value)}
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
    );
}
