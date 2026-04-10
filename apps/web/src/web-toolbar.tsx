import type { ExportFormat } from '@campus-copilot/exporter';
import type { Site } from '@campus-copilot/schema';
import type { SyncRun, WorkbenchFilter } from '@campus-copilot/storage';
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
  topSyncRun?: SyncRun;
  populatedSiteCount: number;
  trackedEntityCount: number;
  unseenUpdateCount: number;
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
        <div className="hero-copy">
          <p className="eyebrow">Campus Copilot Web Workbench</p>
          <h1>Academic workbench</h1>
          <p className="lede">
            One local workspace for what changed, what is open, and what needs attention first.
          </p>
          <p className="hero-support">
            Shared storage and read-only exports stay in front. Cited AI explains the workspace after
            the facts are already visible.
          </p>
        </div>
        <div className="hero-card">
          <p>Workspace truth</p>
          <strong>{props.ready ? 'Shared storage/read-model loaded' : 'Bootstrapping local workspace'}</strong>
          <span>Last refresh {formatRelativeTime(props.now)}</span>
          <span className="hero-card-note">Local-first and read-only on the same schema/export contract.</span>
        </div>
      </section>

      <section className="support-grid" aria-label="Workspace trust and diagnostics">
        <article className="support-card">
          <p className="eyebrow">Supporting trust layer</p>
          <h2>Trust summary</h2>
          <p className="support-copy">
            The web workbench keeps local-first, read-only evidence in front. AI follows the visible
            snapshot instead of becoming the product headline.
          </p>
          <ul className="support-list">
            <li>Imports and demo resets stay inside this workspace on the shared schema and storage contract.</li>
            <li>Manual-only and registration-related routes stay outside the product path.</li>
            <li>Cited AI comes after the workbench truth, exported slice, and visible receipts.</li>
          </ul>
        </article>

        <article className="support-card">
          <p className="eyebrow">Supporting diagnostics</p>
          <h2>Diagnostics and receipts</h2>
          <p className="support-copy">
            This layer reports what the imported workspace can currently prove. It does not invent live
            sync success beyond the receipts already stored here.
          </p>
          <div className="support-metrics" role="list" aria-label="Workspace diagnostics">
            <article className="support-metric" role="listitem">
              <span>Imported sites with data</span>
              <strong>{props.populatedSiteCount}</strong>
            </article>
            <article className="support-metric" role="listitem">
              <span>Tracked entities</span>
              <strong>{props.trackedEntityCount}</strong>
            </article>
            <article className="support-metric" role="listitem">
              <span>Unseen updates</span>
              <strong>{props.unseenUpdateCount}</strong>
            </article>
          </div>
          <p className="support-note">
            {props.topSyncRun
              ? `Latest stored sync receipt: ${props.siteLabels[props.topSyncRun.site]} · ${props.topSyncRun.outcome} · ${formatRelativeTime(props.topSyncRun.completedAt)}.`
              : 'No stored sync receipt is visible yet. Import a current-view snapshot first to populate diagnostics and change receipts.'}
          </p>
        </article>
      </section>

      <section className="toolbar-card" aria-label="Workbench toolbar">
        <div className="toolbar-groups">
          <section className="toolbar-group" aria-labelledby="web-load-import-group">
            <div className="toolbar-group-header">
              <p className="eyebrow" id="web-load-import-group">
                Load / Import
              </p>
              <p className="toolbar-group-copy">Bring a local snapshot into the workbench without changing the source systems.</p>
            </div>
            <div className="toolbar-row">
              <button type="button" className="secondary-button" onClick={() => void props.onLoadDemo()}>
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
            </div>
          </section>

          <section className="toolbar-group" aria-labelledby="web-filter-export-group">
            <div className="toolbar-group-header">
              <p className="eyebrow" id="web-filter-export-group">
                Filter / Export
              </p>
              <p className="toolbar-group-copy">Shape the current view first, then export the exact slice you want to share or review.</p>
            </div>
            <div className="toolbar-row toolbar-row-fields">
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
            </div>
            <div className="toolbar-row">
              <button type="button" className="primary-button" onClick={props.onExportCurrentView}>
                Export current view
              </button>
              <button type="button" className="secondary-button" onClick={props.onExportFocusQueue}>
                Export focus queue
              </button>
              <button type="button" className="secondary-button" onClick={props.onExportWeeklyLoad}>
                Export weekly load
              </button>
              <button type="button" className="secondary-button" onClick={props.onExportChangeJournal}>
                Export change journal
              </button>
            </div>
          </section>
        </div>
        <p className="feedback" role="status">
          {props.feedback}
        </p>
      </section>
    </>
  );
}
