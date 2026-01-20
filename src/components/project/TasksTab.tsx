"use client";

import { useState } from "react";
import { Plus, Trash2, Check, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Task, Priority, PRIORITIES } from "@/types";

interface TasksTabProps {
  projectId: string;
  disabled?: boolean;
}

export function TasksTab({ projectId, disabled }: TasksTabProps) {
  const { data: tasks = [], isLoading } = useTasks(projectId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    await createTask.mutateAsync({
      projectId,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
    });

    setNewTaskTitle("");
    setNewTaskPriority("medium");
  };

  const handleToggleTask = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      status: task.status === "pending" ? "completed" : "pending",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const priorityOptions = PRIORITIES.map((p) => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
  }));

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Add Task */}
      {!disabled && (
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreateTask();
              }
            }}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Select
            options={priorityOptions}
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
            className="w-28"
          />
          <Button
            onClick={handleCreateTask}
            disabled={!newTaskTitle.trim() || createTask.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pending Tasks */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          PENDING ({pendingTasks.length})
        </div>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No pending tasks</p>
        ) : (
          <div className="space-y-1">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group"
              >
                <button
                  onClick={() => handleToggleTask(task)}
                  className="text-muted-foreground hover:text-foreground"
                  disabled={disabled}
                >
                  <Circle className="h-5 w-5" />
                </button>
                <span className="flex-1">{task.title}</span>
                {getPriorityBadge(task.priority as Priority)}
                {!disabled && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            COMPLETED ({completedTasks.length})
          </div>
          <div className="space-y-1">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group"
              >
                <button
                  onClick={() => handleToggleTask(task)}
                  className="text-win"
                  disabled={disabled}
                >
                  <Check className="h-5 w-5" />
                </button>
                <span className="flex-1 text-muted-foreground line-through">
                  {task.title}
                </span>
                {!disabled && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
