"use client";

import { useQuery } from "@tanstack/react-query";
import { GlobalPnlSummary } from "@/types";

interface StatsResponse {
  summary: GlobalPnlSummary;
  topPerformers: {
    id: string;
    name: string;
    ticker: string | null;
    netPnl: number;
    roi: number;
  }[];
  worstPerformers: {
    id: string;
    name: string;
    ticker: string | null;
    netPnl: number;
    roi: number;
  }[];
}

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}
