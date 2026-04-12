import type { Dispatch, SetStateAction } from 'react';
import type { ProviderId } from '@campus-copilot/ai';
import type { ExportFormat, ExportPreset } from '@campus-copilot/exporter';
import {
  ADMIN_HIGH_SENSITIVITY_FAMILY_DESCRIPTORS,
  MANAGED_POLICY_SITES,
  buildNextConfig,
  type ExtensionConfig,
} from './config';
import { formatProviderReason, formatProviderStatusError, type ProviderStatusLike } from './diagnostics';
import { formatRelativeTime, type ResolvedUiLanguage } from './i18n';
import { EXPORT_FORMAT_OPTIONS, PROVIDER_OPTIONS, SITE_LABELS } from './surface-shell-model';
import { type UiText } from './surface-shell-view-helpers';

const AUTHORIZATION_STATUS_OPTIONS: Array<ExtensionConfig['authorization']['rules'][number]['status']> = [
  'allowed',
  'partial',
  'confirm_required',
  'blocked',
];

function getSiteAuthorizationStatus(
  config: ExtensionConfig,
  site: (typeof MANAGED_POLICY_SITES)[number],
  layer: ExtensionConfig['authorization']['rules'][number]['layer'],
) {
  return (
    config.authorization.rules.find(
      (rule) => rule.site === site && rule.layer === layer && rule.resourceFamily === 'workspace_snapshot',
    )?.status ?? (layer === 'layer1_read_export' ? 'partial' : 'confirm_required')
  );
}

function getWorkspaceAuthorizationStatus(
  config: ExtensionConfig,
  layer: ExtensionConfig['authorization']['rules'][number]['layer'],
) {
  return (
    config.authorization.rules.find(
      (rule) =>
        !rule.site &&
        !rule.courseIdOrKey &&
        rule.layer === layer &&
        rule.resourceFamily === 'workspace_snapshot',
    )?.status ?? (layer === 'layer1_read_export' ? 'allowed' : 'confirm_required')
  );
}

function getResourceFamilyAuthorizationStatus(
  config: ExtensionConfig,
  resourceFamily: (typeof ADMIN_HIGH_SENSITIVITY_FAMILY_DESCRIPTORS)[number]['resourceFamily'],
  layer: ExtensionConfig['authorization']['rules'][number]['layer'],
) {
  return (
    config.authorization.rules.find(
      (rule) =>
        !rule.site &&
        !rule.courseIdOrKey &&
        rule.layer === layer &&
        rule.resourceFamily === resourceFamily,
    )?.status ?? (layer === 'layer1_read_export' ? 'confirm_required' : 'blocked')
  );
}

function updateWorkspaceAuthorizationStatus(
  config: ExtensionConfig,
  layer: ExtensionConfig['authorization']['rules'][number]['layer'],
  status: ExtensionConfig['authorization']['rules'][number]['status'],
) {
  const nextRules = config.authorization.rules.filter(
    (rule) =>
      !(
        !rule.site &&
        !rule.courseIdOrKey &&
        rule.layer === layer &&
        rule.resourceFamily === 'workspace_snapshot'
      ),
  );
  nextRules.push({
    id: `global-${layer}-workspace`,
    layer,
    status,
    resourceFamily: 'workspace_snapshot',
    label:
      layer === 'layer1_read_export'
        ? 'All sites structured read/export'
        : 'All sites AI read/analysis status',
  });

  return buildNextConfig({
    current: config,
    authorization: {
      updatedAt: new Date().toISOString(),
      rules: nextRules,
    },
  });
}

