"use client";

import { formatSol, getPnlColorClass } from "@/lib/utils";
import { GlobalPnlSummary } from "@/types";

interface HeaderProps {
  globalPnl?: GlobalPnlSummary;
}

export function Header({ globalPnl }: HeaderProps) {
  const totalPnl = globalPnl?.totalPnlSol ?? 0;
  const pnlStatus =
    totalPnl > 0 ? "win" : totalPnl < 0 ? "loss" : "breakeven";

  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight mono">
          TOKEN TRACKER
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Global PNL:</span>
          <span
            className={`text-sm font-semibold mono ${getPnlColorClass(pnlStatus)}`}
          >
            {formatSol(totalPnl)}
          </span>
        </div>
      </div>
    </header>
  );
}
