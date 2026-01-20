"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Project, ProjectX } from "@/types";

interface XTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectX>) => void;
  disabled?: boolean;
}

export function XTab({ project, onUpdate, disabled }: XTabProps) {
  const x = project.x;

  const [formData, setFormData] = useState({
    handle: x?.handle ?? "",
    bio: x?.bio ?? "",
    pinnedTweetUrl: x?.pinnedTweetUrl ?? "",
    schedulingNotes: x?.schedulingNotes ?? "",
  });

  const [status, setStatus] = useState({
    bannerUploaded: x?.bannerUploaded ?? false,
    launchThreadDrafted: x?.launchThreadDrafted ?? false,
  });

  useEffect(() => {
    setFormData({
      handle: x?.handle ?? "",
      bio: x?.bio ?? "",
      pinnedTweetUrl: x?.pinnedTweetUrl ?? "",
      schedulingNotes: x?.schedulingNotes ?? "",
    });
    setStatus({
      bannerUploaded: x?.bannerUploaded ?? false,
      launchThreadDrafted: x?.launchThreadDrafted ?? false,
    });
  }, [x]);

  const handleBlur = (field: keyof typeof formData) => {
    if (formData[field] !== (x?.[field] ?? "")) {
      onUpdate({ [field]: formData[field] || null });
    }
  };

  const handleStatusChange = (field: keyof typeof status, checked: boolean) => {
    setStatus((prev) => ({ ...prev, [field]: checked }));
    onUpdate({ [field]: checked });
  };

  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl">
      {/* Left Column - Profile */}
      <div className="space-y-6">
        <div className="text-sm font-medium text-muted-foreground">
          X PROFILE
        </div>

        {/* Handle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Handle</label>
          <div className="flex gap-2">
            <Input
              value={formData.handle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, handle: e.target.value }))
              }
              onBlur={() => handleBlur("handle")}
              placeholder="@yourtoken"
              disabled={disabled}
            />
            {formData.handle && (
              <a
                href={`https://x.com/${formData.handle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            onBlur={() => handleBlur("bio")}
            placeholder="Your X bio..."
            rows={4}
            maxLength={160}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            {formData.bio.length}/160 characters
          </p>
        </div>

        {/* Status Checkboxes */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">STATUS</div>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={status.bannerUploaded}
              onCheckedChange={(checked) =>
                handleStatusChange("bannerUploaded", checked as boolean)
              }
              disabled={disabled}
            />
            <span
              className={
                status.bannerUploaded
                  ? "text-muted-foreground line-through"
                  : ""
              }
            >
              Banner uploaded
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={status.launchThreadDrafted}
              onCheckedChange={(checked) =>
                handleStatusChange("launchThreadDrafted", checked as boolean)
              }
              disabled={disabled}
            />
            <span
              className={
                status.launchThreadDrafted
                  ? "text-muted-foreground line-through"
                  : ""
              }
            >
              Launch thread drafted
            </span>
          </label>
        </div>
      </div>

      {/* Right Column - Additional */}
      <div className="space-y-6">
        {/* Pinned Tweet */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pinned Tweet URL</label>
          <Input
            value={formData.pinnedTweetUrl}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                pinnedTweetUrl: e.target.value,
              }))
            }
            onBlur={() => handleBlur("pinnedTweetUrl")}
            placeholder="https://x.com/token/status/..."
            disabled={disabled}
          />
        </div>

        {/* Draft Tweets Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Draft Tweets</label>
          <div className="border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
            Draft tweet storage coming in v2
          </div>
        </div>

        {/* Scheduling Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Scheduling Notes</label>
          <Textarea
            value={formData.schedulingNotes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                schedulingNotes: e.target.value,
              }))
            }
            onBlur={() => handleBlur("schedulingNotes")}
            placeholder="Launch thread at 10am EST, coordinate with KOLs..."
            rows={4}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
