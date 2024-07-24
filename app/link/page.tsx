"use client";
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import LinkCard from '@/components/LinkCard';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Link() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [linkCards, setLinkCards] = useState<number[]>([]);

    useEffect(() => {
        const linkCount = Number(searchParams.get("link_count")) || 0;
        setLinkCards(Array.from({ length: linkCount }, (_, i) => i));
    }, [searchParams]);

    const handleAddLink = () => {
        setLinkCards(prev => {
            if (prev.length >= 5) return prev;
            const newLinkCards = [...prev, prev.length];
            const linkCount = newLinkCards.length;
            const newURL = new URL(window.location.href);
            newURL.searchParams.set('add_link', 'true');
            newURL.searchParams.set('link_count', linkCount.toString());
            router.push(newURL.toString(), undefined);
            return newLinkCards;
        });
    };

    const handleRemoveLink = (index: number) => {
        setLinkCards(prev => {
            const newLinkCards = prev.filter((_, i) => i !== index);
            const linkCount = newLinkCards.length;
            const newURL = new URL(window.location.href);
            newURL.searchParams.set('add_link', linkCount > 0 ? 'true' : 'false');
            newURL.searchParams.set('link_count', linkCount.toString());
            router.push(newURL.toString(), undefined);
            return newLinkCards;
        });
    };

    return (
        <DashboardLayout>
            <div className='w-full'>
                <div className='w-full flex flex-col gap-6 px-5 py-6 sm:p-10 max-h-[100vh] overflow-y-scroll scrollbar-hide'>
                    <div className='mb-10'>
                        <h2 className='text-2xl sm:text-[32px] text-primary font-bold'>Customize your links</h2>
                        <p>Add/edit/remove links below and then share all your profiles with the world!</p>
                    </div>
                    <Button variant={"outline"} onClick={handleAddLink} disabled={linkCards.length >= 5}>
                        + Add new link
                    </Button>
                    {linkCards.length > 0 ? (
                        <div className='pb-10 flex flex-col gap-6'>
                            {linkCards.map((_, index) => (
                                <LinkCard key={index} index={index} onRemove={handleRemoveLink} />
                            ))}
                        </div>
                    ) : (
                        <div className='bg-lightGray p-0 sm:p-5 rounded-xl flex flex-col items-center justify-center'>
                            <div className='flex flex-col items-center p-5 sm:p-10'>
                                <Image src={"/assets/icons/illustration.svg"} width={249} height={160} alt='' />
                                <h2 className='text-2xl sm:text-[32px] text-primary font-bold mt-10 mb-6'>Let’s get you started</h2>
                                <p className='text-center'>Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them. We’re here to help you share your profiles with everyone!</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className='border-t border-[#D9D9D9] px-10 py-6'>
                    <div className='flex justify-end'>
                        <Button className='max-w-[91px]'>Save</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
