import React, { useState, useEffect, Suspense } from 'react';
import { Skeleton } from './ui/skeleton';
import { fetchLinks } from '@/utils/query/get-link-data';
import { useSession } from 'next-auth/react';
import { FaCircle } from 'react-icons/fa6';
import { socialsObject } from '@/utils/data/data';
import SocialsCardLink from './SocialsCardLink';
import { fetchProfileData } from '@/utils/query/get-user-data';
import Image from 'next/image';

type LinkData = {
    platform: string;
    url: string;
};
type ProfileData = {
    displayName: string;
    email: string;
    photoURL?: string;
}

export default function PhonePreview() {
    const { data: session } = useSession();
    const [profileInfo, setProfileInfo] = useState<ProfileData | null>(null);
    const [links, setLinks] = useState<LinkData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                const profileDataResponse = await fetchProfileData(session.user.id);
                const linksData = await fetchLinks(session.user.id);

                if (profileDataResponse.success && profileDataResponse.profileData) {
                    setProfileInfo(profileDataResponse.profileData);
                } else {
                    console.error(profileDataResponse.message);
                }

                setLinks(linksData?.links ?? []);
            }
        };

        fetchData();
    }, [session]);

    const skeleton = (
        <div className='w-full flex flex-col gap-5'>
            <Skeleton className="w-full h-11 rounded-lg" />
            <Skeleton className="w-full h-11 rounded-lg" />
            <Skeleton className="w-full h-11 rounded-lg" />
            <Skeleton className="w-full h-11 rounded-lg" />
            <Skeleton className="w-full h-11 rounded-lg" />
        </div>
    );

    return (
        <div className='max-h-[631px]'>
            <div className='bg-[url(/assets/icons/phone-outside-frame.svg)] bg-center flex items-center justify-center w-[307px] h-[631px]'>
                <div className='bg-[url(/assets/icons/phone-inner-frame.svg)] bg-center flex justify-center w-[285px] h-[611px] px-[23px] pt-[53px]'>
                    <div className='flex flex-col items-center w-full'>
                        {profileInfo ? (
                            <>
                                <Image src={profileInfo.photoURL || '/default-profile.png'} width={96} height={96} alt="Profile" className="size-24 rounded-full mb-[25px]" />
                                <p className="w-[160px] h-4 rounded-full mb-[13px] text-center">{profileInfo.displayName ? profileInfo.displayName : "profileName"}</p>
                                <p className="h-2 rounded-full mb-[56px] text-center">{profileInfo.email}</p>
                            </>
                        ) : (
                            <>
                                <Skeleton className="size-24 rounded-full mb-[25px]" />
                                <Skeleton className="w-[160px] h-4 rounded-full mb-[13px]" />
                                <Skeleton className="w-[72px] h-2 rounded-full mb-[56px]" />
                            </>
                        )}
                        {!links.length ? (
                            skeleton
                        ) : (
                            <Suspense fallback={skeleton}>
                                <div className='w-full flex flex-col gap-5'>
                                    {links.map((item, idx) => {
                                        const color = socialsObject[item.platform as keyof typeof socialsObject]?.color ?? '';
                                        const Icon = socialsObject[item.platform as keyof typeof socialsObject]?.icon ?? FaCircle;
                                        return (
                                            <SocialsCardLink key={idx} bgColor={color} link={item.url} platformName={item.platform} PlatformIcon={Icon} />
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
