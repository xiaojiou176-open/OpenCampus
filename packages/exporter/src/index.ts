import {
  AlertSchema,
  AnnouncementSchema,
  AssignmentSchema,
  EventSchema,
  GradeSchema,
  IsoDateTimeSchema,
  MessageSchema,
  ResourceSchema,
  TimelineEntrySchema,
  type Alert,
  type Announcement,
  type Assignment,
  type Event,
  type Grade,
  type Message,
  type Resource,
  type TimelineEntry,
} from '@campus-copilot/schema';

export type ExportPreset =
  | 'weekly_assignments'
  | 'recent_updates'
  | 'all_deadlines'
  | 'current_view'
  | 'focus_queue'
  | 'weekly_load'
  | 'change_journal';
export type ExportFormat = 'json' | 'csv' | 'markdown' | 'ics';

export interface FocusQueueExportItem {
  id: string;
  kind: string;
  site: string;
  title: string;
  score: number;
  summary?: string;
  pinned?: boolean;
  note?: string;
  dueAt?: string;
  updatedAt?: string;
  entityId?: string;
  entity?: {
    id: string;
    kind: string;
    site: string;
  };
  entityRef?: {
    id: string;
    kind: string;
    site: string;
  };
  reasons: Array<{
    code: string;
    label: string;
    importance: string;
    detail?: string;
  }>;
  blockedBy?: string[];
}

export interface WeeklyLoadExportEntry {
  dateKey: string;
  startsAt: string;
  endsAt: string;
  assignmentCount: number;
  eventCount?: number;
  overdueCount?: number;
  dueSoonCount?: number;
  pinnedCount?: number;
  totalScore?: number;
  summary?: string;
  highlights?: string[];
}

export interface SyncRunExportEntry {
  id?: string;
  site: string;
  status: string;
  outcome: string;
  startedAt: string;
  completedAt: string;
  changeCount: number;
  errorReason?: string;
  resourceFailures?: Array<{
    resource: string;
    errorReason?: string;
  }>;
}

export interface ChangeEventExportEntry {
  id?: string;
  site: string;
  changeType: string;
  occurredAt: string;
  title: string;
  summary: string;
  entityId?: string;
  previousValue?: string;
  nextValue?: string;
}

export interface ExportInput {
  generatedAt: string;
  viewTitle?: string;
  resources?: Resource[];
  assignments?: Assignment[];
  announcements?: Announcement[];
  messages?: Message[];
  grades?: Grade[];
  events?: Event[];
  alerts?: Alert[];
  timelineEntries?: TimelineEntry[];
  focusQueue?: FocusQueueExportItem[];
  weeklyLoad?: WeeklyLoadExportEntry[];
  syncRuns?: SyncRunExportEntry[];
  changeEvents?: ChangeEventExportEntry[];
}

export interface ExportArtifact {
  preset: ExportPreset;
  format: ExportFormat;
  filename: string;
  mimeType: string;
  content: string;
}

interface NormalizedExportInput {
  generatedAt: string;
  viewTitle?: string;
  resources: Resource[];
  assignments: Assignment[];
  announcements: Announcement[];
  messages: Message[];
  grades: Grade[];
  events: Event[];
  alerts: Alert[];
  timelineEntries: TimelineEntry[];
  focusQueue: FocusQueueExportItem[];
  weeklyLoad: WeeklyLoadExportEntry[];
  syncRuns: SyncRunExportEntry[];
  changeEvents: ChangeEventExportEntry[];
}

interface ExportDataset extends NormalizedExportInput {
  title: string;
}

interface CsvRow {
  kind: string;
  site: string;
  title: string;
  courseId: string;
  assignmentId: string;
  status: string;
  occurredAt: string;
  dueAt: string;
  startAt: string;
  endAt: string;
  score: string;
  maxScore: string;
  importance: string;
  dateKey: string;
  reasons: string;
  blockedBy: string;
  outcome: string;
  changeCount: string;
  summary: string;
  detail: string;
  url: string;
}

const MIME_TYPES: Record<ExportFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  markdown: 'text/markdown',
  ics: 'text/calendar',
};

