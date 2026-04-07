import { useEffect, useMemo, useState } from 'react';
import {
  resolveAiAnswer,
  type AiStructuredAnswer,
  type ProviderId,
  type SwitchyardLane,
  type SwitchyardRuntimeProvider,
} from '@campus-copilot/ai';
import { buildWorkbenchAiProxyRequest, buildWorkbenchExportInput } from '@campus-copilot/core';
import {
  createExportArtifact,
  type ExportArtifact,
  type ExportFormat,
  type ExportPreset,
} from '@campus-copilot/exporter';
import type { Site } from '@campus-copilot/schema';
import {
  campusCopilotDb,
  replaceImportedWorkbenchSnapshot,
  useAllSiteEntityCounts,
  useFocusQueue,
  useLatestSyncRuns,
  usePriorityAlerts,
  useRecentChangeEvents,
  useRecentUpdates,
  useTodaySnapshot,
  useWeeklyLoad,
  useWorkbenchView,
  type WorkbenchFilter,
} from '@campus-copilot/storage';
import { DEMO_IMPORTED_SNAPSHOT, snapshotFromImportedJson } from './import-export-snapshot';
import { WebAiPanel } from './web-ai-panel';
import { WebToolbar } from './web-toolbar';
import { WebWorkbenchPanels } from './web-workbench-panels';
import { formatRelativeTime } from './web-view-helpers';

const SITE_ORDER: Site[] = ['canvas', 'gradescope', 'edstem', 'myuw'];

const SITE_LABELS: Record<Site, string> = {
  canvas: 'Canvas',
  gradescope: 'Gradescope',
  edstem: 'EdStem',
  myuw: 'MyUW',
};

const PROVIDERS: Array<{ value: ProviderId; label: string; model: string }> = [
  { value: 'openai', label: 'OpenAI', model: 'gpt-4.1-mini' },
  { value: 'gemini', label: 'Gemini', model: 'gemini-2.5-flash' },
  { value: 'switchyard', label: 'Switchyard', model: 'gpt-5' },
];

const EXPORT_FORMATS: ExportFormat[] = ['markdown', 'json', 'csv', 'ics'];

