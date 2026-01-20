import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  projects,
  projectIdeas,
  projectBranding,
  projectWebsites,
  projectX,
  projectLaunches,
  projectTags,
  tags,
} from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/projects - List all projects
export async function GET() {
  try {
    const allProjects = await db.query.projects.findMany({
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
      orderBy: (projects, { desc }) => [desc(projects.lastActivityAt)],
    });

    // Transform projectTags to tags array
    const transformedProjects = allProjects.map((project) => ({
      ...project,
      tags: project.projectTags.map((pt) => pt.tag),
      projectTags: undefined,
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, stage = "idea", priority = "medium" } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create project
    const [newProject] = await db
      .insert(projects)
      .values({
        name,
        stage,
        priority,
        status: "active",
      })
      .returning();

    // Create related section records
    await Promise.all([
      db.insert(projectIdeas).values({ projectId: newProject.id }),
      db.insert(projectBranding).values({ projectId: newProject.id }),
      db.insert(projectWebsites).values({ projectId: newProject.id }),
      db.insert(projectX).values({ projectId: newProject.id }),
      db.insert(projectLaunches).values({ projectId: newProject.id }),
    ]);

    // Fetch the complete project with relations
    const completeProject = await db.query.projects.findFirst({
      where: eq(projects.id, newProject.id),
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
      ...completeProject,
      tags: completeProject?.projectTags.map((pt) => pt.tag) ?? [],
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
