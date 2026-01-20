"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Image as ImageIcon, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/lib/uploadthing";

interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  s3Url: string;
  assetType: string | null;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  } | null;
}

const ASSET_TYPES = ["All", "PFP", "Banner", "Meme", "Promo", "Other"];

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const queryClient = useQueryClient();

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
  });

  const createMedia = useMutation({
    mutationFn: async (data: { url: string; name: string; size: number }) => {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create media");
      return res.json();
    },
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.filename
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All" || item.assetType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media Library</h1>
      </div>

      {/* Upload Dropzone */}
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            res.forEach((file) => {
              createMedia.mutate({
                url: file.url,
                name: file.name,
                size: file.size,
              });
            });
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
        className="border-2 border-dashed border-border rounded-lg p-8 ut-uploading:cursor-not-allowed"
      />

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {ASSET_TYPES.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No media yet
          </p>
          <p className="text-sm text-muted-foreground">
            Upload images using the dropzone above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.s3Url}
                alt={item.filename}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => window.open(item.s3Url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20"
                    onClick={() => {
                      if (confirm("Delete this image?")) {
                        deleteMedia.mutate(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="text-white text-sm truncate">{item.filename}</p>
                  {item.project && (
                    <p className="text-white/70 text-xs">{item.project.name}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
