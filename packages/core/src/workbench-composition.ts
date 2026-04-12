import {
  type AiRuntimeRequest,
  type AiSitePolicyOverlay,
  type AdvancedMaterialAnalysisRequest,
  buildAiRuntimeMessages,
  createProviderProxyRequest,
  getAiSitePolicyOverlay,
  type ProviderId,
  type SwitchyardLane,
  type SwitchyardRuntimeProvider,
} from '@campus-copilot/ai';
import type {
  AuthorizationState,
  ExportArtifact,
  ExportInput,
  ExportPackagingMetadata,
  ExportPreset,
  ExportScopeMetadata,
} from '@campus-copilot/exporter';
import type { Alert, Announcement, Assignment, Event, Grade, Message, Resource, TimelineEntry } from '@campus-copilot/schema';
import type {
  ChangeEvent,
  FocusQueueItem,
  RecentUpdatesFeed,
  SyncRun,
  TodaySnapshot,
  WeeklyLoadEntry,
  WorkbenchFilter,
  WorkbenchView,
} from '@campus-copilot/storage';

export interface WorkbenchPresentationOverrides {
  viewTitle?: string;
  alerts?: Alert[];
  recentUpdates?: TimelineEntry[];
  focusQueue?: FocusQueueItem[];
  weeklyLoad?: WeeklyLoadEntry[];
  changeEvents?: ChangeEvent[];
}

export interface BuildWorkbenchExportInputArgs {
  preset: ExportPreset;
  generatedAt: string;
  filters: WorkbenchFilter;
  exportScope?: Partial<ExportScopeMetadata>;
  packaging?: Partial<ExportPackagingMetadata>;
  authorization?: AuthorizationState;
  resources: Resource[];
  assignments: Assignment[];
  announcements: Announcement[];
  messages: Message[];
  grades: Grade[];
  events: Event[];
  alerts: Alert[];
  recentUpdates?: RecentUpdatesFeed;
  focusQueue: FocusQueueItem[];
  weeklyLoad: WeeklyLoadEntry[];
  syncRuns: SyncRun[];
  changeEvents: ChangeEvent[];
  presentation?: WorkbenchPresentationOverrides;
}

export interface BuildWorkbenchAiProxyRequestArgs {
  provider: ProviderId;
  model: string;
  switchyardProvider?: SwitchyardRuntimeProvider;
  switchyardLane?: SwitchyardLane;
  question: string;
  advancedMaterialAnalysis?: AdvancedMaterialAnalysisRequest;
  todaySnapshot: TodaySnapshot;
  recentUpdates: TimelineEntry[];
  alerts: Alert[];
  focusQueue: FocusQueueItem[];
  weeklyLoad: WeeklyLoadEntry[];
  syncRuns: SyncRun[];
  recentChanges: ChangeEvent[];
  currentViewExport: ExportArtifact;
  sitePolicyOverlay?: AiSitePolicyOverlay;
  planningSubstrates?: WorkbenchView['planningSubstrates'];
  workbenchView?: Pick<WorkbenchView, 'planningSubstrates'>;
  presentation?: Omit<WorkbenchPresentationOverrides, 'viewTitle'>;
}

function buildDefaultViewTitle(preset: ExportPreset, filters: WorkbenchFilter) {
  const siteLabel = filters.site === 'all' ? 'All sites' : filters.site;

  switch (preset) {
    case 'current_view':
      return `Current view (${siteLabel})`;
    case 'change_journal':
      return `Change journal (${siteLabel})`;
    case 'focus_queue':
      return `Focus queue (${siteLabel})`;
    case 'weekly_load':
      return `Weekly load (${siteLabel})`;
    case 'weekly_assignments':
      return 'Weekly assignments';
    case 'recent_updates':
      return 'Recent updates';
    case 'all_deadlines':
      return 'All deadlines';
    default:
      return 'Campus Copilot workbench';
  }
}

