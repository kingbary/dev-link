import React, { Suspense } from 'react';
import { fetchLinks } from '@/utils/query/get-link-data';
import { fetchProfileData } from '@/utils/query/get-user-data';
import { getServerSession } from 'next-auth';
import { FaArrowRight, FaCircle } from 'react-icons/fa6';
import Link from 'next/link';
import { socialsObject } from '@/utils/data/data';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { redirect } from 'next/navigation';

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className='w-full flex flex-col gap-5'>
        {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-11 rounded-lg" />
        ))}
    </div>
);

export default async function PhonePreview() {
    const session = await getServerSession();

    // Redirect to login if not authenticated
    if (!session?.user?.id) {
        redirect('/auth/login');
    }

    // Fetch data in parallel
    const [linksData, profileData] = await Promise.all([
        fetchLinks(session.user.id),
        fetchProfileData(session.user.id)
    ]);

    const links = linksData?.links ?? [];
    const profile = profileData?.profileData;

    return (
        <div className='max-h-157.75'>
            <div className='bg-[url(/assets/icons/phone-outside-frame.svg)] bg-center flex items-center justify-center w-76.75 h-157.75'>
                <div className='bg-[url(/assets/icons/phone-inner-frame.svg)] bg-center flex justify-center w-71.25 h-152.75 px-5.75 pt-13.25'>
                    <div className='flex flex-col items-center w-full'>
                        {/* Profile Section */}
                        {profile ? (
                            <>
                                <div className='relative size-24 mb-6.25'>
                                    <Image
                                        src={profile.photoURL || '/default-profile.png'}
                                        width={96}
                                        height={96}
                                        alt={`${profile.displayName}'s profile picture`}
                                        className="size-24 rounded-full object-cover border-4 border-secondary"
                                        priority
                                    />
                                </div>
                                <h1 className="text-lg font-bold text-primary mb-3.25 text-center truncate w-full">
                                    {profile.displayName || 'Anonymous User'}
                                </h1>
                                <p className="text-sm text-gray-600 mb-14 text-center truncate w-full">
                                    {profile.email}
                                </p>
                            </>
                        ) : (
                            <>
                                <Skeleton className="size-24 rounded-full mb-6.25" />
                                <Skeleton className="w-40 h-4 rounded-full mb-3.25" />
                                <Skeleton className="w-18 h-2 rounded-full mb-14" />
                            </>
                        )}

                        {/* Links Section */}
                        {!links?.length ? (
                            <div className='w-full flex flex-col items-center justify-center py-8'>
                                <p className='text-sm text-gray-400 text-center'>
                                    No links added yet
                                </p>
                                <p className='text-xs text-gray-400 text-center mt-2'>
                                    Add links to share your profile
                                </p>
                            </div>
                        ) : (
                            <Suspense fallback={<LoadingSkeleton />}>
                                <div className='w-full flex flex-col gap-5 overflow-y-auto max-h-75 scrollbar-hide'>
                                    {links.map((item, idx) => {
                                        const platformData = socialsObject[item.platform as keyof typeof socialsObject];
                                        const color = platformData?.color ?? '#6B7280';
                                        const Icon = platformData?.icon ?? FaCircle;

                                        return (
                                            <Link
                                                key={`${item.platform}-${idx}`}
                                                href={item.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='w-full flex items-center justify-between gap-2 h-11 px-4 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 group'
                                                style={{ backgroundColor: color }}
                                            >
                                                <div className='flex items-center gap-2'>
                                                    <Icon size={16} className='shrink-0' />
                                                    <span className='font-medium text-sm truncate'>
                                                        {item.platform}
                                                    </span>
                                                </div>
                                                <FaArrowRight
                                                    size={14}
                                                    className='shrink-0 group-hover:translate-x-1 transition-transform duration-200'
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
