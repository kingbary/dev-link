import Link from 'next/link'
import React, { ReactNode } from 'react'
import { FaArrowRight } from 'react-icons/fa6'

interface SocialsCardLinkProps {
    link: string,
    platformIcon: ReactNode,
    platformName: string,
    bgColor: string
}

export default function SocialsCardLink({ link, platformIcon, platformName, bgColor }: SocialsCardLinkProps) {
    return (
        <Link href={link} className={`w-full flex items-center justify-between p-4 rounded-lg text-white ${bgColor} hover:opacity-90`}>
            <span className='flex items-center gap-2'>{platformIcon} {platformName}</span>
            <FaArrowRight size={16} />
        </Link>
    )
}
