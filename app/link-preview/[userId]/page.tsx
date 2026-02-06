import SocialsCardLink from '@/components/SocialsCardLink'
import ShareButton from '@/components/ShareButton'
import { socialsObject } from '@/utils/data/data'
import { fetchLinks } from '@/utils/query/get-link-data'
import { fetchProfileData } from '@/utils/query/get-user-data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCircle } from 'react-icons/fa6'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Params = {
    params: {
        userId: string
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { userId } = await params
    const profileResult = await fetchProfileData(userId)
    
    if (!profileResult.success || !profileResult.profileData) {
        return {
            title: 'User Not Found',
            description: 'The requested user profile could not be found.'
        }
    }

    const { displayName, email } = profileResult.profileData

    return {
        title: `${displayName} - DevLink Profile`,
        description: `Check out ${displayName}'s developer profile and social links.`,
        openGraph: {
            title: `${displayName} - DevLink Profile`,
            description: `Check out ${displayName}'s developer profile and social links.`,
            type: 'profile',
        },
    }
}

export default async function Page({ params }: Params) {
    const { userId } = await params
    
    // Validate userId
    if (!userId || userId.trim() === '') {
        notFound();
    }
    
    // Fetch both profile and links data
    const [profileResult, linksResult] = await Promise.all([
        fetchProfileData(userId),
        fetchLinks(userId)
    ])

    // Handle profile not found
    if (!profileResult.success || !profileResult.profileData) {
        notFound()
    }

    const { profileData } = profileResult
    const links = linksResult.success ? linksResult.links : []

    return (
        <div className='bg-lightGray pb-20 min-h-screen'>
            {/* Header */}
            <div className='sm:bg-secondary px-6 pt-6 pb-4 sm:pb-63.75 rounded-b-4xl'>
                <div className='sm:bg-white flex justify-between w-full sm:px-6 py-4 rounded-xl'>
                    <Link 
                        href={"/link"} 
                        className='flex items-center px-4 font-semibold border border-secondary bg-white hover:bg-lightPurple text-secondary rounded-md h-11.5 transition-colors'
                    >
                        Back to editor
                    </Link>
                    <ShareButton userId={userId} />
                </div>
            </div>

            {/* Profile Card */}
            <div className='flex justify-center mt-0 sm:-mt-36'>
                <div className='sm:bg-white w-full max-w-87 flex flex-col justify-center px-14 py-12 rounded-3xl sm:shadow-grayShadow'>
                    {/* Profile Info */}
                    <div className='flex flex-col items-center gap-6 mb-14'>
                        <div className='flex items-center justify-center size-26 border-4 border-secondary rounded-full overflow-hidden bg-lightGray'>
                            {profileData.photoURL ? (
                                <Image 
                                    src={profileData.photoURL} 
                                    width={104} 
                                    height={104} 
                                    alt={profileData.displayName}
                                    className='object-cover w-full h-full'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400'>
                                    {profileData.displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className='w-full'>
                            <h1 className='text-[32px] text-center font-bold text-gray-900 wrap-break-word'>
                                {profileData.displayName}
                            </h1>
                            <p className='text-center text-gray-600 break-all mt-2'>
                                {profileData.email}
                            </p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className='flex flex-col gap-5'>
                        {links && links.length > 0 ? (
                            links.map((link) => {
                                const color = socialsObject[link.platform as keyof typeof socialsObject]?.color ?? '#1e1e1e'
                                const Icon = socialsObject[link.platform as keyof typeof socialsObject]?.icon ?? FaCircle
                                return (
                                    <SocialsCardLink 
                                        key={link.id} 
                                        bgColor={color} 
                                        link={link.url} 
                                        platformName={link.platform} 
                                        PlatformIcon={Icon} 
                                    />
                                )
                            })
                        ) : (
                            <div className='text-center py-8 text-gray-500'>
                                <p className='text-lg'>No links added yet</p>
                                <p className='text-sm mt-2'>This user hasn&apos;t added any social links yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
