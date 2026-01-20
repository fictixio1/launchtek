import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  jsonb,
  primaryKey,
  date,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// =====================
// CORE TABLES
// =====================

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  stage: varchar("stage", { length: 20 }).notNull().default("idea"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  priority: varchar("priority", { length: 10 }).default("medium"),
  websiteUrl: varchar("website_url", { length: 500 }),
  xHandle: varchar("x_handle", { length: 100 }),
  telegramUrl: varchar("telegram_url", { length: 500 }),
  githubUrl: varchar("github_url", { length: 500 }),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 7 }).default("#6B7280"),
});

export const projectTags = pgTable(
  "project_tags",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tagId] }),
  })
);

// =====================
// IDEA SECTION
// =====================

export const projectIdeas = pgTable("project_ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  oneLiner: text("one_liner"),
  narrative: text("narrative"),
  whyExists: text("why_exists"),
  whyWins: text("why_wins"),
  targetAudience: text("target_audience"),
  comparableProjects: text("comparable_projects"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// BRANDING SECTION
// =====================

export const projectBranding = pgTable("project_branding", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  colorPalette: jsonb("color_palette").default([]).$type<string[]>(),
  primaryFont: varchar("primary_font", { length: 100 }),
  displayFont: varchar("display_font", { length: 100 }),
  vibeTags: jsonb("vibe_tags").default([]).$type<string[]>(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// WEBSITE SECTION
// =====================

export const projectWebsites = pgTable("project_websites", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  websiteUrl: varchar("website_url", { length: 500 }),
  repoUrl: varchar("repo_url", { length: 500 }),
  hostingNotes: text("hosting_notes"),
  landingPageDone: boolean("landing_page_done").default(false).notNull(),
  copyWritten: boolean("copy_written").default(false).notNull(),
  mobileChecked: boolean("mobile_checked").default(false).notNull(),
  analyticsAdded: boolean("analytics_added").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// X (TWITTER) SECTION
// =====================

export const projectX = pgTable("project_x", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  handle: varchar("handle", { length: 100 }),
  bio: text("bio"),
  pinnedTweetUrl: varchar("pinned_tweet_url", { length: 500 }),
  schedulingNotes: text("scheduling_notes"),
  bannerUploaded: boolean("banner_uploaded").default(false).notNull(),
  launchThreadDrafted: boolean("launch_thread_drafted").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const draftTweets = pgTable("draft_tweets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// LAUNCH SECTION
// =====================

export const projectLaunches = pgTable("project_launches", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  preLaunchNotes: text("pre_launch_notes"),
  tokenDeployed: boolean("token_deployed").default(false).notNull(),
  liquidityAdded: boolean("liquidity_added").default(false).notNull(),
  siteLive: boolean("site_live").default(false).notNull(),
  xLive: boolean("x_live").default(false).notNull(),
  tgLive: boolean("tg_live").default(false).notNull(),
  launchDate: date("launch_date"),
  chain: varchar("chain", { length: 20 }).default("SOL"),
  ticker: varchar("ticker", { length: 20 }),
  contractAddress: varchar("contract_address", { length: 100 }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// PNL TRACKING
// =====================

export const projectPnl = pgTable("project_pnl", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  initialSol: numeric("initial_sol", { precision: 20, scale: 9 })
    .default("0")
    .notNull(),
  currentValueSol: numeric("current_value_sol", { precision: 20, scale: 9 })
    .default("0")
    .notNull(),
  realizedSol: numeric("realized_sol", { precision: 20, scale: 9 }).default(
    "0"
  ),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// MEDIA / ASSETS
// =====================

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalFilename: varchar("original_filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  s3Key: varchar("s3_key", { length: 500 }).notNull(),
  s3Url: varchar("s3_url", { length: 1000 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  assetType: varchar("asset_type", { length: 50 }),
  status: varchar("status", { length: 20 }).default("draft"),
  usageTags: jsonb("usage_tags").default([]).$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const mediaTags = pgTable(
  "media_tags",
  {
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mediaId, table.tagId] }),
  })
);

// =====================
// TASKS / TO-DOS
// =====================

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 10 }).default("medium"),
  status: varchar("status", { length: 20 }).default("pending"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  isSystemTask: boolean("is_system_task").default(false).notNull(),
  systemTaskType: varchar("system_task_type", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// AI OUTPUTS (V2)
// =====================

export const aiOutputs = pgTable("ai_outputs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  promptType: varchar("prompt_type", { length: 50 }).notNull(),
  promptText: text("prompt_text").notNull(),
  responseText: text("response_text").notNull(),
  section: varchar("section", { length: 20 }).notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =====================
// RELATIONS
// =====================

export const projectsRelations = relations(projects, ({ one, many }) => ({
  idea: one(projectIdeas, {
    fields: [projects.id],
    references: [projectIdeas.projectId],
  }),
  branding: one(projectBranding, {
    fields: [projects.id],
    references: [projectBranding.projectId],
  }),
  website: one(projectWebsites, {
    fields: [projects.id],
    references: [projectWebsites.projectId],
  }),
  x: one(projectX, {
    fields: [projects.id],
    references: [projectX.projectId],
  }),
  launch: one(projectLaunches, {
    fields: [projects.id],
    references: [projectLaunches.projectId],
  }),
  pnl: one(projectPnl, {
    fields: [projects.id],
    references: [projectPnl.projectId],
  }),
  tasks: many(tasks),
  media: many(media),
  projectTags: many(projectTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  projectTags: many(projectTags),
  mediaTags: many(mediaTags),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectTags.tagId],
    references: [tags.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  project: one(projects, {
    fields: [media.projectId],
    references: [projects.id],
  }),
  mediaTags: many(mediaTags),
}));

export const mediaTagsRelations = relations(mediaTags, ({ one }) => ({
  media: one(media, {
    fields: [mediaTags.mediaId],
    references: [media.id],
  }),
  tag: one(tags, {
    fields: [mediaTags.tagId],
    references: [tags.id],
  }),
}));
