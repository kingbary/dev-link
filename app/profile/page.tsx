"use client";

import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useTransition } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ClipLoader } from 'react-spinners';

export default function Profile() {
    const session = useSession();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FieldValues>({ mode: "all" });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            setImageError(false);
            formData.append('file', file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);

            try {
                const response = await axios.post('/api/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setImageUrl(response.data.url);
            } catch (error) {
                console.error('Failed to upload image', error);
            }
        }
    };

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (isPending) return;
    }, [isPending]);

    const onSubmit = (data: FieldValues) => {
        startTransition(async () => {
            if (!imageUrl) {
                setImageError(true);
                return;
            }

            const uid = session.data?.user.id;
            const result = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid,
                    profileData: [{
                        uid,
                        imageUrl: imageUrl || '',
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email
                    }]
                }),
            }).then(res => res.json());

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <DashboardLayout>
            <form className='relative w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className='w-full flex flex-col gap-6 px-5 py-6 sm:p-10 h-full overflow-y-scroll scrollbar-hide'>
                    <div className='mb-10'>
                        <h2 className='text-2xl sm:text-[32px] text-primary font-bold'>Profile Details</h2>
                        <p>Add your details to create a personal touch to your profile.</p>
                    </div>
                    <div className='bg-lightGray p-5 rounded-xl w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-3 items-center gap-6'>
                            <p>Profile picture</p>
                            <div
                                className='relative bg-lightPurple flex flex-col gap-1 items-center justify-center size-[193px] rounded-xl'
                                style={{ backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: "darken" }}
                            >
                                <input
                                    type='file'
                                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                    onChange={handleImageChange}
                                />
                                <>
                                    <Image src={`${imagePreviewUrl ? '/assets/icons/upload-image-icon-white.svg' : '/assets/icons/upload-image-icon.svg'}`} width={40} height={40} alt='' />
                                    <p className={`font-semibold ${imagePreviewUrl ? 'text-white' : 'text-secondary'}`}>+ Upload Image</p>
                                </>
                            </div>
                            <div>
                                <p className='text-xs px-4'>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                                {imageError && (
                                    <p className='text-xs px-4 text-destructive mt-2'>Select an image</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl w-full'>
                        <div className='flex justify-between flex-col sm:flex-row sm:items-center'>
                            <label htmlFor="firstName" className={`text-xs mb-2 ${errors?.firstName ? "text-destructive" : ""}`}>
                                First Name*
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("firstName", {
                                        required: "Can't be empty"
                                    })}
                                    type="text"
                                    id="firstName"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.firstName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. John'
                                />
                                {errors?.firstName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.firstName.message as string}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                            <label htmlFor="lastName" className={`text-xs mb-2 ${errors?.lastName ? "text-destructive" : ""}`}>
                                Last Name*
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("lastName", {
                                        required: "Can't be empty",
                                    })}
                                    type="text"
                                    id="lastName"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.lastName ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. Appleseed'
                                />
                                {errors?.lastName && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.lastName.message as string}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                            <label htmlFor="email" className={`text-xs mb-2 ${errors?.email ? "text-destructive" : ""}`}>
                                Email address
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("email")}
                                    type="email"
                                    id="email"
                                    className={`w-full py-3 pl-4 pr-[105px] border ${errors?.email ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                                    placeholder='e.g. alex@email.com'
                                />
                                {errors?.email && (
                                    <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.email.message as string}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 w-full border-t border-[#D9D9D9] px-10 py-6'>
                    <div className='flex justify-end'>
                        <Button className='max-w-[91px]' type="submit" disabled={!isValid || isPending}>{isPending ? (<ClipLoader color='white' size={18} />) : "Save"}</Button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
