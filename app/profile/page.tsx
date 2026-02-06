"use client";

import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { useProfileRefresh } from '@/providers/ProfileRefreshContext';

const MAX_FILE_SIZE = 1024 * 1024 * 4; // 4MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
}

export default function Profile() {
    const { data: session, status } = useSession();
    const { triggerRefresh } = useProfileRefresh();
    const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            firstName: '',
            lastName: '',
            email: ''
        }
    });

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Load user data on mount
    useEffect(() => {
        const loadUserData = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    // You can fetch existing profile data here and populate the form
                    // const profileData = await fetchProfileData(session.user.id);
                    // if (profileData.success) {
                    //     setValue('firstName', profileData.firstName || '');
                    //     setValue('lastName', profileData.lastName || '');
                    //     setValue('email', profileData.email || '');
                    //     setImageUrl(profileData.photoURL || null);
                    //     setImagePreviewUrl(profileData.photoURL || null);
                    // }
                } catch (error) {
                    console.error('Failed to load user data:', error);
                }
            }
        };

        loadUserData();
    }, [status, session, setValue]);

    const validateImage = (file: File): string | null => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return 'Invalid file type. Please use PNG, JPG, or WEBP format.';
        }

        if (file.size > MAX_FILE_SIZE) {
            return 'File is too large. Maximum size is 4MB.';
        }

        return null;
    };

    const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate image
        const validationError = validateImage(file);
        if (validationError) {
            setImageError(validationError);
            toast.error(validationError);
            return;
        }

        setImageError(null);
        setIsUploadingImage(true);

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setImageUrl(response.data.url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Failed to upload image:', error);
            setImageError('Failed to upload image. Please try again.');
            toast.error('Failed to upload image. Please try again.');
            setImagePreviewUrl(null);
        } finally {
            setIsUploadingImage(false);
        }
    }, []);

    const onSubmit = useCallback((data: FormData) => {
        startTransition(async () => {
            if (!session?.user?.id) {
                toast.error('You must be logged in to update your profile');
                return;
            }

            // Image is optional, but show a warning if not provided
            if (!imageUrl) {
                setImageError('Please upload a profile picture');
                return;
            }

            try {
                const result = await fetch('/api/update-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id,
                        profileData: [{
                            imageUrl: imageUrl,
                            firstName: data.firstName.trim(),
                            lastName: data.lastName.trim(),
                            email: data.email.trim()
                        }]
                    }),
                });

                const response = await result.json();

                if (response.success) {
                    toast.success(response.message || 'Profile updated successfully!');
                    // Trigger refresh of PhonePreview component
                    triggerRefresh();
                } else {
                    toast.error(response.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                toast.error('An unexpected error occurred. Please try again.');
            }
        });
    }, [session, imageUrl, triggerRefresh]);

    return (
        <DashboardLayout>
            <form className='relative w-full h-full pb-32' onSubmit={handleSubmit(onSubmit)}>
                <div className='w-full flex flex-col gap-6 px-5 py-6 sm:p-10 h-full overflow-y-scroll scrollbar-hide'>
                    {/* Header */}
                    <div className='mb-10'>
                        <h2 className='text-2xl sm:text-[32px] text-primary font-bold'>Profile Details</h2>
                        <p className='text-gray-600'>Add your details to create a personal touch to your profile.</p>
                    </div>

                    {/* Profile Picture Section */}
                    <div className='bg-lightGray p-5 rounded-xl w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-3 items-center gap-6'>
                            <p className='text-gray-700 font-medium'>Profile picture</p>
                            <div className='relative group'>
                                <div
                                    className='relative bg-lightPurple flex flex-col gap-1 items-center justify-center size-48.25 rounded-xl overflow-hidden transition-all duration-200 hover:bg-opacity-80'
                                    style={{
                                        backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <input
                                        type='file'
                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                                        onChange={handleImageChange}
                                        disabled={isUploadingImage}
                                    />
                                    {isUploadingImage ? (
                                        <div className='flex flex-col items-center gap-2'>
                                            <ClipLoader color='#633CFF' size={40} />
                                            <p className='font-semibold text-secondary text-sm'>Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Image
                                                src={imagePreviewUrl ? '/assets/icons/upload-image-icon-white.svg' : '/assets/icons/upload-image-icon.svg'}
                                                width={40}
                                                height={40}
                                                alt='Upload icon'
                                            />
                                            <p className={`font-semibold ${imagePreviewUrl ? 'text-white' : 'text-secondary'}`}>
                                                {imagePreviewUrl ? 'Change Image' : '+ Upload Image'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className='text-xs text-gray-600'>Image must be below 4MB. Use PNG, JPG, or WEBP format.</p>
                                {imageError && (
                                    <p className='text-xs mt-2 text-destructive font-medium'>{imageError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields Section */}
                    <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl w-full'>
                        {/* First Name */}
                        <div className='flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
                            <label htmlFor="firstName" className={`text-xs sm:text-sm font-medium sm:min-w-30 ${errors?.firstName ? "text-destructive" : "text-gray-700"}`}>
                                First Name*
                            </label>
                            <div className='relative flex-1 sm:max-w-108'>
                                <input
                                    {...register("firstName", {
                                        required: "Can't be empty",
                                        minLength: {
                                            value: 2,
                                            message: "Must be at least 2 characters"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: "Only letters allowed"
                                        }
                                    })}
                                    type="text"
                                    id="firstName"
                                    className={`w-full py-3 pl-4 pr-26.25 border ${errors?.firstName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300 transition-all`}
                                    placeholder='e.g. John'
                                />
                                {errors?.firstName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs font-medium'>{errors?.firstName.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-4'>
                            <label htmlFor="lastName" className={`text-xs sm:text-sm font-medium sm:min-w-30 ${errors?.lastName ? "text-destructive" : "text-gray-700"}`}>
                                Last Name*
                            </label>
                            <div className='relative flex-1 sm:max-w-108'>
                                <input
                                    {...register("lastName", {
                                        required: "Can't be empty",
                                        minLength: {
                                            value: 2,
                                            message: "Must be at least 2 characters"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: "Only letters allowed"
                                        }
                                    })}
                                    type="text"
                                    id="lastName"
                                    className={`w-full py-3 pl-4 pr-26.25 border ${errors?.lastName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300 transition-all`}
                                    placeholder='e.g. Appleseed'
                                />
                                {errors?.lastName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs font-medium'>{errors?.lastName.message as string}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-4'>
                            <label htmlFor="email" className={`text-xs sm:text-sm font-medium sm:min-w-30 ${errors?.email ? "text-destructive" : "text-gray-700"}`}>
                                Email
                            </label>
                            <div className='relative flex-1 sm:max-w-108'>
                                <input
                                    {...register("email", {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    id="email"
                                    className={`w-full py-3 pl-4 pr-26.25 border ${errors?.email ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300 transition-all`}
                                    placeholder='e.g. alex@email.com'
                                />
                                {errors?.email && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs font-medium'>{errors?.email.message as string}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button - Fixed at bottom */}
                <div className='absolute bottom-0 right-0 w-full border-t border-[#D9D9D9] px-5 sm:px-10 py-6 bg-white'>
                    <div className='flex justify-end'>
                        <Button
                            className='min-w-22.75 px-6'
                            type="submit"
                            disabled={!isValid || isPending || isUploadingImage}
                        >
                            {isPending ? (
                                <ClipLoader color='white' size={18} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
