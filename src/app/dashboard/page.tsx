"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStats } from "@/hooks/useStats";
import { formatSol, formatRoi, getPnlColorClass } from "@/lib/utils";

export default function DashboardPage() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const summary = stats?.summary ?? {
    totalLaunched: 0,
    wins: 0,
    losses: 0,
    breakeven: 0,
    totalPnlSol: 0,
    avgRoi: 0,
  };

  const pnlStatus =
    summary.totalPnlSol > 0
      ? "win"
      : summary.totalPnlSol < 0
        ? "loss"
        : "breakeven";

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Total PNL Card */}
      <div
        className={`p-8 rounded-lg border ${
          pnlStatus === "win"
            ? "border-win bg-win/5"
            : pnlStatus === "loss"
              ? "border-loss bg-loss/5"
              : "border-border bg-muted"
        }`}
      >
        <div className="text-sm text-muted-foreground mb-2">
          TOTAL GLOBAL PNL
        </div>
        <div
          className={`text-4xl font-bold mono ${getPnlColorClass(pnlStatus)}`}
        >
          {formatSol(summary.totalPnlSol)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4 text-win" />
            <span className="text-sm">WINS</span>
          </div>
          <div className="text-3xl font-bold text-win">{summary.wins}</div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingDown className="h-4 w-4 text-loss" />
            <span className="text-sm">LOSSES</span>
          </div>
          <div className="text-3xl font-bold text-loss">{summary.losses}</div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="h-4 w-4" />
            <span className="text-sm">AVG ROI</span>
          </div>
          <div className="text-3xl font-bold">{formatRoi(summary.avgRoi)}</div>
        </div>
      </div>

      {/* Performance Lists */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            TOP PERFORMERS
          </div>
          {(stats?.topPerformers ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No launched projects yet
            </p>
          ) : (
            <div className="space-y-2">
              {stats?.topPerformers.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-win/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4">
                      {index + 1}.
                    </span>
                    <span className="font-medium">
                      {project.ticker ?? project.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-win mono">
                      {formatSol(project.netPnl)}
                    </span>
                    <Badge variant="win">{formatRoi(project.roi)}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Worst Performers */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            WORST PERFORMERS
          </div>
          {(stats?.worstPerformers ?? []).filter((p) => p.netPnl < 0).length ===
          0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No losses recorded
            </p>
          ) : (
            <div className="space-y-2">
              {stats?.worstPerformers
                .filter((p) => p.netPnl < 0)
                .map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-loss/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-4">
                        {index + 1}.
                      </span>
                      <span className="font-medium">
                        {project.ticker ?? project.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-loss mono">
                        {formatSol(project.netPnl)}
                      </span>
                      <Badge variant="loss">{formatRoi(project.roi)}</Badge>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">
          PNL OVER TIME
        </div>
        <div className="h-48 rounded-lg border border-dashed border-border flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-5 w-5" />
            <span>Chart coming in v2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
