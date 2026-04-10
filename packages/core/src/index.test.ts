import { describe, expect, it } from 'vitest';
import { buildWorkbenchAiProxyRequest, buildWorkbenchExportInput, CanvasSyncOutcomeSchema, createSurfaceSnapshot } from './index';

describe('core contracts', () => {
  it('creates a surface snapshot from canonical storage results', () => {
    const snapshot = createSurfaceSnapshot('sidepanel', {
      courses: 1,
      resources: 0,
      assignments: 2,
      announcements: 3,
      messages: 0,
      events: 0,
    });

    expect(snapshot.surface).toBe('sidepanel');
    expect(snapshot.counts.assignments).toBe(2);
  });

  it('locks canvas sync outcomes to the allowed contract', () => {
    expect(CanvasSyncOutcomeSchema.parse('success')).toBe('success');
    expect(CanvasSyncOutcomeSchema.parse('unauthorized')).toBe('unauthorized');
    expect(() => CanvasSyncOutcomeSchema.parse('not_a_real_outcome')).toThrow();
  });

  it('builds shared workbench export input with presentation overrides', () => {
    const input = buildWorkbenchExportInput({
      preset: 'current_view',
      generatedAt: '2026-04-06T00:00:00.000Z',
      filters: { site: 'canvas', onlyUnseenUpdates: false },
      resources: [],
      assignments: [],
      announcements: [],
      messages: [],
      grades: [],
      events: [],
      alerts: [],
      recentUpdates: {
        items: [],
        unseenCount: 0,
      },
      focusQueue: [],
      weeklyLoad: [],
      syncRuns: [],
      changeEvents: [],
      presentation: {
        viewTitle: 'Localized current view',
      },
    });

    expect(input.viewTitle).toBe('Localized current view');
    expect(input.timelineEntries).toEqual([]);
  });

  it('builds a shared AI proxy request on the existing route/body contract', () => {
    const request = buildWorkbenchAiProxyRequest({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      question: 'What should I do first?',
      todaySnapshot: {
        totalAssignments: 2,
        dueSoonAssignments: 1,
        recentUpdates: 3,
        newGrades: 0,
        riskAlerts: 1,
        syncedSites: 4,
      },
      recentUpdates: [],
      alerts: [],
      focusQueue: [],
      weeklyLoad: [],
      syncRuns: [],
      recentChanges: [],
      planningSubstrates: [
        {
          id: 'myplan:student-plan',
          source: 'myplan',
          fit: 'derived_planning_substrate',
          readOnly: true,
          capturedAt: '2026-04-10T08:00:00.000Z',
          planId: 'student-plan',
          planLabel: 'Student Plan',
          termCount: 2,
          plannedCourseCount: 6,
          backupCourseCount: 1,
          scheduleOptionCount: 3,
          requirementGroupCount: 4,
          programExplorationCount: 2,
          terms: [],
        },
      ],
      currentViewExport: {
        preset: 'current_view',
        format: 'markdown',
        filename: 'current-view.md',
        mimeType: 'text/markdown',
        content: '# Current view',
      },
    });

    expect(request.route).toBe('/api/providers/gemini/chat');
    expect(request.body.messages).toHaveLength(2);
    expect(request.body.messages[0]?.role).toBe('system');
    expect(request.body.messages[0]?.content).toContain('Advanced material analysis stays default-disabled');
    expect(request.body.messages[1]?.role).toBe('user');
    expect(request.body.messages[1]?.content).toContain('get_planning_substrates');
  });

  it('accepts planning substrates from the shared workbench view contract', () => {
    const request = buildWorkbenchAiProxyRequest({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      question: 'What does my plan change in the shared workbench?',
      todaySnapshot: {
        totalAssignments: 2,
        dueSoonAssignments: 1,
        recentUpdates: 3,
        newGrades: 0,
        riskAlerts: 1,
        syncedSites: 4,
      },
      recentUpdates: [],
      alerts: [],
      focusQueue: [],
      weeklyLoad: [],
      syncRuns: [],
      recentChanges: [],
      workbenchView: {
        planningSubstrates: [
          {
            id: 'myplan:student-plan',
            source: 'myplan',
            fit: 'derived_planning_substrate',
            readOnly: true,
            capturedAt: '2026-04-10T08:00:00.000Z',
            planId: 'student-plan',
            planLabel: 'Student Plan',
            termCount: 2,
            plannedCourseCount: 6,
            backupCourseCount: 1,
            scheduleOptionCount: 3,
            requirementGroupCount: 4,
            programExplorationCount: 2,
            terms: [],
          },
        ],
      },
      currentViewExport: {
        preset: 'current_view',
        format: 'markdown',
        filename: 'current-view.md',
        mimeType: 'text/markdown',
        content: '# Current view',
      },
    });

    expect(request.body.messages[1]?.content).toContain('Student Plan');
    expect(request.body.messages[1]?.content).toContain('get_planning_substrates');
  });

  it('passes a per-course opt-in excerpt through the shared workbench AI request', () => {
    const request = buildWorkbenchAiProxyRequest({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      question: 'Please summarize these lecture slides for the midterm.',
      advancedMaterialAnalysis: {
        enabled: true,
        policy: 'per_course_opt_in',
        courseId: 'canvas:course:1',
        courseLabel: 'Canvas · CSE 142',
        excerpt: 'The lecture focuses on asymptotic notation and binary search.',
        userAcknowledgedResponsibility: true,
      },
      todaySnapshot: {
        totalAssignments: 0,
        dueSoonAssignments: 0,
        recentUpdates: 0,
        newGrades: 0,
        riskAlerts: 0,
        syncedSites: 0,
      },
      recentUpdates: [],
      alerts: [],
      focusQueue: [],
      weeklyLoad: [],
      syncRuns: [],
      recentChanges: [],
      currentViewExport: {
        preset: 'current_view',
        format: 'markdown',
        filename: 'current-view.md',
        mimeType: 'text/markdown',
        content: '# Current view',
      },
    });

    expect(request.body.messages[0]?.content).toContain('explicitly opted in to advanced material analysis');
    expect(request.body.messages[1]?.content).toContain('get_opted_in_course_material_excerpt');
    expect(request.body.messages[1]?.content).toContain('Canvas · CSE 142');
  });
});
