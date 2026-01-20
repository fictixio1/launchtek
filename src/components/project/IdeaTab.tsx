"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project, ProjectIdea } from "@/types";

interface IdeaTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectIdea>) => void;
  disabled?: boolean;
}

export function IdeaTab({ project, onUpdate, disabled }: IdeaTabProps) {
  const idea = project.idea;

  const [formData, setFormData] = useState({
    oneLiner: idea?.oneLiner ?? "",
    narrative: idea?.narrative ?? "",
    whyExists: idea?.whyExists ?? "",
    whyWins: idea?.whyWins ?? "",
    howItWorks: idea?.howItWorks ?? "",
  });

  // Update form when project changes
  useEffect(() => {
    setFormData({
      oneLiner: idea?.oneLiner ?? "",
      narrative: idea?.narrative ?? "",
      whyExists: idea?.whyExists ?? "",
      whyWins: idea?.whyWins ?? "",
      howItWorks: idea?.howItWorks ?? "",
    });
  }, [idea]);

  const handleBlur = (field: keyof typeof formData) => {
    if (formData[field] !== (idea?.[field] ?? "")) {
      onUpdate({ [field]: formData[field] || null });
    }
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* One-liner */}
      <div className="space-y-2">
        <label className="text-sm font-medium">One-liner</label>
        <Input
          value={formData.oneLiner}
          onChange={(e) => handleChange("oneLiner", e.target.value)}
          onBlur={() => handleBlur("oneLiner")}
          placeholder="A concise description of your token in one sentence..."
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          The elevator pitch. What is this in one sentence?
        </p>
      </div>

      {/* Narrative / Lore */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Narrative / Lore</label>
        <Textarea
          value={formData.narrative}
          onChange={(e) => handleChange("narrative", e.target.value)}
          onBlur={() => handleBlur("narrative")}
          placeholder="The story behind the token. What's the lore? What makes it interesting?"
          rows={6}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          The story that gets people excited. Meme coins live and die by their narrative.
        </p>
      </div>

      {/* Why It Exists */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Why It Exists</label>
        <Textarea
          value={formData.whyExists}
          onChange={(e) => handleChange("whyExists", e.target.value)}
          onBlur={() => handleBlur("whyExists")}
          placeholder="The problem or opportunity this token addresses..."
          rows={3}
          disabled={disabled}
        />
      </div>

      {/* Why It Wins */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Why It Wins</label>
        <Textarea
          value={formData.whyWins}
          onChange={(e) => handleChange("whyWins", e.target.value)}
          onBlur={() => handleBlur("whyWins")}
          placeholder="The competitive advantage. Why will this succeed where others fail?"
          rows={3}
          disabled={disabled}
        />
      </div>

      {/* How It Works */}
      <div className="space-y-2">
        <label className="text-sm font-medium">How It Works</label>
        <Textarea
          value={formData.howItWorks}
          onChange={(e) => handleChange("howItWorks", e.target.value)}
          onBlur={() => handleBlur("howItWorks")}
          placeholder="Explain the mechanics. How does the token/project actually function?"
          rows={4}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          The mechanics behind the project. Tokenomics, utility, or any unique features.
        </p>
      </div>
    </div>
  );
}
