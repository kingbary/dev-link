// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as Blob;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(buffer);
    });

    return NextResponse.json({ url: (uploadResponse as any).secure_url });
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Upload failed:", error.message);
      return new NextResponse(`Failed to upload image: ${error.message}`, {
        status: 500,
      });
    } else {
      console.error("Unknown error:", error);
      return new NextResponse(
        "Failed to upload image due to an unknown error",
        { status: 500 }
      );
    }
  }
}
