"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { formatSol, formatRoi, getPnlColorClass } from "@/lib/utils";
import { PnlStatus } from "@/types";
import { useState } from "react";

type SortOption = "pnl" | "roi" | "date" | "name";

export default function LaunchedPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [sortBy, setSortBy] = useState<SortOption>("pnl");

  const launchedProjects = useMemo(() => {
    const launched = projects.filter((p) => p.status === "launched");

    // Calculate PNL for each project
    const withPnl = launched.map((project) => {
      const pnl = project.pnl;
      const initial = parseFloat(String(pnl?.initialSol ?? 0)) || 0;
      const current = parseFloat(String(pnl?.currentValueSol ?? 0)) || 0;
      const realized = parseFloat(String(pnl?.realizedSol ?? 0)) || 0;
      const netPnl = current - initial + realized;
      const roi = initial > 0 ? (netPnl / initial) * 100 : 0;
      const status: PnlStatus =
        netPnl > 0 ? "win" : netPnl < 0 ? "loss" : "breakeven";

      return {
        ...project,
        netPnl,
        roi,
        pnlStatus: status,
      };
    });

    // Sort
    switch (sortBy) {
      case "pnl":
        return withPnl.sort((a, b) => b.netPnl - a.netPnl);
      case "roi":
        return withPnl.sort((a, b) => b.roi - a.roi);
      case "date":
        return withPnl.sort(
          (a, b) =>
            new Date(b.launch?.launchDate ?? 0).getTime() -
            new Date(a.launch?.launchDate ?? 0).getTime()
        );
      case "name":
        return withPnl.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return withPnl;
    }
  }, [projects, sortBy]);

  const sortOptions = [
    { value: "pnl", label: "Sort by PNL" },
    { value: "roi", label: "Sort by ROI" },
    { value: "date", label: "Sort by Date" },
    { value: "name", label: "Sort by Name" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Launched Projects</h1>
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-40"
        />
      </div>

      {launchedProjects.length === 0 ? (
        <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No launched projects yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {launchedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className={`p-4 rounded-lg border transition-colors hover:border-primary/50 ${
                project.pnlStatus === "win"
                  ? "border-win/30 bg-win/5"
                  : project.pnlStatus === "loss"
                    ? "border-loss/30 bg-loss/5"
                    : "border-border bg-card"
              }`}
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">
                    {project.launch?.ticker ?? project.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {project.launch?.launchDate ? String(project.launch.launchDate) : ""}
                  </div>
                </div>
              </div>

              {/* PNL */}
              <div className="space-y-1">
                <div
                  className={`text-xl font-bold mono ${getPnlColorClass(project.pnlStatus)}`}
                >
                  {formatSol(project.netPnl)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      project.pnlStatus === "win"
                        ? "win"
                        : project.pnlStatus === "loss"
                          ? "loss"
                          : "secondary"
                    }
                  >
                    {project.pnlStatus === "win"
                      ? "+"
                      : project.pnlStatus === "loss"
                        ? ""
                        : ""}
                    {formatRoi(project.roi)}
                  </Badge>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      project.pnlStatus === "win"
                        ? "bg-win"
                        : project.pnlStatus === "loss"
                          ? "bg-loss"
                          : "bg-breakeven"
                    }`}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
