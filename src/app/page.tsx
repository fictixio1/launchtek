"use client";

import { useMemo } from "react";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { useProjects, useMoveProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { Stage } from "@/types";

export default function BoardPage() {
  const { data: projects = [], isLoading } = useProjects();
  const { data: allTasks = [] } = useTasks();
  const moveProject = useMoveProject();

  // Calculate completion percentages for each project
  const projectCompletions = useMemo(() => {
    const completions: Record<string, number> = {};

    projects.forEach((project) => {
      let total = 0;
      let completed = 0;

      // Calculate based on stage
      switch (project.stage) {
        case "idea":
          const idea = project.idea;
          if (idea) {
            const fields = [
              idea.oneLiner,
              idea.narrative,
              idea.whyExists,
              idea.whyWins,
              idea.howItWorks,
            ];
            total = fields.length;
            completed = fields.filter(Boolean).length;
          }
          break;

        case "branding":
          // For branding, check if PFP and banner exist
          total = 2;
          // Would need media query - simplified for now
          completed = 0;
          break;

        case "website":
          const website = project.website;
          if (website) {
            total = 4;
            completed = [
              website.landingPageDone,
              website.copyWritten,
              website.mobileChecked,
              website.analyticsAdded,
            ].filter(Boolean).length;
          }
          break;

        case "x":
          const x = project.x;
          if (x) {
            total = 4;
            completed = [
              x.handle,
              x.bio,
              x.bannerUploaded,
              x.launchThreadDrafted,
            ].filter(Boolean).length;
          }
          break;

        case "launch":
          const launch = project.launch;
          if (launch) {
            total = 5;
            completed = [
              launch.tokenDeployed,
              launch.liquidityAdded,
              launch.siteLive,
              launch.xLive,
              launch.tgLive,
            ].filter(Boolean).length;
          }
          break;
      }

      completions[project.id] = total > 0 ? (completed / total) * 100 : 0;
    });

    return completions;
  }, [projects]);

  // Calculate pending task counts for each project
  const projectTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    allTasks.forEach((task) => {
      if (task.status === "pending") {
        counts[task.projectId] = (counts[task.projectId] || 0) + 1;
      }
    });

    return counts;
  }, [allTasks]);

  const handleProjectMove = (projectId: string, newStage: Stage) => {
    moveProject.mutate({ projectId, newStage });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <KanbanBoard
        projects={projects}
        projectCompletions={projectCompletions}
        projectTaskCounts={projectTaskCounts}
        onProjectMove={handleProjectMove}
      />
    </div>
  );
}
