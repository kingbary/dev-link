import { prisma } from "@/lib/prisma";

interface ProfileData {
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const updateProfileData = async (
  userId: string,
  profileData: ProfileData[]
) => {
  try {
    if (!userId) {
      return { success: false, message: "No user ID provided" };
    }

    // Upsert user profile (create if doesn't exist, update if exists)
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        firstName: profileData[0].firstName,
        lastName: profileData[0].lastName,
        photoURL: profileData[0].imageUrl,
      },
      update: {
        firstName: profileData[0].firstName,
        lastName: profileData[0].lastName,
        photoURL: profileData[0].imageUrl,
      },
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
