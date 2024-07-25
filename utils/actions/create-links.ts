"use server";

import { db } from "@/config/firebase";
import { addDoc, collection, Firestore } from "firebase/firestore";

interface LinkData {
  uid: string;
  platform: string;
  url: string;
  createdAt: Date;
}

export const createLink = async (uid: string, links: LinkData[]) => {
  try {
    const collectionRef = collection(db as unknown as Firestore, "links");

    for (const link of links) {
      await addDoc(collectionRef, {
        uid,
        platform: link.platform,
        url: link.url,
        createdAt: link.createdAt,
      });
    }

    return { success: true, message: "Links created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
