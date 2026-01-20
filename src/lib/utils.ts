import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PnlStatus, Stage } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSol(amount: number): string {
  const sign = amount >= 0 ? "+" : "";
  return `${sign}${amount.toFixed(2)} SOL`;
}

export function formatRoi(percentage: number): string {
  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage.toFixed(0)}%`;
}

export function getPnlColorClass(status: PnlStatus): string {
  switch (status) {
    case "win":
      return "text-win";
    case "loss":
      return "text-loss";
    default:
      return "text-breakeven";
  }
}

export function getPnlBgClass(status: PnlStatus): string {
  switch (status) {
    case "win":
      return "bg-win/10";
    case "loss":
      return "bg-loss/10";
    default:
      return "bg-breakeven/10";
  }
}

export function getStageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    idea: "Idea",
    branding: "Branding",
    website: "Website",
    x: "X",
    launch: "Launch",
  };
  return labels[stage];
}

export function getStageIndex(stage: Stage): number {
  const stages: Stage[] = ["idea", "branding", "website", "x", "launch"];
  return stages.indexOf(stage);
}

export function calculatePnlStatus(
  initial: number,
  current: number,
  realized: number = 0
): PnlStatus {
  const netPnl = current - initial + realized;
  if (netPnl > 0) return "win";
  if (netPnl < 0) return "loss";
  return "breakeven";
}

export function calculateNetPnl(
  initial: number,
  current: number,
  realized: number = 0
): number {
  return current - initial + realized;
}

export function calculateRoi(
  initial: number,
  current: number,
  realized: number = 0
): number {
  if (initial === 0) return 0;
  const netPnl = current - initial + realized;
  return (netPnl / initial) * 100;
}

export function isActivityRecent(lastActivity: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - lastActivity.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours < 24; // Active if updated within last 24 hours
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