const PRESET_LABELS: Record<ExportPreset, string> = {
  weekly_assignments: 'weekly-assignments',
  recent_updates: 'recent-updates',
  all_deadlines: 'all-deadlines',
  current_view: 'current-view',
  focus_queue: 'focus-queue',
  weekly_load: 'weekly-load',
  change_journal: 'change-journal',
};

function normalizeInput(input: ExportInput): NormalizedExportInput {
  const generatedAt = IsoDateTimeSchema.parse(input.generatedAt);
  return {
    generatedAt,
    viewTitle: input.viewTitle,
    resources: (input.resources ?? []).map((record) => ResourceSchema.parse(record)),
    assignments: (input.assignments ?? []).map((record) => AssignmentSchema.parse(record)),
    announcements: (input.announcements ?? []).map((record) => AnnouncementSchema.parse(record)),
    messages: (input.messages ?? []).map((record) => MessageSchema.parse(record)),
    grades: (input.grades ?? []).map((record) => GradeSchema.parse(record)),
    events: (input.events ?? []).map((record) => EventSchema.parse(record)),
    alerts: (input.alerts ?? []).map((record) => AlertSchema.parse(record)),
    timelineEntries: (input.timelineEntries ?? []).map((record) => TimelineEntrySchema.parse(record)),
    focusQueue: [...(input.focusQueue ?? [])],
    weeklyLoad: [...(input.weeklyLoad ?? [])],
    syncRuns: [...(input.syncRuns ?? [])],
    changeEvents: [...(input.changeEvents ?? [])],
  };
}

