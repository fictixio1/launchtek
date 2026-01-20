import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectPnl } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET /api/stats - Get global PNL statistics
export async function GET() {
  try {
    // Get all launched projects with PNL
    const launchedWithPnl = await db.query.projects.findMany({
      where: eq(projects.status, "launched"),
      with: {
        pnl: true,
        launch: true,
      },
    });

    // Calculate statistics
    let totalPnlSol = 0;
    let wins = 0;
    let losses = 0;
    let breakeven = 0;
    let totalRoi = 0;

    launchedWithPnl.forEach((project) => {
      if (project.pnl) {
        const initial = parseFloat(project.pnl.initialSol as string) || 0;
        const current = parseFloat(project.pnl.currentValueSol as string) || 0;
        const realized = parseFloat(project.pnl.realizedSol as string) || 0;
        const netPnl = current - initial + realized;
        const roi = initial > 0 ? (netPnl / initial) * 100 : 0;

        totalPnlSol += netPnl;
        totalRoi += roi;

        if (netPnl > 0) {
          wins++;
        } else if (netPnl < 0) {
          losses++;
        } else {
          breakeven++;
        }
      }
    });

    const totalLaunched = launchedWithPnl.length;
    const avgRoi = totalLaunched > 0 ? totalRoi / totalLaunched : 0;

    // Get top and worst performers
    const projectsWithPnl = launchedWithPnl
      .filter((p) => p.pnl)
      .map((project) => {
        const initial = parseFloat(project.pnl!.initialSol as string) || 0;
        const current = parseFloat(project.pnl!.currentValueSol as string) || 0;
        const realized = parseFloat(project.pnl!.realizedSol as string) || 0;
        const netPnl = current - initial + realized;
        const roi = initial > 0 ? (netPnl / initial) * 100 : 0;

        return {
          id: project.id,
          name: project.name,
          ticker: project.launch?.ticker,
          netPnl,
          roi,
        };
      })
      .sort((a, b) => b.netPnl - a.netPnl);

    const topPerformers = projectsWithPnl.slice(0, 5);
    const worstPerformers = projectsWithPnl.slice(-5).reverse();

    return NextResponse.json({
      summary: {
        totalLaunched,
        wins,
        losses,
        breakeven,
        totalPnlSol,
        avgRoi,
      },
      topPerformers,
      worstPerformers,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
