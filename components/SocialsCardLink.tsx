import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons'
import { FaArrowRight } from 'react-icons/fa6'

interface SocialsCardLinkProps {
    link: string,
    PlatformIcon: IconType,
    platformName: string,
    bgColor: string
}

export default function SocialsCardLink({ link, PlatformIcon, platformName, bgColor }: SocialsCardLinkProps) {
    return (
        <Link href={link} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:opacity-90`} style={{ backgroundColor: bgColor }}>
            <span className='flex items-center gap-2'><PlatformIcon size={16} /> {platformName}</span>
            <FaArrowRight size={16} />
        </Link>
    )
}