function updateSiteAuthorizationStatus(
  config: ExtensionConfig,
  site: (typeof MANAGED_POLICY_SITES)[number],
  layer: ExtensionConfig['authorization']['rules'][number]['layer'],
  status: ExtensionConfig['authorization']['rules'][number]['status'],
) {
  const nextRules = config.authorization.rules.filter(
    (rule) =>
      !(
        rule.site === site &&
        rule.layer === layer &&
        rule.resourceFamily === 'workspace_snapshot' &&
        !rule.courseIdOrKey
      ),
  );
  nextRules.push({
    id: `${site}-${layer}-workspace`,
    layer,
    status,
    site,
    resourceFamily: 'workspace_snapshot',
    label:
      layer === 'layer1_read_export'
        ? `${site} structured read/export`
        : `${site} AI read/analysis status`,
  });

  return buildNextConfig({
    current: config,
    authorization: {
      updatedAt: new Date().toISOString(),
      rules: nextRules,
    },
  });
}

export function OptionsPanels(props: {
  text: UiText;
  uiLanguage: ResolvedUiLanguage;
  optionsDraft: ExtensionConfig;
  setOptionsDraft: Dispatch<SetStateAction<ExtensionConfig>>;
  providerStatus: ProviderStatusLike;
  providerStatusPending: boolean;
  optionsFeedback?: string;
  onRefreshProviderStatus: () => Promise<void>;
  onSaveOptions: () => Promise<void>;
  onExport: (preset: ExportPreset) => Promise<void>;
}) {
  const {
    text,
    uiLanguage,
    optionsDraft,
    setOptionsDraft,
    providerStatus,
    providerStatusPending,
    optionsFeedback,
    onRefreshProviderStatus,
    onSaveOptions,
    onExport,
  } = props;

  return (
    <div className="surface__grid surface__grid--split">
      <article className="surface__panel">
        <h2>{text.options.siteConfiguration}</h2>
        <p>{text.options.siteConfigurationDescription}</p>
        <label className="surface__field">
          <span>{text.options.threadsPath}</span>
          <input
            value={optionsDraft.sites.edstem.threadsPath ?? ''}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  sites: {
                    edstem: {
                      ...current.sites.edstem,
                      threadsPath: event.target.value || undefined,
                    },
                  },
                }),
              )
            }
            placeholder={text.options.threadsPathPlaceholder}
          />
        </label>
        <label className="surface__field">
          <span>{text.options.unreadPath}</span>
          <input
            value={optionsDraft.sites.edstem.unreadPath ?? ''}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  sites: {
                    edstem: {
                      ...current.sites.edstem,
                      unreadPath: event.target.value || undefined,
                    },
                  },
                }),
              )
            }
            placeholder={text.options.unreadPathPlaceholder}
          />
        </label>
        <label className="surface__field">
          <span>{text.options.recentActivityPath}</span>
          <input
            value={optionsDraft.sites.edstem.recentActivityPath ?? ''}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  sites: {
                    edstem: {
                      ...current.sites.edstem,
                      recentActivityPath: event.target.value || undefined,
                    },
                  },
                }),
              )
            }
            placeholder={text.options.recentActivityPathPlaceholder}
          />
        </label>
      </article>

      <article className="surface__panel">
        <h2>{text.options.aiBffConfiguration}</h2>
        <label className="surface__field">
          <span>{text.options.bffBaseUrl}</span>
          <input
            value={optionsDraft.ai.bffBaseUrl ?? ''}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    bffBaseUrl: event.target.value || undefined,
                  },
                }),
              )
            }
            placeholder={text.options.bffBaseUrlPlaceholder}
          />
        </label>
        <label className="surface__field">
          <span>{text.options.interfaceLanguage}</span>
          <select
            value={optionsDraft.uiLanguage}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  uiLanguage: event.target.value as ExtensionConfig['uiLanguage'],
                }),
              )
            }
          >
            <option value="auto">{text.options.followBrowser}</option>
            <option value="en">{text.options.english}</option>
            <option value="zh-CN">{text.options.chinese}</option>
          </select>
        </label>
        <label className="surface__field">
          <span>{text.options.defaultProvider}</span>
          <select
            value={optionsDraft.ai.defaultProvider}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    defaultProvider: event.target.value as ProviderId,
                  },
                }),
              )
            }
          >
            {PROVIDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="surface__stack">
          {PROVIDER_OPTIONS.map((option) => (
            <p className="surface__meta" key={option.value}>
              {option.label} · {providerStatus.providers[option.value]?.ready ? text.meta.ready : text.meta.notReady} · {formatProviderReason(providerStatus.providers[option.value]?.reason, uiLanguage)}
            </p>
          ))}
          <p className="surface__meta">
            {text.meta.lastChecked}: {formatRelativeTime(uiLanguage, providerStatus.checkedAt)}
            {providerStatus.error ? ` · ${formatProviderStatusError(providerStatus.error, uiLanguage)}` : ''}
          </p>
        </div>
        <div className="surface__actions">
          <button className="surface__button surface__button--ghost" disabled={providerStatusPending} onClick={() => void onRefreshProviderStatus()}>
            {providerStatusPending ? text.options.refreshingBffStatus : text.options.refreshBffStatus}
          </button>
        </div>
        <label className="surface__field">
          <span>{text.options.openAiModel}</span>
          <input
            value={optionsDraft.ai.models.openai}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    models: {
                      ...current.ai.models,
                      openai: event.target.value,
                    },
                  },
                }),
              )
            }
          />
        </label>
        <label className="surface__field">
          <span>{text.options.geminiModel}</span>
          <input
            value={optionsDraft.ai.models.gemini}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    models: {
                      ...current.ai.models,
                      gemini: event.target.value,
                    },
                  },
                }),
              )
            }
          />
        </label>
        <label className="surface__field">
          <span>{text.options.switchyardModel}</span>
          <input
            value={optionsDraft.ai.models.switchyard}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    models: {
                      ...current.ai.models,
                      switchyard: event.target.value,
                    },
                  },
                }),
              )
            }
          />
        </label>
        <label className="surface__field">
          <span>{text.options.switchyardRuntimeProvider}</span>
          <select
            value={optionsDraft.ai.switchyard.provider}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    switchyard: {
                      ...current.ai.switchyard,
                      provider: event.target.value as ExtensionConfig['ai']['switchyard']['provider'],
                    },
                  },
                }),
              )
            }
          >
            <option value="chatgpt">ChatGPT</option>
            <option value="gemini">Gemini</option>
            <option value="claude">Claude</option>
            <option value="grok">Grok</option>
            <option value="qwen">Qwen</option>
          </select>
        </label>
        <label className="surface__field">
          <span>{text.options.switchyardLane}</span>
          <select
            value={optionsDraft.ai.switchyard.lane}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  ai: {
                    ...current.ai,
                    switchyard: {
                      ...current.ai.switchyard,
                      lane: event.target.value as ExtensionConfig['ai']['switchyard']['lane'],
                    },
                  },
                }),
              )
            }
          >
            <option value="web">web</option>
            <option value="byok">byok</option>
          </select>
        </label>
        <label className="surface__field">
          <span>{text.options.defaultExportFormat}</span>
          <select
            value={optionsDraft.defaultExportFormat}
            onChange={(event) =>
              setOptionsDraft((current) =>
                buildNextConfig({
                  current,
                  defaultExportFormat: event.target.value as ExportFormat,
                }),
              )
            }
          >
            {EXPORT_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="surface__stack">
          <h3>Authorization skeleton</h3>
          <p className="surface__meta">
            Layer 1 controls structured plugin read/export. Layer 2 controls AI read/analysis separately.
          </p>
          <p className="surface__meta">
            Policy version: {optionsDraft.authorization.policyVersion} · Course-material excerpts stay confirm-required until per-course opt-in.
          </p>
          <p className="surface__meta">
            Time Schedule now has its own site skeleton. Degree-audit, transcript, finaid, and tuition/account families below are shared policy placeholders only, not landed runtime lanes.
          </p>
          <div className="surface__grid surface__grid--split">
            <label className="surface__field">
              <span>All sites · Layer 1 read/export</span>
              <select
                value={getWorkspaceAuthorizationStatus(optionsDraft, 'layer1_read_export')}
                onChange={(event) =>
                  setOptionsDraft((current) =>
                    updateWorkspaceAuthorizationStatus(
                      current,
                      'layer1_read_export',
                      event.target.value as ExtensionConfig['authorization']['rules'][number]['status'],
                    ),
                  )
                }
              >
                {AUTHORIZATION_STATUS_OPTIONS.map((option) => (
                  <option key={`global-layer1-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="surface__field">
              <span>All sites · Layer 2 AI read/analysis</span>
              <select
                value={getWorkspaceAuthorizationStatus(optionsDraft, 'layer2_ai_read_analysis')}
                onChange={(event) =>
                  setOptionsDraft((current) =>
                    updateWorkspaceAuthorizationStatus(
                      current,
                      'layer2_ai_read_analysis',
                      event.target.value as ExtensionConfig['authorization']['rules'][number]['status'],
                    ),
                  )
                }
              >
                {AUTHORIZATION_STATUS_OPTIONS.map((option) => (
                  <option key={`global-layer2-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {MANAGED_POLICY_SITES.map((site) => (
            <div className="surface__grid surface__grid--split" key={site}>
              <label className="surface__field">
                <span>{SITE_LABELS[site]} · Layer 1 read/export</span>
                <select
                  value={getSiteAuthorizationStatus(optionsDraft, site, 'layer1_read_export')}
                  onChange={(event) =>
                    setOptionsDraft((current) =>
                      updateSiteAuthorizationStatus(
                        current,
                        site,
                        'layer1_read_export',
                        event.target.value as ExtensionConfig['authorization']['rules'][number]['status'],
                      ),
                    )
                  }
                >
                  {AUTHORIZATION_STATUS_OPTIONS.map((option) => (
                    <option key={`${site}-layer1-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="surface__field">
                <span>{SITE_LABELS[site]} · Layer 2 AI read/analysis</span>
                <select
                  value={getSiteAuthorizationStatus(optionsDraft, site, 'layer2_ai_read_analysis')}
                  onChange={(event) =>
                    setOptionsDraft((current) =>
                      updateSiteAuthorizationStatus(
                        current,
                        site,
                        'layer2_ai_read_analysis',
                        event.target.value as ExtensionConfig['authorization']['rules'][number]['status'],
                      ),
                    )
                  }
                >
                  {AUTHORIZATION_STATUS_OPTIONS.map((option) => (
                    <option key={`${site}-layer2-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
          <div className="surface__stack">
            <h3>Reserved admin high-sensitivity families</h3>
            <p className="surface__meta">
              These entries reserve shared auth vocabulary for future DARS/transcript/finaid lanes without claiming that those runtime adapters already exist.
            </p>
            {ADMIN_HIGH_SENSITIVITY_FAMILY_DESCRIPTORS.map((family) => (
              <div className="surface__stack" key={family.resourceFamily}>
                <p className="surface__meta">
                  <strong>{family.label}</strong> · Layer 1 {getResourceFamilyAuthorizationStatus(optionsDraft, family.resourceFamily, 'layer1_read_export')} · Layer 2{' '}
                  {getResourceFamilyAuthorizationStatus(optionsDraft, family.resourceFamily, 'layer2_ai_read_analysis')}
                </p>
                <p className="surface__meta">{family.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface__actions surface__actions--wrap">
          <button className="surface__button" onClick={() => void onSaveOptions()}>
            {text.options.saveConfiguration}
          </button>
          <button className="surface__button surface__button--ghost" onClick={() => void onExport('change_journal')}>
            {text.options.exportChangeJournal}
          </button>
          <button className="surface__button surface__button--secondary" onClick={() => void onExport('current_view')}>
            {text.options.exportCurrentView}
          </button>
        </div>
        {optionsFeedback ? <p className="surface__feedback">{optionsFeedback}</p> : null}
      </article>

      <article className="surface__panel">
        <h2>{text.boundaryDisclosure.title}</h2>
        <ul className="surface__list">
          {text.boundaryDisclosure.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
