"use server";

import { db, auth } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const createAccount = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      const collectionRef = collection(db, "users");
      await addDoc(collectionRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
      return { success: true, message: "Account created successfully" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
