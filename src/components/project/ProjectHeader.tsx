"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Rocket,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getStageLabel } from "@/lib/utils";
import { Project, Stage, STAGES } from "@/types";

interface ProjectHeaderProps {
  project: Project;
  onStageChange: (stage: Stage) => void;
  onLaunch: () => void;
  onArchive: () => void;
}

export function ProjectHeader({
  project,
  onStageChange,
  onLaunch,
  onArchive,
}: ProjectHeaderProps) {
  const stageOptions = STAGES.map((s) => ({
    value: s,
    label: getStageLabel(s),
  }));

  const isLaunched = project.status === "launched";
  const isArchived = project.status === "archived";

  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              {isLaunched && (
                <Badge variant="win">LAUNCHED</Badge>
              )}
              {isArchived && (
                <Badge variant="secondary">ARCHIVED</Badge>
              )}
            </div>

            {project.launch?.ticker && (
              <span className="text-sm text-muted-foreground mono">
                {project.launch.ticker}
              </span>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Quick Links */}
          <div className="flex items-center gap-1">
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" title="Website">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
            {project.xHandle && (
              <a
                href={`https://x.com/${project.xHandle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" title="X/Twitter">
                  <span className="text-sm font-bold">𝕏</span>
                </Button>
              </a>
            )}
            {project.telegramUrl && (
              <a
                href={project.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" title="Telegram">
                  <span className="text-sm">TG</span>
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" title="GitHub">
                  <span className="text-sm">GH</span>
                </Button>
              </a>
            )}
          </div>

          {/* Stage Selector */}
          {!isLaunched && !isArchived && (
            <Select
              options={stageOptions}
              value={project.stage}
              onChange={(e) => onStageChange(e.target.value as Stage)}
              className="w-32"
            />
          )}

          {/* Actions */}
          {!isLaunched && !isArchived && (
            <>
              <Button variant="outline" size="sm" onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button onClick={onLaunch}>
                <Rocket className="h-4 w-4 mr-2" />
                Mark as Launched
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
