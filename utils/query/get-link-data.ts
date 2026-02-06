"use server";

import { prisma } from "@/lib/prisma";

interface LinkData {
  id: string;
  userId: string;
  platform: string;
  url: string;
  createdAt: Date;
}

export const fetchLinks = async (userId: string) => {
  try {
    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
