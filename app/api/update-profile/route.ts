import { updateProfileData } from "@/utils/actions/updateProfileData";
import { NextResponse } from "next/server";

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.uid || !data.profileData || !Array.isArray(data.profileData)) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const result = await updateProfileData(data.uid, data.profileData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (isError(error)) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
