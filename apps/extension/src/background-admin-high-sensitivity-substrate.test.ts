import { describe, expect, it } from 'vitest';
import { extractAdminCarriersFromPageHtml } from './background-admin-high-sensitivity-substrate';

const transcriptHtml = `
  <html><head><title>Academic record summary</title></head><body>
    <th>Class</th><td>Level 4</td><th>Major</th><td>redacted-major</td>
    TOTAL CREDITS EARNED: 101.0 GPA:4.00
    CUM GPA: 0.84
    ACADEMIC STANDING: GOOD STANDING
    WORK IN PROGRESS QTR REGISTERED: 14.0
  </body></html>
`;

const finaidHtml = `
  <html><head><title>Support summary</title></head><body>
    <span>Messages (5)</span>
    <b>Aid status summary: redacted-status-message while we continue processing support.</b>
    <span>Total borrowing</span><span>$15,000</span>
    <span>Estimated monthly payment</span><span>$167</span>
  </body></html>
`;

const accountsHtml = `
  <html><head><title>Administrative summary</title></head><body>
    <h2>Tuition &amp; Fees</h2>
    <h3>Billing overview</h3><span>$ 0</span><div>Amount Due</div><a href="https://example.invalid/redacted-tuition-statement">Tuition Statement</a>
    <h2>Eligibility</h2><h3>Status</h3><li>eligible</li>
    <h2>Account summary</h2><h3>Account Balance</h3><span>$0.00</span>
    <h2>Library</h2>
  </body></html>
`;

describe('background admin high-sensitivity substrate', () => {
  it('extracts a transcript summary carrier from transcript html', () => {
    const records = extractAdminCarriersFromPageHtml({
      url: 'https://example.invalid/redacted/untranscript.aspx',
      pageHtml: transcriptHtml,
      now: '2026-04-11T12:00:00-07:00',
    });

    expect(records).toHaveLength(1);
    expect(records[0]?.family).toBe('transcript');
    expect(records[0]?.summary).toContain('101.0');
    expect(records[0]?.summary).toContain('0.84');
  });

  it('extracts a financial-aid summary carrier from finaid html', () => {
    const records = extractAdminCarriersFromPageHtml({
      url: 'https://example.invalid/redacted/finaidstatus.aspx',
      pageHtml: finaidHtml,
      now: '2026-04-11T12:00:00-07:00',
    });

    expect(records).toHaveLength(1);
    expect(records[0]?.family).toBe('finaid');
    expect(records[0]?.summary).toContain('5 message');
    expect(records[0]?.summary).toContain('$15,000');
  });

  it('extracts accounts and tuition-detail carriers from accounts html', () => {
    const records = extractAdminCarriersFromPageHtml({
      url: 'https://example.invalid/accounts/',
      pageHtml: accountsHtml,
      now: '2026-04-11T12:00:00-07:00',
    });

    expect(records.map((record) => record.family).sort()).toEqual(['accounts', 'tuition_detail']);
    expect(records.find((record) => record.family === 'accounts')?.summary).toContain('eligible');
    expect(records.find((record) => record.family === 'tuition_detail')?.summary).toContain('$0');
  });
});
