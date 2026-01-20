"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn, getStageLabel } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { Project, Stage } from "@/types";

interface KanbanColumnProps {
  stage: Stage;
  projects: Project[];
  projectCompletions: Record<string, number>;
  projectTaskCounts: Record<string, number>;
}

export function KanbanColumn({
  stage,
  projects,
  projectCompletions,
  projectTaskCounts,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const projectIds = projects.map((p) => p.id);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            {getStageLabel(stage)}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {projects.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 overflow-y-auto kanban-column transition-colors",
          isOver && "bg-accent/30"
        )}
      >
        <SortableContext
          items={projectIds}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              completionPercentage={projectCompletions[project.id] ?? 0}
              pendingTaskCount={projectTaskCounts[project.id] ?? 0}
            />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-border rounded-lg">
            <span className="text-xs text-muted-foreground">
              Drop projects here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
