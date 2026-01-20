"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { NewProjectModal } from "@/components/modals/NewProjectModal";
import { LaunchCompletionModal } from "@/components/modals/LaunchCompletionModal";
import { useProjects, useCreateProject, useCompleteLaunch } from "@/hooks/useProjects";
import { useStats } from "@/hooks/useStats";
import { Stage, Priority, LaunchCompletionInput } from "@/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: projects = [] } = useProjects();
  const { data: stats } = useStats();
  const createProject = useCreateProject();
  const completeLaunch = useCompleteLaunch();

  // Filter state
  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">(
    "all"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Modal state
  const [isNewProjectOpen, setNewProjectOpen] = useState(false);
  const [launchingProject, setLaunchingProject] = useState<string | null>(null);

  // Get unique tags from all projects
  const tags = useMemo(() => {
    const tagMap = new Map<string, { id: string; name: string; color: string }>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => {
        tagMap.set(tag.id, tag);
      });
    });
    return Array.from(tagMap.values());
  }, [projects]);

  const handleCreateProject = async (data: {
    name: string;
    stage: Stage;
    priority: Priority;
  }) => {
    await createProject.mutateAsync(data);
    setNewProjectOpen(false);
  };

  const handleCompleteLaunch = async (data: LaunchCompletionInput) => {
    if (!launchingProject) return;
    await completeLaunch.mutateAsync({ projectId: launchingProject, data });
    setLaunchingProject(null);
  };

  const launchingProjectData = useMemo(
    () => projects.find((p) => p.id === launchingProject) ?? null,
    [projects, launchingProject]
  );

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <Header globalPnl={stats?.summary} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          projects={projects}
          tags={tags}
          selectedStage={selectedStage}
          selectedPriority={selectedPriority}
          selectedTags={selectedTags}
          onStageChange={setSelectedStage}
          onPriorityChange={setSelectedPriority}
          onTagToggle={handleTagToggle}
          onNewProject={() => setNewProjectOpen(true)}
        />

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      <NewProjectModal
        open={isNewProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreateProject}
        isLoading={createProject.isPending}
      />

      <LaunchCompletionModal
        open={!!launchingProject}
        onClose={() => setLaunchingProject(null)}
        project={launchingProjectData}
        onComplete={handleCompleteLaunch}
        isLoading={completeLaunch.isPending}
      />
    </div>
  );
}
