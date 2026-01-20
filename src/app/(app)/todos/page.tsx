"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Trash2, Check, Circle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Task, Priority, PRIORITIES } from "@/types";

type FilterOption = "all" | "pending" | "completed";

export default function GlobalTodosPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [filter, setFilter] = useState<FilterOption>("pending");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  const groupedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter === "pending") {
      filtered = filtered.filter((t) => t.status === "pending");
    } else if (filter === "completed") {
      filtered = filtered.filter((t) => t.status === "completed");
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // Group by priority for pending tasks
    if (filter !== "completed") {
      return {
        high: filtered.filter((t) => t.priority === "high" && t.status === "pending"),
        medium: filtered.filter((t) => t.priority === "medium" && t.status === "pending"),
        low: filtered.filter((t) => t.priority === "low" && t.status === "pending"),
        completed: filtered.filter((t) => t.status === "completed"),
      };
    }

    return {
      high: [],
      medium: [],
      low: [],
      completed: filtered,
    };
  }, [tasks, filter, priorityFilter]);

  const handleToggleTask = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      status: task.status === "pending" ? "completed" : "pending",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    ...PRIORITIES.map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    })),
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  const renderTaskItem = (task: Task) => (
    <div
      key={task.id}
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors group"
    >
      <button
        onClick={() => handleToggleTask(task)}
        className={
          task.status === "completed"
            ? "text-win"
            : "text-muted-foreground hover:text-foreground"
        }
      >
        {task.status === "completed" ? (
          <Check className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={
            task.status === "completed"
              ? "text-muted-foreground line-through"
              : ""
          }
        >
          {task.title}
        </span>
      </div>

      <Link
        href={`/project/${task.projectId}`}
        className="text-xs text-muted-foreground hover:text-foreground truncate max-w-[150px]"
      >
        {task.project?.name}
      </Link>

      {task.dueDate && (
        <span className="text-xs text-muted-foreground">
          Due: {String(task.dueDate)}
        </span>
      )}

      <button
        onClick={() => handleDeleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  const renderSection = (
    title: string,
    tasks: Task[],
    variant: "high" | "medium" | "low" | "completed"
  ) => {
    if (tasks.length === 0) return null;

    const colors = {
      high: "text-destructive",
      medium: "text-foreground",
      low: "text-muted-foreground",
      completed: "text-win",
    };

    return (
      <div className="space-y-2">
        <div className={`text-sm font-medium ${colors[variant]}`}>
          {title} ({tasks.length})
        </div>
        <div className="space-y-2">{tasks.map(renderTaskItem)}</div>
      </div>
    );
  };

  const pendingCount =
    groupedTasks.high.length +
    groupedTasks.medium.length +
    groupedTasks.low.length;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Global To-Do</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount} pending across all projects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            options={filterOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="w-32"
          />
          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as Priority | "all")
            }
            className="w-36"
          />
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filter !== "completed" && (
            <>
              {renderSection("HIGH PRIORITY", groupedTasks.high, "high")}
              {renderSection("MEDIUM PRIORITY", groupedTasks.medium, "medium")}
              {renderSection("LOW PRIORITY", groupedTasks.low, "low")}
            </>
          )}

          {(filter === "all" || filter === "completed") &&
            groupedTasks.completed.length > 0 && (
              <>
                {filter === "all" && <hr className="border-border" />}
                {renderSection(
                  "COMPLETED",
                  groupedTasks.completed,
                  "completed"
                )}
              </>
            )}

          {pendingCount === 0 && filter === "pending" && (
            <div className="flex items-center justify-center h-32 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">All tasks completed!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
