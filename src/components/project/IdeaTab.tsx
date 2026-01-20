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
    targetAudience: idea?.targetAudience ?? "",
    comparableProjects: idea?.comparableProjects ?? "",
  });

  // Update form when project changes
  useEffect(() => {
    setFormData({
      oneLiner: idea?.oneLiner ?? "",
      narrative: idea?.narrative ?? "",
      whyExists: idea?.whyExists ?? "",
      whyWins: idea?.whyWins ?? "",
      targetAudience: idea?.targetAudience ?? "",
      comparableProjects: idea?.comparableProjects ?? "",
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

      {/* Target Audience */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Target Audience</label>
        <Textarea
          value={formData.targetAudience}
          onChange={(e) => handleChange("targetAudience", e.target.value)}
          onBlur={() => handleBlur("targetAudience")}
          placeholder="Who is this for? Describe your ideal holder..."
          rows={3}
          disabled={disabled}
        />
      </div>

      {/* Comparable Projects */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Comparable Projects</label>
        <Textarea
          value={formData.comparableProjects}
          onChange={(e) => handleChange("comparableProjects", e.target.value)}
          onBlur={() => handleBlur("comparableProjects")}
          placeholder="Similar tokens or projects for reference..."
          rows={3}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          What existing projects is this similar to? What can you learn from them?
        </p>
      </div>
    </div>
  );
}
