"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Project, ProjectWebsite } from "@/types";

interface WebsiteTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectWebsite>) => void;
  disabled?: boolean;
}

export function WebsiteTab({ project, onUpdate, disabled }: WebsiteTabProps) {
  const website = project.website;

  const [formData, setFormData] = useState({
    websiteUrl: website?.websiteUrl ?? "",
    repoUrl: website?.repoUrl ?? "",
    hostingNotes: website?.hostingNotes ?? "",
  });

  const [checklist, setChecklist] = useState({
    landingPageDone: website?.landingPageDone ?? false,
    copyWritten: website?.copyWritten ?? false,
    mobileChecked: website?.mobileChecked ?? false,
    analyticsAdded: website?.analyticsAdded ?? false,
  });

  useEffect(() => {
    setFormData({
      websiteUrl: website?.websiteUrl ?? "",
      repoUrl: website?.repoUrl ?? "",
      hostingNotes: website?.hostingNotes ?? "",
    });
    setChecklist({
      landingPageDone: website?.landingPageDone ?? false,
      copyWritten: website?.copyWritten ?? false,
      mobileChecked: website?.mobileChecked ?? false,
      analyticsAdded: website?.analyticsAdded ?? false,
    });
  }, [website]);

  const handleBlur = (field: keyof typeof formData) => {
    if (formData[field] !== (website?.[field] ?? "")) {
      onUpdate({ [field]: formData[field] || null });
    }
  };

  const handleChecklistChange = (field: keyof typeof checklist, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [field]: checked }));
    onUpdate({ [field]: checked });
  };

  const checklistItems = [
    { key: "landingPageDone" as const, label: "Landing page done" },
    { key: "copyWritten" as const, label: "Copy written" },
    { key: "mobileChecked" as const, label: "Mobile checked" },
    { key: "analyticsAdded" as const, label: "Analytics added" },
  ];

  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl">
      {/* Left Column - Checklist */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Checklist</label>
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
              </label>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="text-sm text-muted-foreground">
          {Object.values(checklist).filter(Boolean).length} / 4 completed
        </div>
      </div>

      {/* Right Column - URLs and Notes */}
      <div className="space-y-6">
        {/* Quick Links */}
        {(formData.websiteUrl || formData.repoUrl) && (
          <div className="flex gap-2">
            {formData.websiteUrl && (
              <a
                href={formData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Website
                </Button>
              </a>
            )}
            {formData.repoUrl && (
              <a
                href={formData.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Repo
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Website URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
          <Input
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
            }
            onBlur={() => handleBlur("websiteUrl")}
            placeholder="https://yourtoken.xyz"
            disabled={disabled}
          />
        </div>

        {/* Repo URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Repo URL</label>
          <Input
            value={formData.repoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, repoUrl: e.target.value }))
            }
            onBlur={() => handleBlur("repoUrl")}
            placeholder="https://github.com/user/repo"
            disabled={disabled}
          />
        </div>

        {/* Hosting Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Hosting Notes</label>
          <Textarea
            value={formData.hostingNotes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hostingNotes: e.target.value }))
            }
            onBlur={() => handleBlur("hostingNotes")}
            placeholder="Vercel, custom domain pending..."
            rows={3}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