function addDays(isoString: string, days: number) {
  const date = new Date(isoString);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function isWithinWindow(target: string | undefined, start: string, end: string) {
  if (!target) {
    return false;
  }
  const value = new Date(target).getTime();
  return value >= new Date(start).getTime() && value <= new Date(end).getTime();
}

function buildPresetDataset(preset: ExportPreset, input: NormalizedExportInput): ExportDataset {
  const weekEnd = addDays(input.generatedAt, 7);
  const recentStart = addDays(input.generatedAt, -7);

  switch (preset) {
    case 'weekly_assignments':
      return {
        ...input,
        title: 'Weekly assignments',
        assignments: input.assignments.filter((assignment) => {
          return (
            isWithinWindow(assignment.dueAt, input.generatedAt, weekEnd) ||
            assignment.status === 'missing' ||
            assignment.status === 'overdue'
          );
        }),
        announcements: [],
        messages: [],
        grades: [],
        events: [],
        alerts: [],
        timelineEntries: [],
        focusQueue: [],
        weeklyLoad: [],
        syncRuns: [],
        changeEvents: [],
      };
    case 'recent_updates':
      return {
        ...input,
        title: 'Recent updates',
        assignments: [],
        announcements: input.announcements.filter((item) => isWithinWindow(item.postedAt, recentStart, input.generatedAt)),
        messages: input.messages.filter((item) => isWithinWindow(item.createdAt, recentStart, input.generatedAt)),
        grades: input.grades.filter((item) => isWithinWindow(item.releasedAt ?? item.gradedAt, recentStart, input.generatedAt)),
        events: [],
        alerts: input.alerts.filter((item) => isWithinWindow(item.triggeredAt, recentStart, input.generatedAt)),
        timelineEntries: input.timelineEntries.filter((item) => isWithinWindow(item.occurredAt, recentStart, input.generatedAt)),
        focusQueue: [],
        weeklyLoad: [],
        syncRuns: [],
        changeEvents: [],
      };
    case 'all_deadlines':
      return {
        ...input,
        title: 'All deadlines',
        assignments: input.assignments.filter((item) => Boolean(item.dueAt)),
        announcements: [],
        messages: [],
        grades: [],
        events: input.events.filter((item) => item.eventKind === 'deadline' || Boolean(item.startAt) || Boolean(item.endAt)),
        alerts: [],
        timelineEntries: [],
        focusQueue: [],
        weeklyLoad: [],
        syncRuns: [],
        changeEvents: [],
      };
    case 'focus_queue':
      return {
        ...input,
        title: 'Focus queue',
        assignments: [],
        announcements: [],
        messages: [],
        grades: [],
        events: [],
        alerts: [],
        timelineEntries: [],
        focusQueue: input.focusQueue,
        weeklyLoad: [],
        syncRuns: [],
        changeEvents: [],
      };
    case 'weekly_load':
      return {
        ...input,
        title: 'Weekly load',
        assignments: [],
        announcements: [],
        messages: [],
        grades: [],
        events: [],
        alerts: [],
        timelineEntries: [],
        focusQueue: [],
        syncRuns: [],
        changeEvents: [],
      };
    case 'change_journal':
      return {
        ...input,
        title: 'Change journal',
        assignments: [],
        announcements: [],
        messages: [],
        grades: [],
        events: [],
        alerts: [],
        timelineEntries: [],
        focusQueue: [],
        weeklyLoad: [],
      };
    case 'current_view':
    default:
      return {
        ...input,
        title: input.viewTitle ?? 'Current view',
      };
  }
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function formatOptionalNumber(value: number | undefined) {
  return value === undefined ? '' : String(value);
}

function formatOptionalString(value: string | undefined) {
  return value ?? '';
}

function buildCsvRows(dataset: ExportDataset): CsvRow[] {
  const rows: CsvRow[] = [];

  for (const resource of dataset.resources) {
    rows.push({
      kind: resource.kind,
      site: resource.site,
      title: resource.title,
      courseId: formatOptionalString(resource.courseId),
      assignmentId: '',
      status: resource.resourceKind,
      occurredAt: formatOptionalString(resource.releasedAt ?? resource.updatedAt ?? resource.createdAt),
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: formatOptionalString(resource.summary),
      detail: formatOptionalString(resource.detail),
      url: formatOptionalString(resource.url),
    });
  }

  for (const assignment of dataset.assignments) {
    rows.push({
      kind: assignment.kind,
      site: assignment.site,
      title: assignment.title,
      courseId: formatOptionalString(assignment.courseId),
      assignmentId: assignment.id,
      status: assignment.status,
      occurredAt: '',
      dueAt: formatOptionalString(assignment.dueAt),
      startAt: '',
      endAt: '',
      score: formatOptionalNumber(assignment.score),
      maxScore: formatOptionalNumber(assignment.maxScore),
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: formatOptionalString(assignment.summary),
      detail: formatOptionalString(assignment.detail),
      url: formatOptionalString(assignment.url),
    });
  }

  for (const announcement of dataset.announcements) {
    rows.push({
      kind: announcement.kind,
      site: announcement.site,
      title: announcement.title,
      courseId: formatOptionalString(announcement.courseId),
      assignmentId: '',
      status: '',
      occurredAt: formatOptionalString(announcement.postedAt),
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: formatOptionalString(announcement.summary),
      detail: '',
      url: formatOptionalString(announcement.url),
    });
  }

  for (const message of dataset.messages) {
    rows.push({
      kind: message.kind,
      site: message.site,
      title: formatOptionalString(message.title),
      courseId: formatOptionalString(message.courseId),
      assignmentId: '',
      status: message.unread ? 'unread' : '',
      occurredAt: formatOptionalString(message.createdAt),
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: [message.messageKind, message.category, message.subcategory, message.summary].filter(Boolean).join(' · '),
      detail: '',
      url: formatOptionalString(message.url),
    });
  }

  for (const grade of dataset.grades) {
    rows.push({
      kind: grade.kind,
      site: grade.site,
      title: grade.title,
      courseId: formatOptionalString(grade.courseId),
      assignmentId: formatOptionalString(grade.assignmentId),
      status: '',
      occurredAt: formatOptionalString(grade.releasedAt ?? grade.gradedAt),
      dueAt: '',
      startAt: '',
      endAt: '',
      score: formatOptionalNumber(grade.score),
      maxScore: formatOptionalNumber(grade.maxScore),
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: '',
      detail: '',
      url: formatOptionalString(grade.url),
    });
  }

  for (const event of dataset.events) {
    rows.push({
      kind: event.kind,
      site: event.site,
      title: event.title,
      courseId: '',
      assignmentId: formatOptionalString(event.relatedAssignmentId),
      status: event.eventKind,
      occurredAt: '',
      dueAt: '',
      startAt: formatOptionalString(event.startAt),
      endAt: formatOptionalString(event.endAt),
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: formatOptionalString(event.summary ?? event.location),
      detail: formatOptionalString(event.detail),
      url: formatOptionalString(event.url),
    });
  }

  for (const alert of dataset.alerts) {
    rows.push({
      kind: alert.kind,
      site: alert.site,
      title: alert.title,
      courseId: '',
      assignmentId: '',
      status: alert.alertKind,
      occurredAt: formatOptionalString(alert.triggeredAt),
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: alert.importance,
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: alert.summary,
      detail: '',
      url: formatOptionalString(alert.url),
    });
  }

  for (const entry of dataset.timelineEntries) {
    rows.push({
      kind: entry.kind,
      site: entry.site,
      title: entry.title,
      courseId: '',
      assignmentId: '',
      status: entry.timelineKind,
      occurredAt: entry.occurredAt,
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: formatOptionalString(entry.summary),
      detail: '',
      url: formatOptionalString(entry.url),
    });
  }

  for (const item of dataset.focusQueue) {
    rows.push({
      kind: 'focus_item',
      site: item.site,
      title: item.title,
      courseId: '',
      assignmentId: item.entity?.id ?? item.entityRef?.id ?? item.entityId ?? '',
      status: item.pinned ? 'pinned' : '',
      occurredAt: '',
      dueAt: formatOptionalString(item.dueAt),
      startAt: '',
      endAt: '',
      score: String(item.score),
      maxScore: '',
      importance: item.reasons[0]?.importance ?? '',
      dateKey: '',
      reasons: item.reasons
        .map((reason) => (reason.detail ? `${reason.label}: ${reason.detail}` : reason.label))
        .join(' | '),
      blockedBy: (item.blockedBy ?? []).join(' | '),
      outcome: '',
      changeCount: '',
      summary: item.summary ?? item.note ?? '',
      detail: '',
      url: '',
    });
  }

  for (const entry of dataset.weeklyLoad) {
    rows.push({
      kind: 'weekly_load',
      site: '',
      title: `Load for ${entry.dateKey}`,
      courseId: '',
      assignmentId: '',
      status: '',
      occurredAt: '',
      dueAt: '',
      startAt: entry.startsAt,
      endAt: entry.endsAt,
      score: formatOptionalNumber(entry.totalScore),
      maxScore: '',
      importance: '',
      dateKey: entry.dateKey,
      reasons: (entry.highlights ?? []).join(' | '),
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary:
        entry.summary ??
        `assignments=${entry.assignmentCount}, events=${entry.eventCount ?? 0}, overdue=${entry.overdueCount ?? 0}`,
      detail: '',
      url: '',
    });
  }

  for (const run of dataset.syncRuns) {
    rows.push({
      kind: 'sync_run',
      site: run.site,
      title: `${run.site} sync`,
      courseId: '',
      assignmentId: '',
      status: run.status,
      occurredAt: run.completedAt,
      dueAt: '',
      startAt: run.startedAt,
      endAt: run.completedAt,
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: run.outcome,
      changeCount: String(run.changeCount),
      summary: run.errorReason ?? '',
      detail: '',
      url: '',
    });
  }

  for (const event of dataset.changeEvents) {
    rows.push({
      kind: 'change_event',
      site: event.site,
      title: event.title,
      courseId: '',
      assignmentId: event.entityId ?? '',
      status: event.changeType,
      occurredAt: event.occurredAt,
      dueAt: '',
      startAt: '',
      endAt: '',
      score: '',
      maxScore: '',
      importance: '',
      dateKey: '',
      reasons: '',
      blockedBy: '',
      outcome: '',
      changeCount: '',
      summary: event.summary,
      detail: '',
      url: '',
    });
  }

  return rows;
}

function renderJson(dataset: ExportDataset) {
  return JSON.stringify(
    {
      title: dataset.title,
      generatedAt: dataset.generatedAt,
      counts: {
        assignments: dataset.assignments.length,
        announcements: dataset.announcements.length,
        messages: dataset.messages.length,
        grades: dataset.grades.length,
        events: dataset.events.length,
        alerts: dataset.alerts.length,
        timelineEntries: dataset.timelineEntries.length,
        focusQueue: dataset.focusQueue.length,
        weeklyLoad: dataset.weeklyLoad.length,
        syncRuns: dataset.syncRuns.length,
        changeEvents: dataset.changeEvents.length,
      },
      data: dataset,
    },
    null,
    2,
  );
}

function renderCsv(dataset: ExportDataset) {
  const rows = buildCsvRows(dataset);
  const headers: (keyof CsvRow)[] = [
    'kind',
    'site',
    'title',
    'courseId',
    'assignmentId',
    'status',
    'occurredAt',
    'dueAt',
    'startAt',
    'endAt',
    'score',
    'maxScore',
    'importance',
    'dateKey',
    'reasons',
    'blockedBy',
    'outcome',
    'changeCount',
    'summary',
    'detail',
    'url',
  ];
  const lines = [headers.join(',')];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvCell(row[header])).join(','));
  }

  return lines.join('\n');
}

