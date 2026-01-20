"use client";

import { useState, useEffect } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectBranding } from "@/types";
import { UploadButton } from "@/lib/uploadthing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface BrandingTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectBranding>) => void;
  disabled?: boolean;
}

interface MediaItem {
  id: string;
  s3Url: string;
  assetType: string | null;
  filename: string;
}

export function BrandingTab({ project, onUpdate, disabled }: BrandingTabProps) {
  const branding = project.branding;
  const queryClient = useQueryClient();

  const [colorPalette, setColorPalette] = useState<string[]>(
    branding?.colorPalette ?? []
  );
  const [newColor, setNewColor] = useState("#000000");
  const [primaryFont, setPrimaryFont] = useState(branding?.primaryFont ?? "");
  const [displayFont, setDisplayFont] = useState(branding?.displayFont ?? "");
  const [vibeTags, setVibeTags] = useState<string[]>(branding?.vibeTags ?? []);
  const [newVibeTag, setNewVibeTag] = useState("");

  // Fetch media for this project
  const { data: projectMedia = [] } = useQuery<MediaItem[]>({
    queryKey: ["media", project.id],
    queryFn: async () => {
      const res = await fetch(`/api/media?projectId=${project.id}`);
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
  });

  const pfpMedia = projectMedia.find((m) => m.assetType === "PFP");
  const bannerMedia = projectMedia.find((m) => m.assetType === "Banner");
  const additionalMedia = projectMedia.filter(
    (m) => m.assetType !== "PFP" && m.assetType !== "Banner"
  );

  const createMedia = useMutation({
    mutationFn: async (data: {
      url: string;
      name: string;
      size: number;
      assetType: string;
    }) => {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, projectId: project.id }),
      });
      if (!res.ok) throw new Error("Failed to create media");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", project.id] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete media");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", project.id] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  useEffect(() => {
    setColorPalette(branding?.colorPalette ?? []);
    setPrimaryFont(branding?.primaryFont ?? "");
    setDisplayFont(branding?.displayFont ?? "");
    setVibeTags(branding?.vibeTags ?? []);
  }, [branding]);

  const handleAddColor = () => {
    if (newColor && !colorPalette.includes(newColor)) {
      const updated = [...colorPalette, newColor];
      setColorPalette(updated);
      onUpdate({ colorPalette: updated });
    }
  };

  const handleRemoveColor = (color: string) => {
    const updated = colorPalette.filter((c) => c !== color);
    setColorPalette(updated);
    onUpdate({ colorPalette: updated });
  };

  const handleAddVibeTag = () => {
    const tag = newVibeTag.trim().toLowerCase();
    if (tag && !vibeTags.includes(tag)) {
      const updated = [...vibeTags, tag];
      setVibeTags(updated);
      setNewVibeTag("");
      onUpdate({ vibeTags: updated });
    }
  };

  const handleRemoveVibeTag = (tag: string) => {
    const updated = vibeTags.filter((t) => t !== tag);
    setVibeTags(updated);
    onUpdate({ vibeTags: updated });
  };

  const handleFontBlur = (field: "primaryFont" | "displayFont") => {
    const value = field === "primaryFont" ? primaryFont : displayFont;
    if (value !== (branding?.[field] ?? "")) {
      onUpdate({ [field]: value || null });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Image Uploads */}
      <div className="grid grid-cols-2 gap-6">
        {/* PFP */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Token / X PFP</label>
          {pfpMedia ? (
            <div className="relative aspect-square max-w-[200px] rounded-lg overflow-hidden border border-border group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pfpMedia.s3Url}
                alt="PFP"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteMedia.mutate(pfpMedia.id)}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          ) : (
            <div className="max-w-[200px]">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    createMedia.mutate({
                      url: res[0].url,
                      name: res[0].name,
                      size: res[0].size,
                      assetType: "PFP",
                    });
                  }
                }}
                onUploadError={(error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  button:
                    "ut-ready:bg-muted ut-ready:text-foreground ut-uploading:cursor-not-allowed ut-uploading:bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 w-full aspect-square rounded-lg",
                  allowedContent: "hidden",
                }}
                content={{
                  button: (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Upload PFP
                      </span>
                      <span className="text-xs text-muted-foreground">
                        512×512 min
                      </span>
                    </div>
                  ),
                }}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Square image for X profile and token logo
          </p>
        </div>

        {/* Banner */}
        <div className="space-y-3">
          <label className="text-sm font-medium">X Banner</label>
          {bannerMedia ? (
            <div className="relative aspect-[3/1] max-w-[400px] rounded-lg overflow-hidden border border-border group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerMedia.s3Url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteMedia.mutate(bannerMedia.id)}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          ) : (
            <div className="max-w-[400px]">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    createMedia.mutate({
                      url: res[0].url,
                      name: res[0].name,
                      size: res[0].size,
                      assetType: "Banner",
                    });
                  }
                }}
                onUploadError={(error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  button:
                    "ut-ready:bg-muted ut-ready:text-foreground ut-uploading:cursor-not-allowed ut-uploading:bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 w-full aspect-[3/1] rounded-lg",
                  allowedContent: "hidden",
                }}
                content={{
                  button: (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Upload Banner
                      </span>
                      <span className="text-xs text-muted-foreground">
                        1500×500
                      </span>
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Color Palette</label>
        <div className="flex items-center gap-2 flex-wrap">
          {colorPalette.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1 bg-muted rounded-md px-2 py-1"
            >
              <div
                className="w-5 h-5 rounded border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs mono">{color}</span>
              {!disabled && (
                <button
                  onClick={() => handleRemoveColor(color)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          {!disabled && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddColor}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Fonts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Font</label>
          <Input
            value={primaryFont}
            onChange={(e) => setPrimaryFont(e.target.value)}
            onBlur={() => handleFontBlur("primaryFont")}
            placeholder="e.g., Inter, Roboto"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Font</label>
          <Input
            value={displayFont}
            onChange={(e) => setDisplayFont(e.target.value)}
            onBlur={() => handleFontBlur("displayFont")}
            placeholder="e.g., Space Grotesk"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Vibe Tags */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Vibe Tags</label>
        <div className="flex items-center gap-2 flex-wrap">
          {vibeTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              {!disabled && (
                <button
                  onClick={() => handleRemoveVibeTag(tag)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          {!disabled && (
            <div className="flex items-center gap-2">
              <Input
                value={newVibeTag}
                onChange={(e) => setNewVibeTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddVibeTag();
                  }
                }}
                placeholder="Add vibe..."
                className="w-32 h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddVibeTag}
              >
                Add
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Mood descriptors: minimal, bold, playful, edgy, clean, etc.
        </p>
      </div>

      {/* Additional Media */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Additional Media</label>
        <div className="grid grid-cols-4 gap-3">
          {additionalMedia.map((media) => (
            <div
              key={media.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.s3Url}
                alt={media.filename}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteMedia.mutate(media.id)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-red-400" />
              </button>
            </div>
          ))}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                res.forEach((file) => {
                  createMedia.mutate({
                    url: file.url,
                    name: file.name,
                    size: file.size,
                    assetType: "Other",
                  });
                });
              }
            }}
            onUploadError={(error) => {
              alert(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button:
                "ut-ready:bg-transparent ut-uploading:cursor-not-allowed border-2 border-dashed border-border hover:border-primary/50 w-full aspect-square rounded-lg",
              allowedContent: "hidden",
            }}
            content={{
              button: <Upload className="h-6 w-6 text-muted-foreground" />,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Memes, promo images, additional assets
        </p>
      </div>
    </div>
  );
}
