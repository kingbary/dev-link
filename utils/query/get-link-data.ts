"use server";

import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface LinkData {
  uid: string;
  platform: string;
  url: string;
  createdAt: Date;
}

export const fetchLinks = async (uid: string) => {
  try {
    const collectionRef = collection(db, "links");
    const q = query(collectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const links: LinkData[] = [];
    querySnapshot.forEach((doc) => {
      links.push({
        uid: doc.data().uid,
        platform: doc.data().platform,
        url: doc.data().url,
        createdAt: doc.data().createdAt.toDate(),
      });
    });

    return { success: true, links };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
