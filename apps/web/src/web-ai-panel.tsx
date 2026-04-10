import {
  getAcademicAiCallerGuardrails,
  type AiStructuredAnswer,
  type ProviderId,
  type SwitchyardLane,
  type SwitchyardRuntimeProvider,
} from '@campus-copilot/ai';

export function WebAiPanel(props: {
  provider: ProviderId;
  model: string;
  switchyardProvider: SwitchyardRuntimeProvider;
  switchyardLane: SwitchyardLane;
  providers: Array<{ value: ProviderId; label: string; model: string }>;
  aiBaseUrl: string;
  question: string;
  aiPending: boolean;
  aiError?: string;
  aiNotice?: string;
  aiAnswer?: string;
  aiStructured?: AiStructuredAnswer;
  availableCourses: Array<{ id: string; label: string }>;
  advancedMaterialEnabled: boolean;
  advancedMaterialCourseId: string;
  advancedMaterialExcerpt: string;
  advancedMaterialAcknowledged: boolean;
  onAiBaseUrlChange: (value: string) => void;
  onProviderChange: (value: ProviderId) => void;
  onModelChange: (value: string) => void;
  onSwitchyardProviderChange: (value: SwitchyardRuntimeProvider) => void;
  onSwitchyardLaneChange: (value: SwitchyardLane) => void;
  onQuestionChange: (value: string) => void;
  onAdvancedMaterialEnabledChange: (value: boolean) => void;
  onAdvancedMaterialCourseChange: (value: string) => void;
  onAdvancedMaterialExcerptChange: (value: string) => void;
  onAdvancedMaterialAcknowledgedChange: (value: boolean) => void;
  onAskAi: () => Promise<void>;
}) {
  const aiGuardrails = getAcademicAiCallerGuardrails();
  const redZoneHardStop = aiGuardrails.redZone.primaryHardStop;
  const advancedMaterialGuard = aiGuardrails.advancedMaterial;

  return (
    <section className="panel ai-panel">
      <div className="item-header">
        <h2>Cited AI</h2>
        <span className="badge">explanation layer</span>
      </div>
      <p>
        Ask after the workspace is loaded. The model explains the current local workbench; it does not
        replace the workbench.
      </p>
      <div className="ai-guidance-grid" aria-label="AI visibility and boundaries">
        <article className="guidance-card">
          <p className="meta-title">What AI can see</p>
          <p>
            The current workbench slice, focus queue, weekly load, planning pulse, and exported current
            view that are already visible in this workspace.
          </p>
        </article>
        <article className="guidance-card">
          <p className="meta-title">What AI cannot do</p>
          <p>
            Registration automation, seat watching, Notify.UW actions, or direct raw course-file
            ingestion. Those boundaries stay outside this web surface.
          </p>
        </article>
      </div>
      <div className="ai-structured">
        <p className="meta-title">Academic safety guardrails</p>
        <div className="item-header">
          <strong>{redZoneHardStop.title}</strong>
          <span className="badge">manual only</span>
        </div>
        <p>
          {redZoneHardStop.reason} {aiGuardrails.redZone.summary}
        </p>
        <div className="toolbar-row">
          <button type="button" disabled={redZoneHardStop.ctaDisabled}>
            {redZoneHardStop.actionLabel}
          </button>
        </div>
        <p className="feedback">{redZoneHardStop.manualOnlyNote}</p>
        <div className="item-header">
          <strong>{advancedMaterialGuard.toggleLabel}</strong>
          <span className="badge">{props.advancedMaterialEnabled ? 'manual opt-in' : 'default off'}</span>
        </div>
        <label>
          <input
            type="checkbox"
            checked={props.advancedMaterialEnabled}
            onChange={(event) => props.onAdvancedMaterialEnabledChange(event.target.checked)}
          />{' '}
          Enable excerpt analysis for one course
        </label>
        <p>{advancedMaterialGuard.note}</p>
        <p>
          The only supported advanced path is a course-scoped opt-in with a user-pasted excerpt. Campus Copilot still
          does not fetch or upload raw files for you.
        </p>
        {props.advancedMaterialEnabled ? (
          <div className="ai-controls">
            <label>
              Opt-in course
              <select
                value={props.advancedMaterialCourseId}
                onChange={(event) => props.onAdvancedMaterialCourseChange(event.target.value)}
              >
                <option value="">Select one visible course</option>
                {props.availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Paste the excerpt you want analyzed
              <textarea
                rows={5}
                value={props.advancedMaterialExcerpt}
                onChange={(event) => props.onAdvancedMaterialExcerptChange(event.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={props.advancedMaterialAcknowledged}
                onChange={(event) => props.onAdvancedMaterialAcknowledgedChange(event.target.checked)}
              />{' '}
              I confirm this excerpt is for my own course context, I am opting in for this one course explicitly, and
              rights/policy compliance remain my responsibility.
            </label>
          </div>
        ) : null}
      </div>
      <label className="question-field">
        Question
        <textarea value={props.question} onChange={(event) => props.onQuestionChange(event.target.value)} rows={4} />
      </label>
      <div className="toolbar-row ai-actions">
        <button type="button" className="primary-button" onClick={() => void props.onAskAi()} disabled={props.aiPending}>
          {props.aiPending ? 'Asking AI…' : 'Ask AI'}
        </button>
      </div>
      <details className="advanced-settings">
        <summary>Advanced/runtime settings</summary>
        <p className="meta">
          These controls stay available for runtime debugging, but they are not the main path of this
          surface.
        </p>
        <div className="ai-controls">
          <label>
            BFF base URL
            <input value={props.aiBaseUrl} onChange={(event) => props.onAiBaseUrlChange(event.target.value)} />
          </label>
          <label>
            Provider
            <select value={props.provider} onChange={(event) => props.onProviderChange(event.target.value as ProviderId)}>
              {props.providers.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Model
            <input value={props.model} onChange={(event) => props.onModelChange(event.target.value)} />
          </label>
          {props.provider === 'switchyard' ? (
            <>
              <label>
                Switchyard runtime provider
                <select
                  value={props.switchyardProvider}
                  onChange={(event) => props.onSwitchyardProviderChange(event.target.value as SwitchyardRuntimeProvider)}
                >
                  <option value="chatgpt">ChatGPT</option>
                  <option value="gemini">Gemini</option>
                  <option value="claude">Claude</option>
                  <option value="grok">Grok</option>
                  <option value="qwen">Qwen</option>
                </select>
              </label>
              <label>
                Switchyard lane
                <select value={props.switchyardLane} onChange={(event) => props.onSwitchyardLaneChange(event.target.value as SwitchyardLane)}>
                  <option value="web">web</option>
                  <option value="byok">byok</option>
                </select>
              </label>
            </>
          ) : null}
        </div>
      </details>
      {props.aiError ? (
        <p className="error" role="status" aria-live="polite">
          {props.aiError}
        </p>
      ) : null}
      {props.aiNotice ? (
        <p className="feedback" role="status" aria-live="polite">
          {props.aiNotice}
        </p>
      ) : null}
      {props.aiAnswer ? (
        <p className="answer" role="status" aria-live="polite">
          {props.aiAnswer}
        </p>
      ) : null}
      {props.aiStructured ? (
        <div className="ai-structured">
          <p className="meta-title">Summary</p>
          <p>{props.aiStructured.summary}</p>
          <p className="meta-title">Key points</p>
          <ul>
            {props.aiStructured.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {props.aiStructured.nextActions.length ? (
            <>
              <p className="meta-title">Suggested next actions</p>
              <ul>
                {props.aiStructured.nextActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {props.aiStructured.citations.length ? (
            <>
              <p className="meta-title">Citations</p>
              <ul>
                {props.aiStructured.citations.map((citation) => (
                  <li key={`${citation.entityId}:${citation.kind}`}>
                    {citation.site} · {citation.title}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
