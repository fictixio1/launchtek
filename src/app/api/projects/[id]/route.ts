import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  projects,
  projectIdeas,
  projectBranding,
  projectWebsites,
  projectX,
  projectLaunches,
  projectPnl,
} from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        idea: true,
        branding: true,
        website: true,
        x: true,
        launch: true,
        pnl: true,
        tasks: true,
        projectTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      tags: project.projectTags.map((pt) => pt.tag),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Separate updates by table
    const projectUpdates: Record<string, unknown> = {};
    const ideaUpdates: Record<string, unknown> = {};
    const brandingUpdates: Record<string, unknown> = {};
    const websiteUpdates: Record<string, unknown> = {};
    const xUpdates: Record<string, unknown> = {};
    const launchUpdates: Record<string, unknown> = {};

    // Project fields
    const projectFields = [
      "name",
      "stage",
      "status",
      "priority",
      "websiteUrl",
      "xHandle",
      "telegramUrl",
      "githubUrl",
    ];
    projectFields.forEach((field) => {
      if (field in body) {
        projectUpdates[field] = body[field];
      }
    });

    // Idea fields
    const ideaFields = [
      "oneLiner",
      "narrative",
      "whyExists",
      "whyWins",
      "targetAudience",
      "comparableProjects",
    ];
    ideaFields.forEach((field) => {
      if (field in body) {
        ideaUpdates[field] = body[field];
      }
    });

    // Branding fields
    const brandingFields = [
      "colorPalette",
      "primaryFont",
      "displayFont",
      "vibeTags",
    ];
    brandingFields.forEach((field) => {
      if (field in body) {
        brandingUpdates[field] = body[field];
      }
    });

    // Website fields
    const websiteFields = [
      "websiteUrl",
      "repoUrl",
      "hostingNotes",
      "landingPageDone",
      "copyWritten",
      "mobileChecked",
      "analyticsAdded",
    ];
    websiteFields.forEach((field) => {
      if (field in body && field !== "websiteUrl") {
        websiteUpdates[field] = body[field];
      } else if (field === "websiteUrl" && "websiteUrlSection" in body) {
        websiteUpdates.websiteUrl = body.websiteUrlSection;
      }
    });

    // X fields
    const xFields = [
      "handle",
      "bio",
      "pinnedTweetUrl",
      "schedulingNotes",
      "bannerUploaded",
      "launchThreadDrafted",
    ];
    xFields.forEach((field) => {
      if (field in body) {
        xUpdates[field] = body[field];
      }
    });

    // Launch fields
    const launchFields = [
      "preLaunchNotes",
      "tokenDeployed",
      "liquidityAdded",
      "siteLive",
      "xLive",
      "tgLive",
      "launchDate",
      "chain",
      "ticker",
      "contractAddress",
    ];
    launchFields.forEach((field) => {
      if (field in body) {
        launchUpdates[field] = body[field];
      }
    });

    // Update project table
    if (Object.keys(projectUpdates).length > 0) {
      projectUpdates.updatedAt = new Date();
      projectUpdates.lastActivityAt = new Date();
      await db.update(projects).set(projectUpdates).where(eq(projects.id, id));
    }

    // Update idea table
    if (Object.keys(ideaUpdates).length > 0) {
      ideaUpdates.updatedAt = new Date();
      await db
        .update(projectIdeas)
        .set(ideaUpdates)
        .where(eq(projectIdeas.projectId, id));
    }

    // Update branding table
    if (Object.keys(brandingUpdates).length > 0) {
      brandingUpdates.updatedAt = new Date();
      await db
        .update(projectBranding)
        .set(brandingUpdates)
        .where(eq(projectBranding.projectId, id));
    }

    // Update website table
    if (Object.keys(websiteUpdates).length > 0) {
      websiteUpdates.updatedAt = new Date();
      await db
        .update(projectWebsites)
        .set(websiteUpdates)
        .where(eq(projectWebsites.projectId, id));
    }

    // Update X table
    if (Object.keys(xUpdates).length > 0) {
      xUpdates.updatedAt = new Date();
      await db
        .update(projectX)
        .set(xUpdates)
        .where(eq(projectX.projectId, id));
    }

    // Update launch table
    if (Object.keys(launchUpdates).length > 0) {
      launchUpdates.updatedAt = new Date();
      await db
        .update(projectLaunches)
        .set(launchUpdates)
        .where(eq(projectLaunches.projectId, id));
    }

    // Fetch and return updated project
    const updatedProject = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        idea: true,
        branding: true,
        website: true,
        x: true,
        launch: true,
        pnl: true,
        tasks: true,
        projectTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...updatedProject,
      tags: updatedProject?.projectTags.map((pt) => pt.tag) ?? [],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete (archive) a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete by setting status to archived
    await db
      .update(projects)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
