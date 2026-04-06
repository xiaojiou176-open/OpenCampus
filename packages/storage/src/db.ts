import Dexie, { type Table } from 'dexie';
import type { Announcement, Assignment, Course, Event, Grade, Message, Resource } from '@campus-copilot/schema';
import type {
  ChangeEvent,
  EntityState,
  LocalEntityOverlay,
  SyncRun,
  SyncState,
} from './contracts';

export class CampusCopilotDB extends Dexie {
  courses!: Table<Course, string>;
  resources!: Table<Resource, string>;
  assignments!: Table<Assignment, string>;
  announcements!: Table<Announcement, string>;
  grades!: Table<Grade, string>;
  messages!: Table<Message, string>;
  events!: Table<Event, string>;
  sync_state!: Table<SyncState, string>;
  entity_state!: Table<EntityState, string>;
  local_entity_overlay!: Table<LocalEntityOverlay, string>;
  sync_runs!: Table<SyncRun, string>;
  change_events!: Table<ChangeEvent, string>;

  constructor(name = 'campus-copilot') {
    super(name);
    this.version(1).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      sync_state: '&key, site, status, lastSyncedAt',
    });
    this.version(2).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      sync_state: '&key, site, status, lastSyncedAt',
    });
    this.version(3).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      sync_state: '&key, site, status, lastSyncedAt',
      entity_state: '&key, site, kind, firstSeenAt, lastSyncedAt, seenAt',
    });
    this.version(4).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      sync_state: '&key, site, status, lastSyncedAt, lastOutcome',
      entity_state: '&key, site, kind, firstSeenAt, lastSyncedAt, seenAt',
    });
    this.version(5).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      sync_state: '&key, site, status, lastSyncedAt, lastOutcome',
      entity_state: '&key, site, kind, firstSeenAt, lastSyncedAt, seenAt',
      local_entity_overlay: '&entityId, site, kind, updatedAt, pinnedAt, snoozeUntil, dismissUntil',
      sync_runs: '&id, site, completedAt, startedAt, outcome',
      change_events: '&id, runId, site, entityId, changeType, occurredAt',
    });
    this.version(6).stores({
      courses: '&id, site, title, code',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      alerts: null,
      sync_state: '&key, site, status, lastSyncedAt, lastOutcome',
      entity_state: '&key, site, kind, firstSeenAt, lastSyncedAt, seenAt',
      local_entity_overlay: '&entityId, site, kind, updatedAt, pinnedAt, snoozeUntil, dismissUntil',
      sync_runs: '&id, site, completedAt, startedAt, outcome',
      change_events: '&id, runId, site, entityId, changeType, occurredAt',
    });
    this.version(7).stores({
      courses: '&id, site, title, code',
      resources: '&id, site, courseId, releasedAt, resourceKind',
      assignments: '&id, site, courseId, dueAt, status',
      announcements: '&id, site, courseId, postedAt',
      grades: '&id, site, courseId, assignmentId, releasedAt, gradedAt',
      messages: '&id, site, courseId, createdAt, unread',
      events: '&id, site, eventKind, startAt, endAt',
      alerts: null,
      sync_state: '&key, site, status, lastSyncedAt, lastOutcome',
      entity_state: '&key, site, kind, firstSeenAt, lastSyncedAt, seenAt',
      local_entity_overlay: '&entityId, site, kind, updatedAt, pinnedAt, snoozeUntil, dismissUntil',
      sync_runs: '&id, site, completedAt, startedAt, outcome',
      change_events: '&id, runId, site, entityId, changeType, occurredAt',
    });
  }
}

export function createCampusCopilotDb(name?: string) {
  return new CampusCopilotDB(name);
}

export const campusCopilotDb = createCampusCopilotDb();
