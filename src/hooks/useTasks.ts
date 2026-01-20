"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, Priority, TaskStatus } from "@/types";

// Fetch all tasks
export function useTasks(projectId?: string) {
  const url = projectId ? `/api/tasks?projectId=${projectId}` : "/api/tasks";

  return useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      title: string;
      description?: string;
      priority?: Priority;
      dueDate?: string;
    }) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      title?: string;
      description?: string;
      priority?: Priority;
      status?: TaskStatus;
      dueDate?: string | null;
    }) => {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.projectId] });
    },
  });
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Toggle task completion
export function useToggleTask() {
  const updateTask = useUpdateTask();

  return {
    ...updateTask,
    mutate: (task: Task) => {
      updateTask.mutate({
        id: task.id,
        status: task.status === "pending" ? "completed" : "pending",
      });
    },
  };
}
