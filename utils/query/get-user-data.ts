"use server";

import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

type ProfileData = {
  displayName: string;
  email: string;
  photoURL?: string;
};

export const fetchProfileData = async (uid: string) => {
  try {
    const docRef = doc(db, "usersProfile", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profileData: ProfileData = {
        displayName: docSnap.data().displayName,
        email: docSnap.data().email,
        photoURL: docSnap.data().photoURL,
      };
      console.log(profileData);

      return { success: true, profileData };
    } else {
      return { success: false, message: "No such document!" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
