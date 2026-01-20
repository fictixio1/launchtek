"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { ProjectCardOverlay } from "./ProjectCard";
import { Project, Stage, STAGES } from "@/types";

interface KanbanBoardProps {
  projects: Project[];
  projectCompletions: Record<string, number>;
  projectTaskCounts: Record<string, number>;
  onProjectMove: (projectId: string, newStage: Stage) => void;
}

export function KanbanBoard({
  projects,
  projectCompletions,
  projectTaskCounts,
  onProjectMove,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group projects by stage
  const projectsByStage = useMemo(() => {
    const grouped: Record<Stage, Project[]> = {
      idea: [],
      branding: [],
      website: [],
      x: [],
      launch: [],
    };

    projects.forEach((project) => {
      if (project.status === "active") {
        grouped[project.stage].push(project);
      }
    });

    return grouped;
  }, [projects]);

  const activeProject = useMemo(() => {
    if (!activeId) return null;
    return projects.find((p) => p.id === activeId) ?? null;
  }, [activeId, projects]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Could be used for visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const projectId = active.id as string;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Check if dropped on a column (stage)
    const overId = over.id as string;
    if (STAGES.includes(overId as Stage)) {
      const newStage = overId as Stage;
      if (project.stage !== newStage) {
        onProjectMove(projectId, newStage);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            projects={projectsByStage[stage]}
            projectCompletions={projectCompletions}
            projectTaskCounts={projectTaskCounts}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProject && (
          <ProjectCardOverlay
            project={activeProject}
            completionPercentage={projectCompletions[activeProject.id] ?? 0}
            pendingTaskCount={projectTaskCounts[activeProject.id] ?? 0}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
