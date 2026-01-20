"use client";

import { useState, useMemo } from "react";
import { Rocket, Check } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  formatSol,
  formatRoi,
  calculateNetPnl,
  calculateRoi,
  calculatePnlStatus,
} from "@/lib/utils";
import { Project, LaunchCompletionInput, PnlStatus } from "@/types";

interface LaunchCompletionModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onComplete: (data: LaunchCompletionInput) => void;
  isLoading?: boolean;
}

export function LaunchCompletionModal({
  open,
  onClose,
  project,
  onComplete,
  isLoading,
}: LaunchCompletionModalProps) {
  const [checklist, setChecklist] = useState({
    tokenDeployed: true,
    liquidityAdded: true,
    siteLive: true,
    xLive: true,
    tgLive: true,
  });

  const [initialSol, setInitialSol] = useState("");
  const [currentValueSol, setCurrentValueSol] = useState("");
  const [realizedSol, setRealizedSol] = useState("");
  const [notes, setNotes] = useState("");
  const [ticker, setTicker] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [chain, setChain] = useState("SOL");

  const pnlCalculations = useMemo(() => {
    const initial = parseFloat(initialSol) || 0;
    const current = parseFloat(currentValueSol) || 0;
    const realized = parseFloat(realizedSol) || 0;

    const netPnl = calculateNetPnl(initial, current, realized);
    const roi = calculateRoi(initial, current, realized);
    const status = calculatePnlStatus(initial, current, realized);

    return { netPnl, roi, status };
  }, [initialSol, currentValueSol, realizedSol]);

  const isValid = useMemo(() => {
    return (
      ticker.trim() !== "" &&
      parseFloat(initialSol) >= 0 &&
      parseFloat(currentValueSol) >= 0
    );
  }, [ticker, initialSol, currentValueSol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onComplete({
      initialSol: parseFloat(initialSol) || 0,
      currentValueSol: parseFloat(currentValueSol) || 0,
      realizedSol: parseFloat(realizedSol) || 0,
      notes: notes.trim() || undefined,
      ticker: ticker.trim(),
      contractAddress: contractAddress.trim() || undefined,
      chain,
    });

    // Reset form
    setInitialSol("");
    setCurrentValueSol("");
    setRealizedSol("");
    setNotes("");
    setTicker("");
    setContractAddress("");
  };

  const handleClose = () => {
    setInitialSol("");
    setCurrentValueSol("");
    setRealizedSol("");
    setNotes("");
    setTicker("");
    setContractAddress("");
    onClose();
  };

  const getStatusBadge = (status: PnlStatus) => {
    switch (status) {
      case "win":
        return <Badge variant="win">WIN</Badge>;
      case "loss":
        return <Badge variant="loss">LOSS</Badge>;
      default:
        return <Badge variant="breakeven">BREAKEVEN</Badge>;
    }
  };

  if (!project) return null;

  return (
    <Modal open={open} onClose={handleClose} className="max-w-xl">
      <form onSubmit={handleSubmit}>
        <ModalHeader onClose={handleClose}>
          <ModalTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Complete Launch: {project.name}
          </ModalTitle>
        </ModalHeader>

        <ModalContent className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Section A: Final Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              SECTION A — FINAL CHECKLIST
            </h4>
            <div className="space-y-2">
              {Object.entries(checklist).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({ ...prev, [key]: checked }))
                    }
                  />
                  <span className="text-sm">
                    {key === "tokenDeployed" && "Token deployed"}
                    {key === "liquidityAdded" && "Liquidity added"}
                    {key === "siteLive" && "Site live"}
                    {key === "xLive" && "X live"}
                    {key === "tgLive" && "TG live"}
                  </span>
                  {value && <Check className="h-4 w-4 text-win ml-auto" />}
                </label>
              ))}
            </div>
          </div>

          {/* Section B: PNL */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              SECTION B — PNL (SOL)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Initial SOL Invested
                </label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={initialSol}
                  onChange={(e) => setInitialSol(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Current Value (SOL)
                </label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={currentValueSol}
                  onChange={(e) => setCurrentValueSol(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Realized (optional)
                </label>
                <Input
                  type="number"
                  step="0.001"
                  value={realizedSol}
                  onChange={(e) => setRealizedSol(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* PNL Summary */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">NET PNL:</span>
                  <span
                    className={`ml-2 font-semibold mono ${
                      pnlCalculations.status === "win"
                        ? "text-win"
                        : pnlCalculations.status === "loss"
                          ? "text-loss"
                          : "text-breakeven"
                    }`}
                  >
                    {formatSol(pnlCalculations.netPnl)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">ROI:</span>
                  <span className="ml-2 font-semibold mono">
                    {formatRoi(pnlCalculations.roi)}
                  </span>
                </div>
              </div>
              {getStatusBadge(pnlCalculations.status)}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this launch..."
                rows={2}
              />
            </div>
          </div>

          {/* Section C: Metadata */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              SECTION C — METADATA
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Ticker *
                </label>
                <Input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="$TOKEN"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Chain</label>
                <Input value={chain} onChange={(e) => setChain(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Contract Address
              </label>
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Optional"
                className="mono text-xs"
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid || isLoading}>
            {isLoading ? "Completing..." : "Confirm & Complete"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
