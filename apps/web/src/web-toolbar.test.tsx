import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WebToolbar } from './web-toolbar';

describe('web toolbar trust and diagnostics layer', () => {
  it('renders a supporting trust summary and diagnostics receipts without overclaiming live state', () => {
    const html = renderToStaticMarkup(
      createElement(WebToolbar, {
        ready: true,
        now: '2026-04-10T09:00:00.000Z',
        feedback: 'Loaded the existing local web workspace snapshot.',
        exportFormat: 'markdown',
        exportFormats: ['markdown', 'json'],
        filters: { site: 'all', onlyUnseenUpdates: false },
        siteOrder: ['canvas', 'gradescope', 'edstem', 'myuw', 'time-schedule'],
        siteLabels: {
          canvas: 'Canvas',
          gradescope: 'Gradescope',
          edstem: 'EdStem',
          myuw: 'MyUW',
          'time-schedule': 'Time Schedule',
        },
        topSyncRun: {
          id: 'sync-1',
          site: 'canvas',
          status: 'success',
          outcome: 'success',
          completedAt: '2026-04-10T08:45:00.000Z',
          startedAt: '2026-04-10T08:40:00.000Z',
          changeCount: 5,
        },
        populatedSiteCount: 4,
        trackedEntityCount: 27,
        unseenUpdateCount: 3,
        onLoadDemo: async () => {},
        onImportFile: async () => {},
        onExportFormatChange: () => {},
        onSiteFilterChange: () => {},
        onOnlyUnseenChange: () => {},
        onExportCurrentView: () => {},
        onExportFocusQueue: () => {},
        onExportWeeklyLoad: () => {},
        onExportChangeJournal: () => {},
      }),
    );

    expect(html).toContain('Trust summary');
    expect(html).toContain('Diagnostics and receipts');
    expect(html).toContain('Imported sites with data');
    expect(html).toContain('Tracked entities');
    expect(html).toContain('Unseen updates');
    expect(html).toContain('Latest stored sync receipt: Canvas');
    expect(html).toContain('Local-first evidence comes first. AI only explains the visible workspace after the receipts are already on screen.');
    expect(html).toContain('Registration-related and red-zone routes stay outside this product surface.');
  });
});
