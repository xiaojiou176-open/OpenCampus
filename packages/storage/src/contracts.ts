import { z } from 'zod';
import {
  RESOURCE_NAMES,
  SITE_SYNC_OUTCOMES,
  type SiteSyncOutcome,
} from '@campus-copilot/adapters-base';
import {
  AlertSchema,
  AnnouncementSchema,
  AssignmentSchema,
  EntityKindSchema,
  EntityRefSchema,
  EventSchema,
  FetchModeSchema,
  GradeSchema,
  TimelineEntrySchema,
  IsoDateTimeSchema,
  MessageSchema,
  PriorityReasonSchema,
  ResourceSchema,
  SiteSchema,
  type Course,
  type Assignment,
  type Announcement,
  type Grade,
  type Message,
  type Event,
  type Resource,
} from '@campus-copilot/schema';

export const SyncResourceFailureSchema = z
  .object({
    resource: z.enum(RESOURCE_NAMES),
    errorReason: z.string().min(1),
    attemptedModes: z.array(FetchModeSchema),
    attemptedCollectors: z.array(z.string().min(1)).default([]),
  })
  .strict();
export type SyncResourceFailure = z.infer<typeof SyncResourceFailureSchema>;

export const SyncStateSchema = z
  .object({
    key: z.string().min(1),
    site: SiteSchema,
    status: z.enum(['idle', 'syncing', 'success', 'error']),
    lastSyncedAt: IsoDateTimeSchema.optional(),
    lastOutcome: z.enum(SITE_SYNC_OUTCOMES).optional(),
    errorReason: z.string().min(1).optional(),
    resourceFailures: z.array(SyncResourceFailureSchema).optional(),
  })
  .strict();
export type SyncState = z.infer<typeof SyncStateSchema>;

export const EntityStateSchema = z
  .object({
    key: z.string().min(1),
    entityId: z.string().min(1),
    site: SiteSchema,
    kind: EntityKindSchema,
    firstSeenAt: IsoDateTimeSchema,
    lastSyncedAt: IsoDateTimeSchema,
    seenAt: IsoDateTimeSchema.optional(),
  })
  .strict();
export type EntityState = z.infer<typeof EntityStateSchema>;

export const LocalEntityOverlaySchema = z
  .object({
    entityId: z.string().min(1),
    site: SiteSchema,
    kind: EntityKindSchema,
    pinnedAt: IsoDateTimeSchema.optional(),
    snoozeUntil: IsoDateTimeSchema.optional(),
    dismissUntil: IsoDateTimeSchema.optional(),
    note: z.string().min(1).optional(),
    updatedAt: IsoDateTimeSchema,
  })
  .strict();
export type LocalEntityOverlay = z.infer<typeof LocalEntityOverlaySchema>;

export const LocalEntityOverlayFieldSchema = z.enum(['pinnedAt', 'snoozeUntil', 'dismissUntil', 'note']);
export type LocalEntityOverlayField = z.infer<typeof LocalEntityOverlayFieldSchema>;

export const LocalEntityOverlayInputSchema = z
  .object({
    entityId: z.string().min(1),
    site: SiteSchema,
    kind: EntityKindSchema,
    pinnedAt: IsoDateTimeSchema.nullish(),
    snoozeUntil: IsoDateTimeSchema.nullish(),
    dismissUntil: IsoDateTimeSchema.nullish(),
    note: z.string().optional().nullable(),
    updatedAt: IsoDateTimeSchema.optional(),
  })
  .strict();
export type LocalEntityOverlayInput = z.infer<typeof LocalEntityOverlayInputSchema>;

const SyncRunStatusSchema = z.enum(['success', 'error']);
export const SyncRunSchema = z
  .object({
    id: z.string().min(1),
    site: SiteSchema,
    startedAt: IsoDateTimeSchema,
    completedAt: IsoDateTimeSchema,
    status: SyncRunStatusSchema,
    outcome: z.enum(SITE_SYNC_OUTCOMES),
    changeCount: z.number().int().nonnegative(),
    errorReason: z.string().min(1).optional(),
    resourceFailures: z.array(SyncResourceFailureSchema).optional(),
  })
  .strict();
export type SyncRun = z.infer<typeof SyncRunSchema>;

export const ChangeEventTypeSchema = z.enum([
  'created',
  'removed',
  'status_changed',
  'due_changed',
  'grade_released',
  'message_unread',
  'sync_partial',
]);
export type ChangeEventType = z.infer<typeof ChangeEventTypeSchema>;

export const ChangeEventSchema = z
  .object({
    id: z.string().min(1),
    runId: z.string().min(1),
    site: SiteSchema,
    changeType: ChangeEventTypeSchema,
    occurredAt: IsoDateTimeSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    entityId: z.string().min(1).optional(),
    entityKind: EntityKindSchema.optional(),
    relatedEntity: EntityRefSchema.optional(),
    previousValue: z.string().min(1).optional(),
    nextValue: z.string().min(1).optional(),
  })
  .strict();
