"use server";

import { prisma } from "@/lib/prisma";

interface LinkData {
  platform: string;
  url: string;
}

export const createLink = async (userId: string, links: LinkData[]) => {
  try {
    // Delete all existing links for this user first
    await prisma.link.deleteMany({
      where: { userId },
    });

    // Then create the new links
    if (links.length > 0) {
      await prisma.link.createMany({
        data: links.map((link) => ({
          userId,
          platform: link.platform,
          url: link.url,
        })),
      });
    }

    return { success: true, message: "Links saved successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};
