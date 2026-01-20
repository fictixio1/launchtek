"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { IdeaTab } from "@/components/project/IdeaTab";
import { BrandingTab } from "@/components/project/BrandingTab";
import { WebsiteTab } from "@/components/project/WebsiteTab";
import { XTab } from "@/components/project/XTab";
import { LaunchTab } from "@/components/project/LaunchTab";
import { TasksTab } from "@/components/project/TasksTab";
import { LaunchCompletionModal } from "@/components/modals/LaunchCompletionModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useCompleteLaunch,
} from "@/hooks/useProjects";
import { Stage, LaunchCompletionInput } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const completeLaunch = useCompleteLaunch();

  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("idea");

  const handleStageChange = (stage: Stage) => {
    updateProject.mutate({ id, stage });
  };

  const handleUpdate = (updates: Record<string, unknown>) => {
    updateProject.mutate({ id, ...updates });
  };

  const handleArchive = async () => {
    await deleteProject.mutateAsync(id);
    router.push("/");
  };

  const handleCompleteLaunch = async (data: LaunchCompletionInput) => {
    await completeLaunch.mutateAsync({ projectId: id, data });
    setLaunchModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">Project not found</div>
      </div>
    );
  }

  const isReadOnly = project.status === "launched" || project.status === "archived";

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader
        project={project}
        onStageChange={handleStageChange}
        onLaunch={() => setLaunchModalOpen(true)}
        onArchive={handleArchive}
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="idea">Idea</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="x">X</TabsTrigger>
            <TabsTrigger value="launch">Launch</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="idea">
            <IdeaTab
              project={project}
              onUpdate={handleUpdate}
              disabled={isReadOnly}
            />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingTab
              project={project}
              onUpdate={handleUpdate}
              disabled={isReadOnly}
            />
          </TabsContent>

          <TabsContent value="website">
            <WebsiteTab
              project={project}
              onUpdate={handleUpdate}
              disabled={isReadOnly}
            />
          </TabsContent>

          <TabsContent value="x">
            <XTab
              project={project}
              onUpdate={handleUpdate}
              disabled={isReadOnly}
            />
          </TabsContent>

          <TabsContent value="launch">
            <LaunchTab
              project={project}
              onUpdate={handleUpdate}
              onLaunch={() => setLaunchModalOpen(true)}
              disabled={isReadOnly}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksTab projectId={id} disabled={isReadOnly} />
          </TabsContent>
        </Tabs>
      </div>

      <LaunchCompletionModal
        open={isLaunchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        project={project}
        onComplete={handleCompleteLaunch}
        isLoading={completeLaunch.isPending}
      />
    </div>
  );
}
