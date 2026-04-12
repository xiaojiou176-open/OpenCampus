import type { AdminCarrierRecord } from '@campus-copilot/storage';

function stripHtml(value: string | undefined) {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFirstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return stripHtml(match?.[1]);
}

function detectAdminCarrierFamily(url: string) {
  const normalized = url.toLowerCase();
  if (normalized.includes('untranscript.aspx')) {
    return 'transcript' as const;
  }
  if (normalized.includes('finaidstatus.aspx')) {
    return 'finaid' as const;
  }
  if (normalized.includes('/accounts')) {
    return 'accounts' as const;
  }
  if (normalized.includes('tuition.aspx')) {
    return 'tuition_detail' as const;
  }
  return undefined;
}

function buildTranscriptCarrier(pageHtml: string, url: string, now: string): AdminCarrierRecord {
  const classValue = extractFirstMatch(pageHtml, /<th>Class<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
  const majorValue = extractFirstMatch(pageHtml, /<th>Major<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
  const transferCredits = extractFirstMatch(pageHtml, /TOTAL CREDITS EARNED:\s*([0-9.]+)/i);
  const cumulativeGpa = extractFirstMatch(pageHtml, /CUM GPA:\s*([0-9.]+)/i);
  const standing = extractFirstMatch(pageHtml, /ACADEMIC STANDING:\s*([A-Z ]+)/i);
  const workInProgress = extractFirstMatch(pageHtml, /WORK IN PROGRESS[\s\S]*?QTR REGISTERED:\s*([0-9.]+)/i);

  return {
    id: 'admin-carrier:transcript',
    family: 'transcript',
    title: 'Unofficial transcript',
    summary: `Transcript summary shows class ${classValue || 'unknown'}, major ${majorValue || 'unknown'}, total credits earned ${transferCredits || 'unknown'}, cumulative GPA ${cumulativeGpa || 'unknown'}, standing ${standing || 'unknown'}, and ${workInProgress || 'unknown'} credits currently in progress.`,
    sourceSurface: 'myuw',
    sourceUrl: url,
    authoritySource: 'sdb.admin unofficial transcript page',
    importance: 'high',
    aiDefault: 'blocked',
    nextAction: 'Review or export the transcript summary before any AI analysis.',
    updatedAt: now,
  };
}

function buildFinaidCarrier(pageHtml: string, url: string, now: string): AdminCarrierRecord {
  const messagesCount = extractFirstMatch(pageHtml, /Messages\s*\((\d+)\)/i);
  const mainStatus =
    extractFirstMatch(pageHtml, /<b[^>]*>([\s\S]*?)<\/b>/i) ||
    extractFirstMatch(pageHtml, /Aid status summary[\s\S]*?processing support\./i) ||
    'Financial aid application status is visible on the current page.';
  const totalPrincipal =
    extractFirstMatch(pageHtml, /Total borrowing[\s\S]*?\$([0-9,]+)/i) ||
    extractFirstMatch(pageHtml, /Total Educational Borrowing[\s\S]*?\$([0-9,]+)/i);
  const monthlyPayment =
    extractFirstMatch(pageHtml, /Estimated monthly payment[\s\S]*?\$([0-9,]+)/i) ||
    extractFirstMatch(pageHtml, /Estimated Monthly Loan Payment[\s\S]*?\$([0-9,]+)/i);

  return {
    id: 'admin-carrier:finaid',
    family: 'finaid',
    title: 'Financial aid status',
    summary: `Financial aid summary shows ${messagesCount || 'unknown'} message(s); current status says "${mainStatus}". Estimated total borrowing is $${totalPrincipal || 'unknown'} with estimated monthly repayment $${monthlyPayment || 'unknown'}.`,
    sourceSurface: 'myuw',
    sourceUrl: url,
    authoritySource: 'sdb.admin financial aid status page',
    importance: 'high',
    aiDefault: 'blocked',
    nextAction: 'Review or export the financial-aid summary before any AI analysis.',
    updatedAt: now,
  };
}

function buildAccountsCarrier(pageHtml: string, url: string, now: string): AdminCarrierRecord[] {
  const amountDue =
    extractFirstMatch(pageHtml, /Amount Due[\s\S]*?\$\s*([0-9.,]+)/i) ||
    extractFirstMatch(pageHtml, /Billing overview[\s\S]*?\$\s*([0-9.,]+)/i);
  const huskyStatus =
    extractFirstMatch(pageHtml, /Eligibility[\s\S]*?Status[\s\S]*?<li[^>]*>([\s\S]*?)<\/li>/i) ||
    extractFirstMatch(pageHtml, /Eligibility Status[\s\S]*?<li[^>]*>([\s\S]*?)<\/li>/i);
  const huskyAccount =
    extractFirstMatch(pageHtml, /Account Balance[\s\S]*?\$\s*([0-9.,]+)/i) ||
    extractFirstMatch(pageHtml, /Student Husky Account[\s\S]*?\$\s*([0-9.,]+)/i);
  const libraryHeader = /(Library Account|Library)/i.test(pageHtml) ? 'present' : 'missing';

  return [
    {
      id: 'admin-carrier:tuition-detail',
      family: 'tuition_detail',
      title: 'Tuition and fees summary',
      summary: `Accounts page shows billing overview amount due $${amountDue || 'unknown'} and a direct tuition statement handoff for deeper review.`,
      sourceSurface: 'myuw',
      sourceUrl: url,
      authoritySource: 'myuw accounts tuition card',
      importance: 'high',
      aiDefault: 'blocked',
      nextAction: 'Review or export the tuition summary before any AI analysis.',
      updatedAt: now,
    },
    {
      id: 'admin-carrier:accounts',
      family: 'accounts',
      title: 'Accounts summary',
      summary: `Accounts page shows eligibility ${huskyStatus || 'unknown'}, account balance $${huskyAccount || 'unknown'}, and library panel ${libraryHeader}.`,
      sourceSurface: 'myuw',
      sourceUrl: url,
      authoritySource: 'myuw accounts page cards',
      importance: 'medium',
      aiDefault: 'blocked',
      nextAction: 'Use export-first review for account-state details.',
      updatedAt: now,
    },
  ];
}

export function extractAdminCarriersFromPageHtml(input: {
  url: string;
  pageHtml?: string;
  now: string;
}): AdminCarrierRecord[] {
  if (!input.pageHtml?.trim()) {
    return [];
  }

  const family = detectAdminCarrierFamily(input.url);
  if (!family) {
    return [];
  }

  if (family === 'transcript') {
    return [buildTranscriptCarrier(input.pageHtml, input.url, input.now)];
  }
  if (family === 'finaid') {
    return [buildFinaidCarrier(input.pageHtml, input.url, input.now)];
  }
  if (family === 'accounts') {
    return buildAccountsCarrier(input.pageHtml, input.url, input.now);
  }
  return [
    {
      id: 'admin-carrier:tuition-detail',
      family: 'tuition_detail',
      title: 'Tuition statement summary',
      summary: 'Tuition statement page is open and ready for export-first review.',
      sourceSurface: 'myuw',
      sourceUrl: input.url,
      authoritySource: 'sdb.admin tuition statement page',
      importance: 'high',
      aiDefault: 'blocked',
      nextAction: 'Review or export the tuition statement summary before any AI analysis.',
      updatedAt: input.now,
    },
  ];
}
