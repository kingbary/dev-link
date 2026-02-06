"use client";

import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import LinkCard from '@/components/LinkCard';
import React, { useEffect, useState, Suspense, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createLink } from '@/utils/actions/create-links';
import { fetchLinks } from '@/utils/query/get-link-data';
import { toast } from 'sonner';
import { BeatLoader, ClipLoader } from 'react-spinners';
import { useProfileRefresh } from '@/providers/ProfileRefreshContext';

interface LinkData {
    platform: string;
    link: string;
}

const MAX_LINKS = 5;

const LinkContent = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const { triggerRefresh } = useProfileRefresh();
    const [linkCards, setLinkCards] = useState<LinkData[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoadingLinks, setIsLoadingLinks] = useState(true);

    // Load existing links from database
    useEffect(() => {
        const loadExistingLinks = async () => {
            if (!session?.user?.id) {
                setIsLoadingLinks(false);
                return;
            }

            try {
                const result = await fetchLinks(session.user.id);

                if (result.success && result.links && result.links.length > 0) {
                    // Filter out links with empty platforms or URLs
                    const validLinks = result.links.filter(link => link.platform && link.url);

                    if (validLinks.length > 0) {
                        const formattedLinks = validLinks.map(link => ({
                            platform: link.platform,
                            link: link.url
                        }));
                        setLinkCards(formattedLinks);
                    }
                }
            } catch (error) {
                console.error('Error loading links:', error);
                toast.error('Failed to load existing links');
            } finally {
                setIsLoadingLinks(false);
            }
        };

        if (status === 'authenticated') {
            loadExistingLinks();
        } else if (status === 'unauthenticated') {
            setIsLoadingLinks(false);
        }
    }, [session?.user?.id, status]);

    // Load links from URL params (only if no existing links)
    useEffect(() => {
        if (isLoadingLinks) return; // Wait for database load to complete

        const linkCount = Number(searchParams.get("link_count")) || 0;
        if (linkCount > 0 && linkCards.length === 0) {
            setLinkCards(Array.from({ length: linkCount }, () => ({ platform: '', link: '' })));
        }
    }, [searchParams, isLoadingLinks, linkCards.length]);

    // Track unsaved changes
    useEffect(() => {
        const hasData = linkCards.some(card => card.platform || card.link);
        setHasUnsavedChanges(hasData);
    }, [linkCards]);

    // Update URL params when linkCards change
    useEffect(() => {
        if (isLoadingLinks) return; // Don't update URL while loading initial data

        const newURL = new URL(window.location.href);
        if (linkCards.length > 0) {
            newURL.searchParams.set('add_link', 'true');
            newURL.searchParams.set('link_count', linkCards.length.toString());
        } else {
            newURL.searchParams.delete('add_link');
            newURL.searchParams.delete('link_count');
        }
        router.push(newURL.toString(), { scroll: false });
    }, [linkCards.length, router, isLoadingLinks]);

    const handleAddLink = useCallback(() => {
        if (linkCards.length >= MAX_LINKS) {
            toast.error(`Maximum ${MAX_LINKS} links allowed`);
            return;
        }

        setLinkCards(prev => [...prev, { platform: '', link: '' }]);
        toast.success('New link added');
    }, [linkCards.length]);

    const handleRemoveLink = useCallback((index: number) => {
        setLinkCards(prev => prev.filter((_, i) => i !== index));
        toast.success('Link removed');
    }, []);

    const validateLinks = useCallback((): boolean => {
        // Allow saving with 0 links (to delete all)
        if (linkCards.length === 0) {
            return true;
        }

        for (let i = 0; i < linkCards.length; i++) {
            const card = linkCards[i];

            if (!card.platform || !card.link) {
                toast.error(`Link ${i + 1}: Both platform and URL are required`);
                return false;
            }

            // Basic URL validation
            try {
                new URL(card.link);
            } catch {
                toast.error(`Link ${i + 1}: Invalid URL format`);
                return false;
            }
        }

        return true;
    }, [linkCards]);

    const handleSaveLinks = useCallback(async () => {
        if (!session?.user?.id) {
            toast.error('You must be logged in to save links');
            return;
        }

        if (!validateLinks()) {
            return;
        }

        const userId = session.user.id;
        const links = linkCards.map(card => ({
            platform: card.platform,
            url: card.link.trim(),
        }));

        console.log('💾 Saving links:', links);

        startTransition(async () => {
            try {
                const result = await createLink(userId, links);

                if (result.success) {
                    console.log('✅ Links saved successfully, triggering refresh...');
                    toast.success(result.message || "Links saved successfully");
                    setHasUnsavedChanges(false);
                    
                    // Trigger PhonePreview refresh
                    triggerRefresh();
                    console.log('🔄 Refresh triggered');
                } else {
                    console.error("Error saving links:", result.message);
                    toast.error(result.message || "Failed to save links");
                }
            } catch (error) {
                console.error("Error saving links:", error);
                toast.error("An unexpected error occurred");
            }
        });
    }, [session, linkCards, validateLinks, triggerRefresh]);

    const handleChange = useCallback((index: number, field: keyof LinkData, value: string) => {
        setLinkCards(prev => {
            const newLinkCards = [...prev];
            newLinkCards[index][field] = value;
            return newLinkCards;
        });
    }, []);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && !isPending) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, isPending]);

    const isFormValid = linkCards.every(card => card.platform && card.link);

    if (isLoadingLinks) {
        return (
            <DashboardLayout>
                <div className='w-full h-full flex items-center justify-center'>
                    <BeatLoader color="#633CFF" size={20} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className='w-full h-full flex flex-col'>
                {/* Scrollable Content Area */}
                <div className='flex-1 overflow-y-auto px-5 py-6 sm:p-10'>
                    {/* Header */}
                    <div className='mb-6'>
                        <h2 className='text-2xl sm:text-[32px] text-primary font-bold'>Customize your links</h2>
                        <p className='text-gray-600'>Add/edit/remove links below and then share all your profiles with the world!</p>
                    </div>

                    {/* Add Link Button */}
                    <Button
                        variant={"outline"}
                        onClick={handleAddLink}
                        disabled={linkCards.length >= MAX_LINKS}
                        className='w-full mb-6'
                    >
                        + Add new link {linkCards.length > 0 && `(${linkCards.length}/${MAX_LINKS})`}
                    </Button>

                    {/* Links or Empty State */}
                    {linkCards.length > 0 ? (
                        <div className='flex flex-col gap-6'>
                            {linkCards.map((linkCard, index) => (
                                <LinkCard
                                    key={`link-${index}`}
                                    index={index}
                                    platform={linkCard.platform}
                                    link={linkCard.link}
                                    onRemove={handleRemoveLink}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='bg-lightGray p-0 sm:p-5 rounded-xl flex flex-col items-center justify-center'>
                            <div className='flex flex-col items-center p-5 sm:p-10'>
                                <Image
                                    src={"/assets/icons/illustration.svg"}
                                    width={249}
                                    height={160}
                                    alt='Get started illustration'
                                    priority
                                />
                                <h2 className='text-2xl sm:text-[32px] text-primary font-bold mt-10 mb-6'>
                                    Let's get you started
                                </h2>
                                <p className='text-center text-gray-600 max-w-md'>
                                    Use the "Add new link" button to get started. Once you have more than one link,
                                    you can reorder and edit them. We're here to help you share your profiles with everyone!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button - Fixed at bottom */}
                <div className='shrink-0 border-t bg-white border-[#D9D9D9] px-5 sm:px-10 py-4'>
                    <div className='flex flex-col justify-end items-center gap-4'>
                        {hasUnsavedChanges && !isPending && (
                            <span className='text-sm text-gray-500 hidden sm:block'>
                                You have unsaved changes
                            </span>
                        )}
                        <Button
                            className='min-w-22.75 px-6'
                            onClick={handleSaveLinks}
                            disabled={!isFormValid || isPending}
                        >
                            {isPending ? (
                                <ClipLoader color='white' size={18} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const LinkPage = () => (
    <Suspense fallback={<div className="w-screen h-screen bg-lightGray flex justify-center items-center">
        <BeatLoader color="#633CFF" size={20} />
    </div>}>
        <LinkContent />
    </Suspense>
);

export default LinkPage;
