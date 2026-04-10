import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WebAiPanel } from './web-ai-panel';

describe('web ai panel guardrails', () => {
  it('renders guardrails first and keeps runtime controls under advanced settings', () => {
    const html = renderToStaticMarkup(
      createElement(WebAiPanel, {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        switchyardProvider: 'chatgpt',
        switchyardLane: 'web',
        providers: [
          { value: 'openai', label: 'OpenAI', model: 'gpt-4.1-mini' },
          { value: 'gemini', label: 'Gemini', model: 'gemini-2.5-flash' },
          { value: 'switchyard', label: 'Switchyard', model: 'gpt-5' },
        ],
        aiBaseUrl: 'http://127.0.0.1:8787',
        question: 'What changed this week?',
        aiPending: false,
        availableCourses: [{ id: 'canvas:course:1', label: 'Canvas · CSE 142' }],
        advancedMaterialEnabled: false,
        advancedMaterialCourseId: '',
        advancedMaterialExcerpt: '',
        advancedMaterialAcknowledged: false,
        onAiBaseUrlChange: () => {},
        onProviderChange: () => {},
        onModelChange: () => {},
        onSwitchyardProviderChange: () => {},
        onSwitchyardLaneChange: () => {},
        onQuestionChange: () => {},
        onAdvancedMaterialEnabledChange: () => {},
        onAdvancedMaterialCourseChange: () => {},
        onAdvancedMaterialExcerptChange: () => {},
        onAdvancedMaterialAcknowledgedChange: () => {},
        onAskAi: async () => {},
      }),
    );

    expect(html).toContain('What AI can see');
    expect(html).toContain('What AI cannot do');
    expect(html).toContain('Workspace explanation strip');
    expect(html).toContain('Manual-only guardrail');
    expect(html).toContain('The current workbench slice, focus queue, weekly load, planning pulse, and exported current view');
    expect(html).toContain('Cited answer zone');
    expect(html).toContain('Waiting for a cited answer');
    expect(html).toContain('Advanced settings and opt-ins');
    expect(html).toContain('These controls stay available for targeted opt-ins and runtime debugging, but they are not the main path of this surface.');
    expect(html).toContain('Advanced material analysis');
    expect(html).toContain('default off');
    expect(html).toContain('BFF base URL');
    expect(html).toContain('Provider');
    expect(html).toContain('Model');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('Enable excerpt analysis for one course');
  });
});
