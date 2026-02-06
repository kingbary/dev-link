"use server";

import { prisma } from "@/lib/prisma";

type ProfileData = {
  displayName: string;
  email: string;
  photoURL?: string;
};

export const fetchProfileData = async (userId: string) => {
  try {
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    // If no profile exists, create one
    if (!userProfile) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, message: "User not found!" };
      }

      userProfile = await prisma.userProfile.create({
        data: {
          userId,
          firstName: null,
          lastName: null,
          photoURL: null,
        },
        include: { user: true },
      });
    }

    const profileData: ProfileData = {
      displayName: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Anonymous',
      email: userProfile.user.email,
      photoURL: userProfile.photoURL || undefined,
    };

    return { success: true, profileData };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
