"use client";

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Stage, Priority, STAGES, PRIORITIES } from "@/types";
import { getStageLabel } from "@/lib/utils";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; stage: Stage; priority: Priority }) => void;
  isLoading?: boolean;
}

export function NewProjectModal({
  open,
  onClose,
  onCreate,
  isLoading,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [stage, setStage] = useState<Stage>("idea");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), stage, priority });
    setName("");
    setStage("idea");
    setPriority("medium");
  };

  const handleClose = () => {
    setName("");
    setStage("idea");
    setPriority("medium");
    onClose();
  };

  const stageOptions = STAGES.map((s) => ({
    value: s,
    label: getStageLabel(s),
  }));

  const priorityOptions = PRIORITIES.map((p) => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
  }));

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader onClose={handleClose}>
          <ModalTitle>New Project</ModalTitle>
        </ModalHeader>

        <ModalContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Stage</label>
              <Select
                options={stageOptions}
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                options={priorityOptions}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim() || isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