export function buildWorkbenchExportInput(args: BuildWorkbenchExportInputArgs): ExportInput {
  const presentation = args.presentation;

  return {
    generatedAt: args.generatedAt,
    viewTitle: presentation?.viewTitle ?? buildDefaultViewTitle(args.preset, args.filters),
    scope: {
      site: args.filters.site === 'all' ? undefined : args.filters.site,
      ...args.exportScope,
    },
    packaging: args.packaging,
    authorization: args.authorization,
    resources: args.resources,
    assignments: args.assignments,
    announcements: args.announcements,
    messages: args.messages,
    grades: args.grades,
    events: args.events,
    alerts: presentation?.alerts ?? args.alerts,
    timelineEntries: presentation?.recentUpdates ?? args.recentUpdates?.items ?? [],
    focusQueue: presentation?.focusQueue ?? args.focusQueue,
    weeklyLoad: presentation?.weeklyLoad ?? args.weeklyLoad,
    syncRuns: args.syncRuns,
    changeEvents: presentation?.changeEvents ?? args.changeEvents,
  };
}

export function buildWorkbenchAiProxyRequest(args: BuildWorkbenchAiProxyRequestArgs) {
  const presentation = args.presentation;
  const sitePolicyOverlay = args.sitePolicyOverlay ?? getAiSitePolicyOverlay(args.currentViewExport.scope.site);
  const advancedMaterialAnalysis = args.advancedMaterialAnalysis ?? {
    enabled: false,
    policy: 'default_disabled',
  };
  const toolResults: AiRuntimeRequest['toolResults'] = [
    {
      name: 'get_today_snapshot' as const,
      payload: args.todaySnapshot,
    },
    {
      name: 'get_recent_updates' as const,
      payload: presentation?.recentUpdates ?? args.recentUpdates,
    },
    {
      name: 'get_priority_alerts' as const,
      payload: presentation?.alerts ?? args.alerts,
    },
    {
      name: 'export_current_view' as const,
        payload: {
          filename: args.currentViewExport.filename,
          format: args.currentViewExport.format,
          scope: args.currentViewExport.scope,
          packaging: args.currentViewExport.packaging,
          content: args.currentViewExport.content,
          decisionContext: {
            focusQueue: presentation?.focusQueue ?? args.focusQueue,
          weeklyLoad: presentation?.weeklyLoad ?? args.weeklyLoad,
          syncRuns: args.syncRuns,
          recentChanges: presentation?.changeEvents ?? args.recentChanges,
        },
      },
    },
    {
      name: 'get_planning_substrates' as const,
      payload: args.planningSubstrates ?? args.workbenchView?.planningSubstrates ?? [],
    },
  ];

  if (advancedMaterialAnalysis.enabled) {
    toolResults.push({
      name: 'get_opted_in_course_material_excerpt' as const,
      payload: {
        courseId: advancedMaterialAnalysis.courseId,
        courseLabel: advancedMaterialAnalysis.courseLabel,
        excerpt: advancedMaterialAnalysis.excerpt,
        policy: advancedMaterialAnalysis.policy,
        userAcknowledgedResponsibility: advancedMaterialAnalysis.userAcknowledgedResponsibility,
      },
    });
  }

  const runtimeMessages = buildAiRuntimeMessages({
    provider: args.provider,
    model: args.model,
    switchyardProvider: args.switchyardProvider,
    switchyardLane: args.switchyardLane,
    question: args.question,
    advancedMaterialAnalysis,
    sitePolicyOverlay,
    toolResults,
  });

  return createProviderProxyRequest({
    provider: args.provider,
    model: args.model,
    switchyardProvider: args.switchyardProvider,
    switchyardLane: args.switchyardLane,
    messages: [
      {
        role: 'system',
        content: runtimeMessages.systemPrompt,
      },
      {
        role: 'user',
        content: runtimeMessages.userPrompt,
      },
    ],
  });
}
