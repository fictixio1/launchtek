import { create } from "zustand";
import {
  Project,
  Tag,
  Task,
  Stage,
  Priority,
  GlobalPnlSummary,
  Media,
} from "@/types";

interface AppState {
  // Projects
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Tags
  tags: Tag[];
  setTags: (tags: Tag[]) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;

  // Media
  media: Media[];
  setMedia: (media: Media[]) => void;
  addMedia: (item: Media) => void;
  removeMedia: (id: string) => void;

  // Global PNL
  globalPnl: GlobalPnlSummary | null;
  setGlobalPnl: (pnl: GlobalPnlSummary) => void;

  // Filters
  selectedStage: Stage | "all";
  selectedPriority: Priority | "all";
  selectedTags: string[];
  setSelectedStage: (stage: Stage | "all") => void;
  setSelectedPriority: (priority: Priority | "all") => void;
  toggleSelectedTag: (tagId: string) => void;
  clearFilters: () => void;

  // UI State
  isNewProjectModalOpen: boolean;
  setNewProjectModalOpen: (open: boolean) => void;
  isLaunchModalOpen: boolean;
  setLaunchModalOpen: (open: boolean) => void;
  launchingProjectId: string | null;
  setLaunchingProjectId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Projects
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  // Tags
  tags: [],
  setTags: (tags) => set({ tags }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  // Media
  media: [],
  setMedia: (media) => set({ media }),
  addMedia: (item) => set((state) => ({ media: [...state.media, item] })),
  removeMedia: (id) =>
    set((state) => ({ media: state.media.filter((m) => m.id !== id) })),

  // Global PNL
  globalPnl: null,
  setGlobalPnl: (pnl) => set({ globalPnl: pnl }),

  // Filters
  selectedStage: "all",
  selectedPriority: "all",
  selectedTags: [],
  setSelectedStage: (stage) => set({ selectedStage: stage }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  toggleSelectedTag: (tagId) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((id) => id !== tagId)
        : [...state.selectedTags, tagId],
    })),
  clearFilters: () =>
    set({
      selectedStage: "all",
      selectedPriority: "all",
      selectedTags: [],
    }),

  // UI State
  isNewProjectModalOpen: false,
  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),
  isLaunchModalOpen: false,
  setLaunchModalOpen: (open) => set({ isLaunchModalOpen: open }),
  launchingProjectId: null,
  setLaunchingProjectId: (id) => set({ launchingProjectId: id }),
}));

// Selectors
export const useActiveProjects = () =>
  useAppStore((state) =>
    state.projects.filter((p) => p.status === "active")
  );

export const useLaunchedProjects = () =>
  useAppStore((state) =>
    state.projects.filter((p) => p.status === "launched")
  );

export const useFilteredProjects = () =>
  useAppStore((state) => {
    let filtered = state.projects.filter((p) => p.status === "active");

    if (state.selectedStage !== "all") {
      filtered = filtered.filter((p) => p.stage === state.selectedStage);
    }

    if (state.selectedPriority !== "all") {
      filtered = filtered.filter((p) => p.priority === state.selectedPriority);
    }

    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => state.selectedTags.includes(t.id))
      );
    }

    return filtered;
  });

export const usePendingTasks = () =>
  useAppStore((state) =>
    state.tasks.filter((t) => t.status === "pending")
  );

export const useProjectTasks = (projectId: string) =>
  useAppStore((state) =>
    state.tasks.filter((t) => t.projectId === projectId)
  );
