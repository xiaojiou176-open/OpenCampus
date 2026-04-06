import { describe, expect, it } from 'vitest';
import type { ImportedWorkbenchSnapshot } from '@campus-copilot/storage';
import {
  buildSnapshotSiteView,
  createExportArtifactFromSnapshot,
  parseImportedWorkbenchSnapshot,
  resolveSwitchyardFirstProvider,
} from './index';

const FIXTURE: ImportedWorkbenchSnapshot = {
  generatedAt: '2026-04-03T09:00:00-07:00',
  resources: [
    {
      id: 'edstem:resource:guide-1',
      kind: 'resource',
      site: 'edstem',
      source: {
        site: 'edstem',
        resourceId: 'guide-1',
        resourceType: 'resource',
      },
      courseId: 'edstem:course:cse312',
      resourceKind: 'file',
      title: 'Week 8 review sheet',
    },
  ],
  assignments: [
    {
      id: 'canvas:assignment:hw5',
      kind: 'assignment',
      site: 'canvas',
      source: {
        site: 'canvas',
        resourceId: 'hw5',
        resourceType: 'assignment',
      },
      title: 'Homework 5',
      status: 'submitted',
      dueAt: '2026-04-04T23:59:00-07:00',
      summary: 'Submitted · 92 / 100',
    },
  ],
  announcements: [],
  messages: [
    {
      id: 'edstem:message:office-hours',
      kind: 'message',
      site: 'edstem',
      source: {
        site: 'edstem',
        resourceId: 'office-hours',
        resourceType: 'thread',
      },
      messageKind: 'thread',
      title: 'Office hours follow-up',
      summary: 'General / Logistics',
      unread: true,
    },
  ],
  grades: [],
  events: [],
  syncRuns: [],
  changeEvents: [],
};

describe('@campus-copilot/sdk', () => {
  it('parses both direct and wrapped imported snapshots', () => {
    const direct = parseImportedWorkbenchSnapshot(JSON.stringify(FIXTURE));
    const wrapped = parseImportedWorkbenchSnapshot(
      JSON.stringify({
        generatedAt: FIXTURE.generatedAt,
        data: FIXTURE,
      }),
    );

    expect(direct.resources?.[0]?.title).toBe('Week 8 review sheet');
    expect(direct.assignments?.[0]?.title).toBe('Homework 5');
    expect(wrapped.messages?.[0]?.site).toBe('edstem');
  });

  it('resolves switchyard-first provider order', () => {
    const provider = resolveSwitchyardFirstProvider({
      openai: { ready: true, reason: 'configured' },
      gemini: { ready: true, reason: 'configured' },
      switchyard: { ready: true, reason: 'configured_local_runtime' },
    });

    expect(provider).toBe('switchyard');
  });

  it('builds site views and export artifacts from a snapshot', () => {
    const edstemView = buildSnapshotSiteView(FIXTURE, 'edstem');
    const artifact = createExportArtifactFromSnapshot({
      snapshot: FIXTURE,
      preset: 'current_view',
      format: 'markdown',
      site: 'canvas',
    });

    expect(edstemView.counts.resources).toBe(1);
    expect(edstemView.counts.messages).toBe(1);
    expect(edstemView.resources[0]?.title).toBe('Week 8 review sheet');
    expect(edstemView.messages[0]?.title).toBe('Office hours follow-up');
    expect(artifact.filename).toContain('current-view');
    expect(artifact.content).toContain('Homework 5');
  });
});
