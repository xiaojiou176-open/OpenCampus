import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PopupQuickExportPanel } from './popup-quick-export-panel';
import { getUiText } from './i18n';

describe('popup quick export panel', () => {
  it('keeps featured pulse exports ahead of compact supporting exports', () => {
    const html = renderToStaticMarkup(
      <PopupQuickExportPanel
        text={getUiText('en')}
        onExport={vi.fn(async () => {})}
      />,
    );

    expect(html).toContain('Quick pulse exports');
    expect(html).toContain('surface__panel--subtle');
    expect(html).toContain('surface__pulse-action--featured');
    expect(html).toContain('surface__pulse-action--compact');
    expect(html.indexOf('Weekly assignments')).toBeLessThan(html.indexOf('Focus queue'));
    expect(html.indexOf('Recent updates')).toBeLessThan(html.indexOf('Current view'));
  });
});
