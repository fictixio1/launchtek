import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let query = db.query.tasks.findMany({
      with: {
        project: true,
      },
      orderBy: [desc(tasks.createdAt)],
    });

    if (projectId) {
      const projectTasks = await db.query.tasks.findMany({
        where: eq(tasks.projectId, projectId),
        with: {
          project: true,
        },
        orderBy: [desc(tasks.createdAt)],
      });
      return NextResponse.json(projectTasks);
    }

    const allTasks = await query;
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      title,
      description,
      priority = "medium",
      dueDate,
    } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "Project ID and title are required" },
        { status: 400 }
      );
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        description,
        priority,
        dueDate,
        status: "pending",
      })
      .returning();

    // Update project's last activity
    await db
      .update(projects)
      .set({ lastActivityAt: new Date() })
      .where(eq(projects.id, projectId));

    const taskWithProject = await db.query.tasks.findFirst({
      where: eq(tasks.id, newTask.id),
      with: {
        project: true,
      },
    });

    return NextResponse.json(taskWithProject);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks - Update a task
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // If marking as completed, set completedAt
    if (updates.status === "completed") {
      updates.completedAt = new Date();
    } else if (updates.status === "pending") {
      updates.completedAt = null;
    }

    updates.updatedAt = new Date();

    await db.update(tasks).set(updates).where(eq(tasks.id, id));

    const updatedTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        project: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
