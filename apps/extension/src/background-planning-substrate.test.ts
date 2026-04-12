import { describe, expect, it } from 'vitest';
import { buildMyPlanPlanningSubstrateFromHtml } from './background-planning-substrate';

describe('background planning substrate capture', () => {
  it('builds a planning substrate summary from a live MyPlan term page', () => {
    const record = buildMyPlanPlanningSubstrateFromHtml({
      url: 'https://myplan.uw.edu/plan/#/sp26',
      capturedAt: '2026-04-11T12:00:00-07:00',
      pageHtml: `
        <main>
          <h1 class="mb-0 fw-bold">Spring 2026 Current Quarter</h1>
          <a href="/plan/#/sp26">SP 26</a>
          <a href="/plan/#/su26">SU 26</a>
          <a href="/plan/#/au26">AU 26</a>
          <div class="card-body">
            <h2 class="mb-0">Issues to Resolve</h2>
            Resolve issues with your planned courses before registration.
          </div>
          <h3 class="mb-0 d-inline align-middle h3">CSE 421</h3>
          <a class="d-block lead me-4" href="/course/#/courses/CSE 421?id=1">Introduction to Algorithms</a>
          <div>3 Credits</div>
          <h3 class="mb-0 d-inline align-middle h3">CSE 331</h3>
          <a class="d-block lead me-4" href="/course/#/courses/CSE 331?id=2">Software Design and Implementation</a>
          <div>4 Credits</div>
          <a href="/audit/#/degree">Audit Degree (DARS)</a>
          <a href="/audit/#/equivalency">Find CTC Transfer Equivalency</a>
        </main>
      `,
    });

    expect(record.source).toBe('myplan');
    expect(record.fit).toBe('derived_planning_substrate');
    expect(record.termCount).toBe(1);
    expect(record.planLabel).toBe('Spring 2026');
    expect(record.plannedCourseCount).toBe(2);
    expect(record.terms[0]?.termCode).toBe('sp26');
    expect(record.terms[0]?.termLabel).toBe('Spring 2026');
    expect(record.transferPlanningSummary).toContain('CTC transfer equivalency');
    expect(record.degreeProgressSummary).toContain('not exposed');
  });

  it('merges a DARS audit page into an existing planning substrate', () => {
    const record = buildMyPlanPlanningSubstrateFromHtml({
      url: 'https://myplan.uw.edu/audit/#/degree',
      capturedAt: '2026-04-11T12:05:00-07:00',
      previous: {
        id: 'myplan:planning-substrate:live',
        source: 'myplan',
        fit: 'derived_planning_substrate',
        readOnly: true,
        capturedAt: '2026-04-11T12:00:00-07:00',
        lastUpdatedAt: '2026-04-11T12:00:00-07:00',
        planId: 'myplan-live',
        planLabel: 'Spring 2026',
        termCount: 1,
        plannedCourseCount: 2,
        backupCourseCount: 0,
        scheduleOptionCount: 0,
        requirementGroupCount: 0,
        programExplorationCount: 0,
        degreeProgressSummary: 'Requirement progress is not exposed on this MyPlan planning page yet. Open Degree Audit (DARS) to capture requirement detail.',
        transferPlanningSummary: undefined,
        terms: [
          {
            termCode: 'sp26',
            termLabel: 'Spring 2026',
            plannedCourseCount: 2,
            backupCourseCount: 0,
            scheduleOptionCount: 0,
            summary: '2 visible planned course card(s) captured from the MyPlan planning page.',
          },
        ],
      },
      pageHtml: `
        <main>
          <h1>Audit a UW Degree Program (DARS)</h1>
          <h1>Bachelor of Science (Computer Science)</h1>
          <div class="audit-state">NOTE: At least one requirement still incomplete.</div>
          <div class="audit-requirement-totals">Earned: 106 credits In-progress: 14 credits Needs: 60 credits</div>
          <div class="audit-requirement requirement 180SUM Status_NO"></div>
          <div class="audit-requirement requirement UWGPA Status_NO"></div>
          <a href="/audit/#/equivalency">Find CTC Transfer Equivalency</a>
        </main>
      `,
    });

    expect(record.planLabel).toBe('Bachelor of Science (Computer Science)');
    expect(record.termCount).toBe(1);
    expect(record.plannedCourseCount).toBe(2);
    expect(record.requirementGroupCount).toBe(2);
    expect(record.degreeProgressSummary).toContain('At least one requirement still incomplete');
    expect(record.degreeProgressSummary).toContain('Earned: 106 credits');
  });
});
