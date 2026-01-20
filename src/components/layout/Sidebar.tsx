"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  LayoutGrid,
  CheckSquare,
  Image,
  BarChart3,
  Rocket,
  Archive,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn, getStageLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Project, Stage, Priority, Tag, STAGES, PRIORITIES } from "@/types";
import { useState } from "react";

interface SidebarProps {
  projects: Project[];
  tags: Tag[];
  selectedStage: Stage | "all";
  selectedPriority: Priority | "all";
  selectedTags: string[];
  onStageChange: (stage: Stage | "all") => void;
  onPriorityChange: (priority: Priority | "all") => void;
  onTagToggle: (tagId: string) => void;
  onNewProject: () => void;
}

export function Sidebar({
  projects,
  tags,
  selectedStage,
  selectedPriority,
  selectedTags,
  onStageChange,
  onPriorityChange,
  onTagToggle,
  onNewProject,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState({
    active: true,
    launched: false,
    archived: false,
  });

  const activeProjects = projects.filter((p) => p.status === "active");
  const launchedProjects = projects.filter((p) => p.status === "launched");
  const archivedProjects = projects.filter((p) => p.status === "archived");

  const navItems = [
    { href: "/", label: "Board View", icon: LayoutGrid },
    { href: "/launched", label: "Launched", icon: Rocket },
    { href: "/todos", label: "Global To-Do", icon: CheckSquare },
    { href: "/media", label: "Media Library", icon: Image },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const stageOptions = [
    { value: "all", label: "All Stages" },
    ...STAGES.map((s) => ({ value: s, label: getStageLabel(s) })),
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    ...PRIORITIES.map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    })),
  ];

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col h-full">
      {/* New Project Button */}
      <div className="p-4">
        <Button onClick={onNewProject} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-2">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-2">
          NAVIGATION
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto px-2 mt-4">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-2">
          PROJECTS
        </div>

        {/* Active Projects */}
        <ProjectSection
          title="Active"
          count={activeProjects.length}
          icon={<div className="h-2 w-2 rounded-full bg-win" />}
          expanded={expandedSections.active}
          onToggle={() => toggleSection("active")}
          projects={activeProjects}
        />

        {/* Launched Projects */}
        <ProjectSection
          title="Launched"
          count={launchedProjects.length}
          icon={<Rocket className="h-3 w-3 text-muted-foreground" />}
          expanded={expandedSections.launched}
          onToggle={() => toggleSection("launched")}
          projects={launchedProjects}
        />

        {/* Archived Projects */}
        <ProjectSection
          title="Archived"
          count={archivedProjects.length}
          icon={<Archive className="h-3 w-3 text-muted-foreground" />}
          expanded={expandedSections.archived}
          onToggle={() => toggleSection("archived")}
          projects={archivedProjects}
        />
      </div>

      {/* Filters */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground">
          FILTERS
        </div>

        <div className="space-y-2">
          <Select
            options={stageOptions}
            value={selectedStage}
            onChange={(e) => onStageChange(e.target.value as Stage | "all")}
            className="text-xs"
          />
          <Select
            options={priorityOptions}
            value={selectedPriority}
            onChange={(e) =>
              onPriorityChange(e.target.value as Priority | "all")
            }
            className="text-xs"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border transition-colors",
                  selectedTags.includes(tag.id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

interface ProjectSectionProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  projects: Project[];
}

function ProjectSection({
  title,
  count,
  icon,
  expanded,
  onToggle,
  projects,
}: ProjectSectionProps) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {icon}
        <span>{title}</span>
        <Badge variant="secondary" className="ml-auto text-xs">
          {count}
        </Badge>
      </button>

      {expanded && projects.length > 0 && (
        <div className="ml-4 mt-1 space-y-0.5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <span className="truncate">{project.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
