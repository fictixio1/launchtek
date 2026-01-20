// Project stages in order
export const STAGES = ["idea", "branding", "website", "x", "launch"] as const;
export type Stage = (typeof STAGES)[number];

// Project status
export const PROJECT_STATUSES = ["active", "launched", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// Priority levels
export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

// Task status
export const TASK_STATUSES = ["pending", "completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// Media asset types
export const ASSET_TYPES = ["pfp", "banner", "meme", "promo", "other"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

// Media status
export const MEDIA_STATUSES = ["draft", "final"] as const;
export type MediaStatus = (typeof MEDIA_STATUSES)[number];

// PNL status
export const PNL_STATUSES = ["win", "loss", "breakeven"] as const;
export type PnlStatus = (typeof PNL_STATUSES)[number];

// Core interfaces
export interface Project {
  id: string;
  name: string;
  stage: Stage;
  status: ProjectStatus;
  priority: Priority;
  websiteUrl: string | null;
  xHandle: string | null;
  telegramUrl: string | null;
  githubUrl: string | null;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  tags?: Tag[];
  idea?: ProjectIdea;
  branding?: ProjectBranding;
  website?: ProjectWebsite;
  x?: ProjectX;
  launch?: ProjectLaunch;
  pnl?: ProjectPnl;
  tasks?: Task[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ProjectIdea {
  id: string;
  projectId: string;
  oneLiner: string | null;
  narrative: string | null;
  whyExists: string | null;
  whyWins: string | null;
  howItWorks: string | null;
  updatedAt: Date;
}

export interface ProjectBranding {
  id: string;
  projectId: string;
  colorPalette: string[];
  primaryFont: string | null;
  displayFont: string | null;
  vibeTags: string[];
  updatedAt: Date;
}

export interface ProjectWebsite {
  id: string;
  projectId: string;
  websiteUrl: string | null;
  repoUrl: string | null;
  hostingNotes: string | null;
  landingPageDone: boolean;
  copyWritten: boolean;
  mobileChecked: boolean;
  analyticsAdded: boolean;
  updatedAt: Date;
}

export interface ProjectX {
  id: string;
  projectId: string;
  handle: string | null;
  bio: string | null;
  pinnedTweetUrl: string | null;
  schedulingNotes: string | null;
  bannerUploaded: boolean;
  launchThreadDrafted: boolean;
  updatedAt: Date;
}

export interface DraftTweet {
  id: string;
  projectId: string;
  content: string;
  orderIndex: number;
  createdAt: Date;
}

export interface ProjectLaunch {
  id: string;
  projectId: string;
  preLaunchNotes: string | null;
  tokenDeployed: boolean;
  liquidityAdded: boolean;
  siteLive: boolean;
  xLive: boolean;
  tgLive: boolean;
  launchDate: Date | null;
  chain: string;
  ticker: string | null;
  contractAddress: string | null;
  updatedAt: Date;
}

export interface ProjectPnl {
  id: string;
  projectId: string;
  initialSol: string | number;
  currentValueSol: string | number;
  realizedSol: string | number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  projectId: string | null;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  width: number | null;
  height: number | null;
  assetType: AssetType | null;
  status: MediaStatus;
  usageTags: string[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date | null;
  completedAt: Date | null;
  isAiGenerated: boolean;
  isSystemTask: boolean;
  systemTaskType: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relation for display
  project?: Pick<Project, "id" | "name">;
}

// Dashboard stats
export interface GlobalPnlSummary {
  totalLaunched: number;
  wins: number;
  losses: number;
  breakeven: number;
  totalPnlSol: number;
  avgRoi: number;
}

// Project with completion percentage
export interface ProjectWithCompletion extends Project {
  completionPercentage: number;
  pendingTaskCount: number;
}

// Form types for creating/updating
export interface CreateProjectInput {
  name: string;
  stage?: Stage;
  priority?: Priority;
}

export interface UpdateProjectInput {
  name?: string;
  stage?: Stage;
  status?: ProjectStatus;
  priority?: Priority;
  websiteUrl?: string | null;
  xHandle?: string | null;
  telegramUrl?: string | null;
  githubUrl?: string | null;
}

export interface LaunchCompletionInput {
  initialSol: number;
  currentValueSol: number;
  realizedSol?: number;
  notes?: string;
  ticker: string;
  contractAddress?: string;
  chain?: string;
}