export type ChangeEvent = z.infer<typeof ChangeEventSchema>;

const FocusQueueItemKindSchema = z.union([EntityKindSchema, z.literal('sync_state')]);
export type FocusQueueItemKind = z.infer<typeof FocusQueueItemKindSchema>;

export const FocusQueueItemSchema = z
  .object({
    id: z.string().min(1),
    entityRef: EntityRefSchema.optional(),
    entity: EntityRefSchema.optional(),
    entityId: z.string().min(1).optional(),
    kind: FocusQueueItemKindSchema,
    site: SiteSchema,
    title: z.string().min(1),
    score: z.number(),
    reasons: z.array(PriorityReasonSchema),
    blockedBy: z.array(z.string().min(1)).default([]),
    dueAt: IsoDateTimeSchema.optional(),
    updatedAt: IsoDateTimeSchema.optional(),
    pinned: z.boolean().default(false),
    note: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
  })
  .strict();
export type FocusQueueItem = z.infer<typeof FocusQueueItemSchema>;

export const WeeklyLoadEntrySchema = z
  .object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startsAt: IsoDateTimeSchema,
    endsAt: IsoDateTimeSchema,
    assignmentCount: z.number().int().nonnegative(),
    eventCount: z.number().int().nonnegative().optional(),
    overdueCount: z.number().int().nonnegative(),
    dueSoonCount: z.number().int().nonnegative(),
    pinnedCount: z.number().int().nonnegative(),
    totalScore: z.number().nonnegative(),
    summary: z.string().min(1).optional(),
    highlights: z.array(z.string().min(1)).optional(),
    items: z.array(EntityRefSchema),
  })
  .strict();
export type WeeklyLoadEntry = z.infer<typeof WeeklyLoadEntrySchema>;

export const SiteEntityCountsSchema = z
  .object({
    site: SiteSchema,
    courses: z.number().int().nonnegative(),
    resources: z.number().int().nonnegative(),
    assignments: z.number().int().nonnegative(),
    announcements: z.number().int().nonnegative(),
    grades: z.number().int().nonnegative(),
    messages: z.number().int().nonnegative(),
    events: z.number().int().nonnegative(),
  })
  .strict();
export type SiteEntityCounts = z.infer<typeof SiteEntityCountsSchema>;

export const EntityCountsSchema = z
  .object({
    courses: z.number().int().nonnegative(),
    resources: z.number().int().nonnegative(),
    assignments: z.number().int().nonnegative(),
    announcements: z.number().int().nonnegative(),
    messages: z.number().int().nonnegative(),
    events: z.number().int().nonnegative(),
  })
  .strict();
export type EntityCounts = z.infer<typeof EntityCountsSchema>;

export const TodaySnapshotSchema = z
  .object({
    totalAssignments: z.number().int().nonnegative(),
    dueSoonAssignments: z.number().int().nonnegative(),
    recentUpdates: z.number().int().nonnegative(),
    newGrades: z.number().int().nonnegative(),
    riskAlerts: z.number().int().nonnegative(),
    syncedSites: z.number().int().nonnegative(),
  })
  .strict();
export type TodaySnapshot = z.infer<typeof TodaySnapshotSchema>;

export const RecentUpdatesFeedSchema = z
  .object({
    items: z.array(TimelineEntrySchema),
    unseenCount: z.number().int().nonnegative(),
  })
  .strict();
export type RecentUpdatesFeed = z.infer<typeof RecentUpdatesFeedSchema>;

export const WorkbenchFilterSchema = z
  .object({
    site: z.union([SiteSchema, z.literal('all')]).default('all'),
    onlyUnseenUpdates: z.boolean().default(false),
  })
  .strict();
export type WorkbenchFilter = z.infer<typeof WorkbenchFilterSchema>;

export const WorkbenchViewSchema = z
  .object({
    filters: WorkbenchFilterSchema,
    resources: z.array(ResourceSchema),
    assignments: z.array(AssignmentSchema),
    announcements: z.array(AnnouncementSchema),
    messages: z.array(MessageSchema),
    grades: z.array(GradeSchema),
    events: z.array(EventSchema),
    alerts: z.array(AlertSchema),
    recentUpdates: RecentUpdatesFeedSchema,
  })
  .strict();
export type WorkbenchView = z.infer<typeof WorkbenchViewSchema>;

export type SiteSnapshotRecords = {
  courses: Course[];
  resources: Resource[];
  assignments: Assignment[];
  announcements: Announcement[];
  grades: Grade[];
  messages: Message[];
  events: Event[];
};

export interface SiteSnapshotPayload {
  courses?: Course[];
  resources?: Resource[];
  assignments?: Assignment[];
  announcements?: Announcement[];
  grades?: Grade[];
  messages?: Message[];
  events?: Event[];
}

export interface ApplySiteSnapshotWithLedgerOptions {
  startedAt?: string;
  runId?: string;
}

export type FailedSiteSyncOutcome = Exclude<SiteSyncOutcome, 'success' | 'partial_success'>;
