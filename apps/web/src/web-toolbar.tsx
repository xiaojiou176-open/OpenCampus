import type { ExportFormat } from '@campus-copilot/exporter';
import type { Site } from '@campus-copilot/schema';
import type { WorkbenchFilter } from '@campus-copilot/storage';
import { formatRelativeTime } from './web-view-helpers';

export function WebToolbar(props: {
  ready: boolean;
  now: string;
  feedback: string;
  exportFormat: ExportFormat;
  exportFormats: ExportFormat[];
  filters: WorkbenchFilter;
  siteOrder: Site[];
  siteLabels: Record<Site, string>;
  onLoadDemo: () => Promise<void>;
  onImportFile: (file: File) => Promise<void>;
  onExportFormatChange: (value: ExportFormat) => void;
  onSiteFilterChange: (value: WorkbenchFilter['site']) => void;
  onOnlyUnseenChange: (value: boolean) => void;
  onExportCurrentView: () => void;
  onExportFocusQueue: () => void;
  onExportWeeklyLoad: () => void;
  onExportChangeJournal: () => void;
}) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Campus Copilot Web Workbench</p>
          <h1>Academic workbench</h1>
          <p className="lede">
            This standalone second surface stays on the same local-first, read-only contract as the
            extension workbench: one schema, one read-model, one exporter, and one cited-AI seam.
          </p>
        </div>
        <div className="hero-card">
          <p>State source</p>
          <strong>{props.ready ? 'Shared storage/read-model loaded' : 'Bootstrapping local workspace'}</strong>
          <span>Last refresh {formatRelativeTime(props.now)}</span>
        </div>
      </section>

      <section className="toolbar-card">
        <div className="toolbar-row">
          <button type="button" onClick={() => void props.onLoadDemo()}>
            Load demo workspace
          </button>
          <label className="file-button">
            Import current-view JSON
            <input
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void props.onImportFile(file);
                }
              }}
            />
          </label>
          <label>
            Export format
            <select value={props.exportFormat} onChange={(event) => props.onExportFormatChange(event.target.value as ExportFormat)}>
              {props.exportFormats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            Site filter
            <select
              value={props.filters.site}
              onChange={(event) => props.onSiteFilterChange(event.target.value as WorkbenchFilter['site'])}
            >
              <option value="all">All sites</option>
              {props.siteOrder.map((site) => (
                <option key={site} value={site}>
                  {props.siteLabels[site]}
                </option>
              ))}
            </select>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={props.filters.onlyUnseenUpdates}
              onChange={(event) => props.onOnlyUnseenChange(event.target.checked)}
            />
            <span className="toggle-label">Only unseen updates</span>
          </label>
        </div>
        <div className="toolbar-row">
          <button type="button" onClick={props.onExportCurrentView}>
            Export current view
          </button>
          <button type="button" onClick={props.onExportFocusQueue}>
            Export focus queue
          </button>
          <button type="button" onClick={props.onExportWeeklyLoad}>
            Export weekly load
          </button>
          <button type="button" onClick={props.onExportChangeJournal}>
            Export change journal
          </button>
        </div>
        <p className="feedback" role="status">
          {props.feedback}
        </p>
      </section>
    </>
  );
}
