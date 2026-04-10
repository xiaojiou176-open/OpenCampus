import type { ExportPreset } from '@campus-copilot/exporter';
import { type UiText } from './surface-shell-view-helpers';

export function PopupQuickExportPanel(props: {
  text: UiText;
  onExport: (preset: ExportPreset) => Promise<void>;
}) {
  const pulseActions: Array<{
    preset: ExportPreset;
    title: string;
    description: string;
    tone: 'featured' | 'default';
  }> = [
    {
      preset: 'weekly_assignments',
      title: props.text.popup.weeklyAssignments,
      description: props.text.popup.weeklyAssignmentsDescription,
      tone: 'featured',
    },
    {
      preset: 'recent_updates',
      title: props.text.popup.recentUpdates,
      description: props.text.popup.recentUpdatesDescription,
      tone: 'featured',
    },
    {
      preset: 'all_deadlines',
      title: props.text.popup.allDeadlines,
      description: props.text.popup.allDeadlinesDescription,
      tone: 'default',
    },
    {
      preset: 'focus_queue',
      title: props.text.popup.focusQueue,
      description: props.text.popup.focusQueueDescription,
      tone: 'default',
    },
    {
      preset: 'weekly_load',
      title: props.text.popup.weeklyLoad,
      description: props.text.popup.weeklyLoadDescription,
      tone: 'default',
    },
    {
      preset: 'change_journal',
      title: props.text.popup.changeJournal,
      description: props.text.popup.changeJournalDescription,
      tone: 'default',
    },
    {
      preset: 'current_view',
      title: props.text.popup.currentView,
      description: props.text.popup.currentViewDescription,
      tone: 'default',
    },
  ];

  return (
    <div className="surface__grid">
      <article className="surface__panel surface__panel--hero">
        <div className="surface__section-head">
          <div>
            <h2>{props.text.popup.quickPulse}</h2>
            <p>{props.text.popup.quickPulseDescription}</p>
          </div>
          <span className="surface__badge surface__badge--warning">{props.text.popup.readOnlyBadge}</span>
        </div>
        <div className="surface__quick-pulse-grid">
          {pulseActions.map((action) => (
            <button
              className={`surface__pulse-action surface__pulse-action--${action.tone}`}
              key={action.preset}
              onClick={() => void props.onExport(action.preset)}
            >
              <span className="surface__pulse-action-title">{action.title}</span>
              <span className="surface__pulse-action-description">{action.description}</span>
            </button>
          ))}
        </div>
      </article>
    </div>
  );
}
