import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface ProfileData {
  uid: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const updateProfileData = async (
  uid: string,
  profileData: ProfileData[]
) => {
  try {
    if (!uid) {
      return { success: false, message: "No user ID provided" };
    }

    const userDocRef = doc(db, "usersProfile", uid);

    const docSnapshot = await getDoc(userDocRef);
    if (!docSnapshot.exists()) {
      await setDoc(userDocRef, {
        firstName: profileData[0].firstName,
        lastName: profileData[0].lastName,
        email: profileData[0].email,
        photoURL: profileData[0].imageUrl,
      });
    } else {
      await updateDoc(userDocRef, {
        firstName: profileData[0].firstName,
        lastName: profileData[0].lastName,
        email: profileData[0].email,
        photoURL: profileData[0].imageUrl,
      });
    }

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
