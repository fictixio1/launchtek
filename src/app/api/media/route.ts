import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/media - List all media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const assetType = searchParams.get("assetType");

    const query = db.query.media.findMany({
      orderBy: [desc(media.createdAt)],
      with: {
        project: true,
      },
    });

    const allMedia = await query;

    // Filter in JS since Drizzle query builder is limited
    let filtered = allMedia;
    if (projectId) {
      filtered = filtered.filter((m) => m.projectId === projectId);
    }
    if (assetType) {
      filtered = filtered.filter((m) => m.assetType === assetType);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST /api/media - Create media record after upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, size, projectId, assetType } = body;

    if (!url || !name) {
      return NextResponse.json(
        { error: "URL and name are required" },
        { status: 400 }
      );
    }

    const [newMedia] = await db
      .insert(media)
      .values({
        filename: name,
        originalFilename: name,
        mimeType: "image/*",
        fileSize: size || 0,
        s3Key: url,
        s3Url: url,
        projectId: projectId || null,
        assetType: assetType || null,
      })
      .returning();

    return NextResponse.json(newMedia);
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}

// DELETE /api/media?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    await db.delete(media).where(eq(media.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
