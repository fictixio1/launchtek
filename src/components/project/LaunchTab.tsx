"use client";

import { useState, useEffect } from "react";
import { Rocket, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Project, ProjectLaunch } from "@/types";

interface LaunchTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectLaunch>) => void;
  onLaunch: () => void;
  disabled?: boolean;
}

export function LaunchTab({
  project,
  onUpdate,
  onLaunch,
  disabled,
}: LaunchTabProps) {
  const launch = project.launch;

  const [checklist, setChecklist] = useState({
    tokenDeployed: launch?.tokenDeployed ?? false,
    liquidityAdded: launch?.liquidityAdded ?? false,
    siteLive: launch?.siteLive ?? false,
    xLive: launch?.xLive ?? false,
    tgLive: launch?.tgLive ?? false,
  });

  const [preLaunchNotes, setPreLaunchNotes] = useState(
    launch?.preLaunchNotes ?? ""
  );

  useEffect(() => {
    setChecklist({
      tokenDeployed: launch?.tokenDeployed ?? false,
      liquidityAdded: launch?.liquidityAdded ?? false,
      siteLive: launch?.siteLive ?? false,
      xLive: launch?.xLive ?? false,
      tgLive: launch?.tgLive ?? false,
    });
    setPreLaunchNotes(launch?.preLaunchNotes ?? "");
  }, [launch]);

  const handleChecklistChange = (
    field: keyof typeof checklist,
    checked: boolean
  ) => {
    setChecklist((prev) => ({ ...prev, [field]: checked }));
    onUpdate({ [field]: checked });
  };

  const handleNotesBlur = () => {
    if (preLaunchNotes !== (launch?.preLaunchNotes ?? "")) {
      onUpdate({ preLaunchNotes: preLaunchNotes || null });
    }
  };

  const checklistItems = [
    { key: "tokenDeployed" as const, label: "Token deployed" },
    { key: "liquidityAdded" as const, label: "Liquidity added" },
    { key: "siteLive" as const, label: "Site live" },
    { key: "xLive" as const, label: "X live" },
    { key: "tgLive" as const, label: "TG live" },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const isReady = completedCount === totalCount;

  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl">
      {/* Left Column - Checklist */}
      <div className="space-y-6">
        <div className="text-sm font-medium text-muted-foreground">
          LAUNCH CHECKLIST
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={checklist[item.key]}
                onCheckedChange={(checked) =>
                  handleChecklistChange(item.key, checked as boolean)
                }
                disabled={disabled}
              />
              <span
                className={
                  checklist[item.key]
                    ? "text-muted-foreground line-through"
                    : ""
                }
              >
                {item.label}
              </span>
              {checklist[item.key] && (
                <Check className="h-4 w-4 text-win ml-auto" />
              )}
            </label>
          ))}
        </div>

        {/* Pre-launch Notes */}
        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium">Pre-launch Notes</label>
          <Textarea
            value={preLaunchNotes}
            onChange={(e) => setPreLaunchNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Coordinate with KOLs, check liquidity depth..."
            rows={4}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Right Column - Status */}
      <div className="space-y-6">
        <div className="text-sm font-medium text-muted-foreground">
          LAUNCH STATUS
        </div>

        <div
          className={`p-6 rounded-lg border ${
            isReady
              ? "border-win bg-win/10"
              : "border-border bg-muted"
          }`}
        >
          <div className="flex items-center gap-3">
            {isReady ? (
              <div className="h-3 w-3 rounded-full bg-win" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            )}
            <span className="font-semibold">
              {isReady ? "READY TO LAUNCH" : "NOT READY"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedCount}/{totalCount} items complete
          </p>
        </div>

        {!disabled && (
          <Button
            onClick={onLaunch}
            className="w-full"
            size="lg"
            disabled={!isReady}
          >
            <Rocket className="h-5 w-5 mr-2" />
            MARK AS LAUNCHED
          </Button>
        )}

        {/* Launched Info */}
        {project.status === "launched" && project.pnl && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ticker</span>
              <span className="font-semibold mono">
                {project.launch?.ticker}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chain</span>
              <span>{project.launch?.chain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Launch Date</span>
              <span>{project.launch?.launchDate ? String(project.launch.launchDate) : ""}</span>
            </div>
            {project.launch?.contractAddress && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract</span>
                <span className="text-xs mono truncate max-w-[150px]">
                  {project.launch.contractAddress}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
