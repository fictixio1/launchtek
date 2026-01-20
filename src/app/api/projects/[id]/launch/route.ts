import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectLaunches, projectPnl } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/projects/[id]/launch - Complete a project launch
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      initialSol,
      currentValueSol,
      realizedSol = 0,
      notes,
      ticker,
      contractAddress,
      chain = "SOL",
    } = body;

    // Validate required fields
    if (ticker === undefined || initialSol === undefined || currentValueSol === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update project status to launched
    await db
      .update(projects)
      .set({
        status: "launched",
        stage: "launch",
        updatedAt: new Date(),
        lastActivityAt: new Date(),
      })
      .where(eq(projects.id, id));

    // Update launch record
    await db
      .update(projectLaunches)
      .set({
        launchDate: new Date().toISOString().split("T")[0],
        chain,
        ticker,
        contractAddress,
        tokenDeployed: true,
        liquidityAdded: true,
        siteLive: true,
        xLive: true,
        tgLive: true,
        updatedAt: new Date(),
      })
      .where(eq(projectLaunches.projectId, id));

    // Create or update PNL record
    const existingPnl = await db.query.projectPnl.findFirst({
      where: eq(projectPnl.projectId, id),
    });

    if (existingPnl) {
      await db
        .update(projectPnl)
        .set({
          initialSol: initialSol.toString(),
          currentValueSol: currentValueSol.toString(),
          realizedSol: realizedSol.toString(),
          notes,
          updatedAt: new Date(),
        })
        .where(eq(projectPnl.projectId, id));
    } else {
      await db.insert(projectPnl).values({
        projectId: id,
        initialSol: initialSol.toString(),
        currentValueSol: currentValueSol.toString(),
        realizedSol: realizedSol.toString(),
        notes,
      });
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
    console.error("Error completing launch:", error);
    return NextResponse.json(
      { error: "Failed to complete launch" },
      { status: 500 }
    );
  }
}
