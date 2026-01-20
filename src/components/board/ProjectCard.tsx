"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Flame, Moon } from "lucide-react";
import { cn, isActivityRecent } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  completionPercentage?: number;
  pendingTaskCount?: number;
  isDragging?: boolean;
}

export function ProjectCard({
  project,
  completionPercentage = 0,
  pendingTaskCount = 0,
  isDragging,
}: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = isActivityRecent(new Date(project.lastActivityAt));
  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all",
        dragging && "opacity-50 shadow-lg scale-105",
        "hover:border-primary/50"
      )}
    >
      <Link
        href={`/project/${project.id}`}
        className="block"
        onClick={(e) => {
          // Prevent navigation when dragging
          if (dragging) {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Flame className="h-4 w-4 text-orange-500" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium text-sm truncate">{project.name}</span>
          </div>
        </div>

        {/* Avatar placeholder + Tags */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-semibold">
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags?.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <Progress value={completionPercentage} className="h-1.5" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(completionPercentage)}%</span>
            {pendingTaskCount > 0 && (
              <span>{pendingTaskCount} tasks remaining</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Non-draggable version for overlay
export function ProjectCardOverlay({
  project,
  completionPercentage = 0,
  pendingTaskCount = 0,
}: ProjectCardProps) {
  const isActive = isActivityRecent(new Date(project.lastActivityAt));

  return (
    <div className="bg-card border border-primary rounded-lg p-3 shadow-xl w-64">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Flame className="h-4 w-4 text-orange-500" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium text-sm truncate">{project.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-semibold">
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-wrap gap-1">
          {project.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              #{tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Progress value={completionPercentage} className="h-1.5" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(completionPercentage)}%</span>
          {pendingTaskCount > 0 && (
            <span>{pendingTaskCount} tasks remaining</span>
          )}
        </div>
      </div>
    </div>
  );
}
