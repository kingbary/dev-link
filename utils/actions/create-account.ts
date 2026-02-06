"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const createAccount = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: null,
            lastName: null,
            photoURL: null,
          },
        },
      },
    });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
