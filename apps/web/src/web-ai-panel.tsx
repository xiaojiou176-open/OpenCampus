import type { AiStructuredAnswer, ProviderId, SwitchyardLane, SwitchyardRuntimeProvider } from '@campus-copilot/ai';

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
  onAiBaseUrlChange: (value: string) => void;
  onProviderChange: (value: ProviderId) => void;
  onModelChange: (value: string) => void;
  onSwitchyardProviderChange: (value: SwitchyardRuntimeProvider) => void;
  onSwitchyardLaneChange: (value: SwitchyardLane) => void;
  onQuestionChange: (value: string) => void;
  onAskAi: () => Promise<void>;
}) {
  return (
    <section className="panel ai-panel">
      <div className="item-header">
        <h2>Cited AI</h2>
        <span className="badge">same thin BFF</span>
      </div>
      <p>
        The web surface keeps the same AI-after-structure rule: export the current workbench, then ask
        for an explanation over structured data.
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
      <label className="question-field">
        Question
        <textarea value={props.question} onChange={(event) => props.onQuestionChange(event.target.value)} rows={4} />
      </label>
      <div className="toolbar-row">
        <button type="button" onClick={() => void props.onAskAi()} disabled={props.aiPending}>
          {props.aiPending ? 'Asking AI…' : 'Ask AI'}
        </button>
      </div>
      {props.aiError ? <p className="error">{props.aiError}</p> : null}
      {props.aiNotice ? <p className="feedback">{props.aiNotice}</p> : null}
      {props.aiAnswer ? <p className="answer">{props.aiAnswer}</p> : null}
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