function renderMarkdownSection(title: string, lines: string[]) {
  if (lines.length === 0) {
    return '';
  }
  return `## ${title}\n${lines.join('\n')}\n`;
}

function renderMarkdown(dataset: ExportDataset) {
  const sections: string[] = [];

  sections.push(`# ${dataset.title}`);
  sections.push('');
  sections.push(`Generated at: ${dataset.generatedAt}`);
  sections.push('');

  sections.push(
    renderMarkdownSection(
      'Resources',
      dataset.resources.map((resource) => {
        const releasedAt = resource.releasedAt ? ` - released ${resource.releasedAt}` : '';
        const summary = resource.summary ? ` - ${resource.summary}` : '';
        const detail = resource.detail ? ` - detail ${resource.detail}` : '';
        const kind = ` - kind ${resource.resourceKind}`;
        return `- ${resource.title} (${resource.site})${kind}${releasedAt}${summary}${detail}`;
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Assignments',
      dataset.assignments.map((assignment) => {
        const detail = assignment.dueAt ? ` - due ${assignment.dueAt}` : '';
        const summary = assignment.summary ? ` - ${assignment.summary}` : '';
        const fullDetail = assignment.detail ? ` - detail ${assignment.detail}` : '';
        const score = assignment.score !== undefined || assignment.maxScore !== undefined ? ` - score ${assignment.score ?? '-'} / ${assignment.maxScore ?? '-'}` : '';
        return `- ${assignment.title} (${assignment.site}, ${assignment.status})${detail}${score}${summary}${fullDetail}`;
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Recent Updates',
      [
        ...dataset.announcements.map((item) => {
          const summary = item.summary ? ` - ${item.summary}` : '';
          return `- Announcement: ${item.title} (${item.site})${summary}`;
        }),
        ...dataset.messages.map((item) => {
          const summary = item.summary ? ` - ${item.summary}` : '';
          return `- Message: ${item.title ?? item.messageKind} (${item.site})${summary}`;
        }),
        ...dataset.grades.map((item) => `- Grade: ${item.title} (${item.score ?? '-'} / ${item.maxScore ?? '-'})`),
      ],
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Events',
      dataset.events.map((event) => {
        const when = `${event.startAt ?? event.endAt ?? ''}`.trim();
        const location = event.location ? ` - ${event.location}` : '';
        const detail = event.detail ? ` - ${event.detail}` : event.summary ? ` - ${event.summary}` : '';
        return `- ${event.title} (${event.eventKind}) ${when}${location}${detail}`.trim();
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Alerts',
      dataset.alerts.map((alert) => `- ${alert.title} [${alert.importance}] - ${alert.summary}`),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Timeline',
      dataset.timelineEntries.map((entry) => `- ${entry.occurredAt}: ${entry.title} (${entry.timelineKind})`),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Focus Queue',
      dataset.focusQueue.map((item) => {
        const reasons = item.reasons
          .map((reason) => (reason.detail ? `${reason.label}: ${reason.detail}` : reason.label))
          .join(', ');
        const summary = item.summary ? ` - ${item.summary}` : '';
        const note = item.note ? ` - note: ${item.note}` : '';
        const blocked = item.blockedBy?.length ? ` - blocked by: ${item.blockedBy.join(' / ')}` : '';
        return `- ${item.title} (${item.site}, score ${item.score})${summary} - ${reasons}${note}${blocked}`;
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Weekly Load',
      dataset.weeklyLoad.map((entry) => {
        const summary = entry.summary ? ` - ${entry.summary}` : '';
        return `- ${entry.dateKey}: assignments=${entry.assignmentCount}, events=${entry.eventCount ?? 0}, dueSoon=${entry.dueSoonCount ?? 0}, overdue=${entry.overdueCount ?? 0}, pinned=${entry.pinnedCount ?? 0}, totalScore=${entry.totalScore ?? 0}${summary}`;
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Sync Runs',
      dataset.syncRuns.map((run) => {
        const gaps = Array.isArray(run.resourceFailures)
          ? ` - gaps: ${run.resourceFailures.map((item) => item.resource).join(' / ')}`
          : '';
        const suffix = run.errorReason ? ` - ${run.errorReason}` : gaps;
        return `- ${run.completedAt}: ${run.site} ${run.outcome} (${run.changeCount} changes)${suffix}`;
      }),
    ),
  );

  sections.push(
    renderMarkdownSection(
      'Change Events',
      dataset.changeEvents.map((event) => {
        const valueDelta =
          event.previousValue || event.nextValue
            ? ` [${event.previousValue ?? 'empty'} -> ${event.nextValue ?? 'empty'}]`
            : '';
        return `- ${event.occurredAt}: ${event.title} (${event.changeType}) - ${event.summary}${valueDelta}`;
      }),
    ),
  );

  return sections.filter(Boolean).join('\n').trimEnd();
}

function escapeIcsText(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
}

function formatIcsDate(isoString: string) {
  return new Date(isoString).toISOString().replaceAll('-', '').replaceAll(':', '').replace('.000', '');
}

function buildDeadlineEvents(dataset: ExportDataset) {
  const lines: string[] = [];

  for (const assignment of dataset.assignments) {
    if (!assignment.dueAt) {
      continue;
    }
    const due = formatIcsDate(assignment.dueAt);
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${escapeIcsText(assignment.id)}`);
    lines.push(`DTSTAMP:${formatIcsDate(dataset.generatedAt)}`);
    lines.push(`DTSTART:${due}`);
    lines.push(`DTEND:${due}`);
    lines.push(`SUMMARY:${escapeIcsText(assignment.title)}`);
    if (assignment.url) {
      lines.push(`URL:${escapeIcsText(assignment.url)}`);
    }
    lines.push('END:VEVENT');
  }

  for (const event of dataset.events) {
    const start = event.startAt ?? event.endAt;
    const end = event.endAt ?? event.startAt;
    if (!start || !end) {
      continue;
    }
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${escapeIcsText(event.id)}`);
    lines.push(`DTSTAMP:${formatIcsDate(dataset.generatedAt)}`);
    lines.push(`DTSTART:${formatIcsDate(start)}`);
    lines.push(`DTEND:${formatIcsDate(end)}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    if (event.url) {
      lines.push(`URL:${escapeIcsText(event.url)}`);
    }
    lines.push('END:VEVENT');
  }

  return lines;
}

function renderIcs(dataset: ExportDataset) {
  const events = buildDeadlineEvents(dataset);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Copilot//Exporter//EN',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

function buildFilename(preset: ExportPreset, format: ExportFormat, generatedAt: string) {
  const datePart = generatedAt.slice(0, 10);
  return `campus-copilot-${PRESET_LABELS[preset]}-${datePart}.${format}`;
}

export function createExportArtifact(request: {
  preset: ExportPreset;
  format: ExportFormat;
  input: ExportInput;
}): ExportArtifact {
  const normalized = normalizeInput(request.input);
  const dataset = buildPresetDataset(request.preset, normalized);

  const content =
    request.format === 'json'
      ? renderJson(dataset)
      : request.format === 'csv'
        ? renderCsv(dataset)
        : request.format === 'markdown'
          ? renderMarkdown(dataset)
          : renderIcs(dataset);

  return {
    preset: request.preset,
    format: request.format,
    filename: buildFilename(request.preset, request.format, normalized.generatedAt),
    mimeType: MIME_TYPES[request.format],
    content,
  };
}
