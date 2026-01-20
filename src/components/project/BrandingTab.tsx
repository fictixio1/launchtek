"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectBranding } from "@/types";

interface BrandingTabProps {
  project: Project;
  onUpdate: (updates: Partial<ProjectBranding>) => void;
  disabled?: boolean;
}

export function BrandingTab({ project, onUpdate, disabled }: BrandingTabProps) {
  const branding = project.branding;

  const [colorPalette, setColorPalette] = useState<string[]>(
    branding?.colorPalette ?? []
  );
  const [newColor, setNewColor] = useState("#000000");
  const [primaryFont, setPrimaryFont] = useState(branding?.primaryFont ?? "");
  const [displayFont, setDisplayFont] = useState(branding?.displayFont ?? "");
  const [vibeTags, setVibeTags] = useState<string[]>(branding?.vibeTags ?? []);
  const [newVibeTag, setNewVibeTag] = useState("");

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
          <div className="aspect-square max-w-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Upload PFP
            </span>
            <span className="text-xs text-muted-foreground">512×512 min</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Square image for X profile and token logo
          </p>
        </div>

        {/* Banner */}
        <div className="space-y-3">
          <label className="text-sm font-medium">X Banner</label>
          <div className="aspect-[3/1] max-w-[400px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Upload Banner
            </span>
            <span className="text-xs text-muted-foreground">1500×500</span>
          </div>
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
          {/* Placeholder for uploaded media */}
          <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Memes, promo images, additional assets
        </p>
      </div>
    </div>
  );
}
