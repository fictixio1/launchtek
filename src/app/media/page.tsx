"use client";

import { useState } from "react";
import { Upload, Search, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Media functionality would be implemented with actual file upload
  // For MVP, this is a placeholder

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

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
          <Badge variant="secondary" className="cursor-pointer">
            All
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            PFP
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Banner
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Meme
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Promo
          </Badge>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center h-96 border border-dashed border-border rounded-lg">
        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No media yet
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Upload images from project branding tabs or directly here
        </p>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Grid placeholder - would show actual media */}
      {/* <div className="grid grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="aspect-square rounded-lg border">
            ...
          </div>
        ))}
      </div> */}
    </div>
  );
}