function downloadArtifact(artifact: ExportArtifact) {
  const blob = new Blob([artifact.content], {
    type: artifact.format === 'json' ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = artifact.filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function App() {
  const [ready, setReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow] = useState(() => new Date().toISOString());
  const [filters, setFilters] = useState<WorkbenchFilter>({ site: 'all', onlyUnseenUpdates: false });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [feedback, setFeedback] = useState<string>('Loading shared workspace snapshot...');
  const [aiBaseUrl, setAiBaseUrl] = useState('http://127.0.0.1:8787');
  const [provider, setProvider] = useState<ProviderId>('gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [switchyardProvider, setSwitchyardProvider] = useState<SwitchyardRuntimeProvider>('chatgpt');
  const [switchyardLane, setSwitchyardLane] = useState<SwitchyardLane>('web');
  const [question, setQuestion] = useState('What should I do first this week, and why?');
  const [aiPending, setAiPending] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string>();
  const [aiStructured, setAiStructured] = useState<AiStructuredAnswer>();
  const [aiNotice, setAiNotice] = useState<string>();
  const [aiError, setAiError] = useState<string>();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date().toISOString()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    async function bootstrap() {
      const bootstrapDelayMs =
        globalThis.navigator.webdriver
          ? Number(
              (
                globalThis as typeof globalThis & {
                  __CAMPUS_WEB_BOOTSTRAP_DELAY_MS__?: number;
                }
              ).__CAMPUS_WEB_BOOTSTRAP_DELAY_MS__ ?? 0,
            )
          : 0;

      if (Number.isFinite(bootstrapDelayMs) && bootstrapDelayMs > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, bootstrapDelayMs));
      }

      const existingCount =
        (await campusCopilotDb.assignments.count()) +
        (await campusCopilotDb.messages.count()) +
        (await campusCopilotDb.events.count());

      if (existingCount === 0) {
        await replaceImportedWorkbenchSnapshot(DEMO_IMPORTED_SNAPSHOT);
        setFeedback('Loaded demo workspace data on the shared schema/storage contract.');
      } else {
        setFeedback('Loaded the existing local web workspace snapshot.');
      }

      setReady(true);
      setRefreshKey((current) => current + 1);
    }

    void bootstrap();
  }, []);

  const todaySnapshot = useTodaySnapshot(now, undefined, refreshKey);
  const focusQueueResult = useFocusQueue(now, undefined, refreshKey);
  const weeklyLoadResult = useWeeklyLoad(now, undefined, refreshKey);
  const recentUpdates = useRecentUpdates(now, 8, undefined, refreshKey);
  const recentChangeEventsResult = useRecentChangeEvents(8, undefined, refreshKey);
  const priorityAlertsResult = usePriorityAlerts(now, undefined, refreshKey);
  const latestSyncRunsResult = useLatestSyncRuns(4, undefined, refreshKey);
  const siteCountsResult = useAllSiteEntityCounts(undefined, refreshKey);
  const workbenchView = useWorkbenchView(now, filters, undefined, refreshKey);

  const workbenchReady =
    ready &&
    todaySnapshot != null &&
    focusQueueResult != null &&
    weeklyLoadResult != null &&
    recentUpdates != null &&
    recentChangeEventsResult != null &&
    priorityAlertsResult != null &&
    latestSyncRunsResult != null &&
    siteCountsResult != null &&
    workbenchView != null;

  const focusQueue = focusQueueResult ?? [];
  const weeklyLoad = weeklyLoadResult ?? [];
  const recentChangeEvents = recentChangeEventsResult ?? [];
  const priorityAlerts = priorityAlertsResult ?? [];
  const latestSyncRuns = latestSyncRunsResult ?? [];
  const siteCounts = siteCountsResult ?? [];

  const currentResources = workbenchView?.resources ?? [];
  const currentAssignments = workbenchView?.assignments ?? [];
  const currentAnnouncements = workbenchView?.announcements ?? [];
  const currentMessages = workbenchView?.messages ?? [];
  const currentGrades = workbenchView?.grades ?? [];
  const currentEvents = workbenchView?.events ?? [];
  const currentAlerts = workbenchView?.alerts ?? [];

  const topSyncRun = latestSyncRuns[0];

  function handleExport(preset: ExportPreset) {
    const siteLabel = filters.site === 'all' ? 'All sites' : SITE_LABELS[filters.site];
    const artifact = createExportArtifact({
      preset,
      format: exportFormat,
      input: buildWorkbenchExportInput({
        preset,
        generatedAt: now,
        filters,
        resources: currentResources,
        assignments: currentAssignments,
        announcements: currentAnnouncements,
        messages: currentMessages,
        grades: currentGrades,
        events: currentEvents,
        alerts: currentAlerts,
        recentUpdates,
        focusQueue,
        weeklyLoad,
        syncRuns: latestSyncRuns,
        changeEvents: recentChangeEvents,
        presentation: {
          viewTitle: `Web workbench (${siteLabel})`,
        },
      }),
    });
    downloadArtifact(artifact);
    setFeedback(`Downloaded ${artifact.filename} from the same exporter contract used by the extension.`);
  }

  async function handleImportFile(file: File) {
    const raw = await file.text();
    const snapshot = snapshotFromImportedJson(raw);
    await replaceImportedWorkbenchSnapshot(snapshot);
    setRefreshKey((current) => current + 1);
    setFeedback('Imported a read-only workspace snapshot into the shared storage/read-model.');
  }

  async function handleResetDemo() {
    await replaceImportedWorkbenchSnapshot(DEMO_IMPORTED_SNAPSHOT);
    setRefreshKey((current) => current + 1);
    setFeedback('Reset the web workbench to the bundled demo snapshot.');
  }

  async function handleAskAi() {
    if (!question.trim()) {
      setAiError('Enter a question before asking for a cited answer.');
      return;
    }

    setAiPending(true);
    setAiError(undefined);
    setAiNotice(undefined);

    try {
      const siteLabel = filters.site === 'all' ? 'All sites' : SITE_LABELS[filters.site];
      const currentViewExport = createExportArtifact({
        preset: 'current_view',
        format: 'markdown',
        input: buildWorkbenchExportInput({
          preset: 'current_view',
          generatedAt: now,
          filters,
          resources: currentResources,
          assignments: currentAssignments,
          announcements: currentAnnouncements,
          messages: currentMessages,
          grades: currentGrades,
          events: currentEvents,
          alerts: currentAlerts,
          recentUpdates,
          focusQueue,
          weeklyLoad,
          syncRuns: latestSyncRuns,
          changeEvents: recentChangeEvents,
          presentation: {
            viewTitle: `Web workbench (${siteLabel})`,
          },
        }),
      });

      const request = buildWorkbenchAiProxyRequest({
        provider,
        model,
        switchyardProvider,
        switchyardLane,
        question,
        todaySnapshot:
          todaySnapshot ?? {
            totalAssignments: 0,
            dueSoonAssignments: 0,
            recentUpdates: 0,
            newGrades: 0,
            riskAlerts: 0,
            syncedSites: 0,
          },
        recentUpdates: recentUpdates?.items ?? [],
        alerts: priorityAlerts,
        focusQueue,
        weeklyLoad,
        syncRuns: latestSyncRuns,
        recentChanges: recentChangeEvents,
        currentViewExport,
      });

      const response = await fetch(`${aiBaseUrl}${request.route}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(request.body),
      });

      const payload = (await response.json()) as {
        answerText?: string;
        error?: string;
        structuredAnswer?: AiStructuredAnswer;
        citationCoverage?: 'structured_citations' | 'uncited_fallback' | 'no_answer';
      };
      const resolvedAnswer = resolveAiAnswer({
        answerText: payload.answerText,
        structuredAnswer: payload.structuredAnswer,
        citationCoverage: payload.citationCoverage,
      });

      if (!response.ok || payload.error || !resolvedAnswer.answerText) {
        throw new Error(payload.error ?? 'The provider did not return a displayable answer.');
      }

      setAiAnswer(resolvedAnswer.answerText);
      setAiStructured(resolvedAnswer.structuredAnswer);
      setAiNotice(
        resolvedAnswer.citationCoverage === 'uncited_fallback'
          ? 'The provider returned a displayable answer, but it did not include the structured citation block yet. Treat this as uncited fallback.'
          : undefined,
      );
      setFeedback(
        resolvedAnswer.citationCoverage === 'structured_citations'
          ? 'Fetched a cited AI answer through the same thin BFF contract.'
          : 'Fetched an AI answer through the same thin BFF contract, but it is still missing the structured citation block.',
      );
    } catch (error) {
      setAiStructured(undefined);
      setAiAnswer(undefined);
      setAiNotice(undefined);
      setAiError(error instanceof Error ? error.message : 'AI request failed.');
    } finally {
      setAiPending(false);
    }
  }

  const countsBySite = useMemo(
    () =>
      SITE_ORDER.map((site) => ({
        site,
        counts:
          siteCounts.find((entry) => entry.site === site) ?? {
            site,
            courses: 0,
            resources: 0,
            assignments: 0,
            announcements: 0,
            grades: 0,
            messages: 0,
            events: 0,
          },
      })),
    [siteCounts],
  );

  return (
    <main className="web-shell">
      <WebToolbar
        ready={ready}
        now={now}
        feedback={feedback}
        exportFormat={exportFormat}
        exportFormats={EXPORT_FORMATS}
        filters={filters}
        siteOrder={SITE_ORDER}
        siteLabels={SITE_LABELS}
        onLoadDemo={handleResetDemo}
        onImportFile={handleImportFile}
        onExportFormatChange={setExportFormat}
        onSiteFilterChange={(site) =>
          setFilters((current) => ({
            ...current,
            site,
          }))
        }
        onOnlyUnseenChange={(onlyUnseenUpdates) =>
          setFilters((current) => ({
            ...current,
            onlyUnseenUpdates,
          }))
        }
        onExportCurrentView={() => handleExport('current_view')}
        onExportFocusQueue={() => handleExport('focus_queue')}
        onExportWeeklyLoad={() => handleExport('weekly_load')}
        onExportChangeJournal={() => handleExport('change_journal')}
      />

      <WebWorkbenchPanels
        workbenchReady={workbenchReady}
        todaySnapshot={todaySnapshot ?? undefined}
        recentUpdates={recentUpdates ?? undefined}
        focusQueue={focusQueue}
        weeklyLoad={weeklyLoad}
        currentAssignments={currentAssignments}
        currentMessages={currentMessages}
        currentResources={currentResources}
        currentAnnouncements={currentAnnouncements}
        currentEvents={currentEvents}
        recentChangeEvents={recentChangeEvents}
        countsBySite={countsBySite}
        topSyncRun={topSyncRun}
        siteLabels={SITE_LABELS}
      />

      <WebAiPanel
        provider={provider}
        model={model}
        switchyardProvider={switchyardProvider}
        switchyardLane={switchyardLane}
        providers={PROVIDERS}
        aiBaseUrl={aiBaseUrl}
        question={question}
        aiPending={aiPending}
        aiError={aiError}
        aiNotice={aiNotice}
        aiAnswer={aiAnswer}
        aiStructured={aiStructured}
        onAiBaseUrlChange={setAiBaseUrl}
        onProviderChange={(nextProvider) => {
          setProvider(nextProvider);
          setModel(PROVIDERS.find((item) => item.value === nextProvider)?.model ?? model);
        }}
        onModelChange={setModel}
        onSwitchyardProviderChange={setSwitchyardProvider}
        onSwitchyardLaneChange={setSwitchyardLane}
        onQuestionChange={setQuestion}
        onAskAi={handleAskAi}
      />
    </main>
  );
}
