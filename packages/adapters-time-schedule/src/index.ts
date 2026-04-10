const ROOT_ORIGIN = 'https://www.washington.edu';

export const TIME_SCHEDULE_CARRIER_ORDER = [
  {
    carrier: 'public_course_offerings',
    posture: 'primary',
    rationale: 'official/public schedule surface first',
  },
  {
    carrier: 'netid_full_schedule_view',
    posture: 'secondary',
    rationale: 'NetID-required full schedule view is a richer follow-up lane, not the current shared landing default',
  },
  {
    carrier: 'dom_sln_detail_fallback',
    posture: 'fallback',
    rationale: 'DOM or SLN detail parsing is a last-resort field recovery path',
  },
] as const;

export const TIME_SCHEDULE_FIELD_DECISIONS = [
  {
    field: 'course_identity',
    status: 'proved',
    reason: 'subject/catalog/title are explicit in the public course header',
  },
  {
    field: 'section_identity',
    status: 'proved',
    reason: 'SLN plus section id are explicit in the public section row',
  },
  {
    field: 'meeting_day_time',
    status: 'proved',
    reason: 'meeting day/time are explicit in the public section row or its immediate continuation notes',
  },
  {
    field: 'location',
    status: 'partially_proved',
    reason: 'location can appear in note text, but it is not consistently a structured row column',
  },
  {
    field: 'modality',
    status: 'partially_proved',
    reason: 'modality is sometimes inferable from freeform note text only',
  },
  {
    field: 'registration_semantics',
    status: 'deferred',
    reason: 'seat watching, add/drop, and registration workflows remain outside the current limited read-only lane',
  },
  {
    field: 'watcher_style_fields',
    status: 'deferred',
    reason: 'status and enrollment columns must not become a watcher/helper contract in this wave',
  },
] as const;

export const TIME_SCHEDULE_PROMOTION_HOLDS = [
  'shared runtime landing is intentionally limited to the public course-offerings carrier, not full upstream Time Schedule parity',
  'registration-aware merge and registration workflows remain intentionally deferred beyond the limited read-only expansion lane',
  'note-derived modality/location need stronger proof before any broader shared field promotion',
] as const;

export interface ScheduleRootQuarterLink {
  quarter: string;
  netIdTimeScheduleUrl: string;
  publicCourseOfferingsUrl: string;
}

export interface ScheduleRootSnapshot {
  publicDisclosure: string;
  quarterLinks: ScheduleRootQuarterLink[];
}

export interface TimeScheduleBoundaryProof {
  fullScheduleRequiresNetId: boolean;
  publicCourseOfferingsAvailable: boolean;
  publicViewStatement: string;
  quarterLinks: Array<{
    quarterLabel: string;
    fullScheduleUrl: string;
    publicOfferingsUrl: string;
  }>;
}

export interface PublicCourseOfferingMeeting {
  days: string;
  rawTime: string;
  startTime?: string;
  endTime?: string;
  daysSource: 'row' | 'note';
  timeSource: 'row' | 'note';
  modality?: 'hybrid' | 'online' | 'remote_async' | 'remote_sync';
}

export interface PublicCourseOfferingSection {
  sectionIdentity: string;
  sectionId: string;
  sln: string;
  credits?: string;
  status: 'open' | 'closed' | 'unknown';
  meetingMode: 'scheduled' | 'arranged';
  meetingDays: string;
  timeText: string;
  daysSource: 'row' | 'note';
  timeSource: 'row' | 'note';
  locationText?: string;
  locationSource?: 'note';
  modality?: 'hybrid' | 'online' | 'remote_async' | 'remote_sync';
  noteLines: string[];
  meetings: PublicCourseOfferingMeeting[];
}

export interface PublicCourseOfferingCourse {
  courseKey: string;
  title: string;
  catalogUrl?: string;
  subject: string;
  catalogNumber: string;
  tags: string[];
  sections: PublicCourseOfferingSection[];
  offerings: PublicCourseOfferingSection[];
}

export interface PublicCourseOfferingsPage {
  carrier: 'public_course_offerings';
  quarter: string;
  department?: string;
  lastUpdatedText?: string;
  courses: PublicCourseOfferingCourse[];
  warnings: string[];
}

type ParsedCourseHeader = {
  anchor: string;
  courseKey: string;
  courseTitle: string;
  catalogUrl?: string;
  tags: string[];
  blockHtml: string;
};

function decodeEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripTags(input: string) {
  return decodeEntities(input).replace(/<[^>]+>/g, ' ');
}

function normalizeWhitespace(input: string) {
  return stripTags(input).replace(/\s+/g, ' ').trim();
}

function absoluteUrl(rawUrl: string) {
  return new URL(rawUrl, ROOT_ORIGIN).toString();
}

function parseStatus(line: string) {
  if (/\bOpen\b/i.test(line)) {
    return 'open' as const;
  }
  if (/\bClosed\b/i.test(line)) {
    return 'closed' as const;
  }
  return 'unknown' as const;
}

function parseCourseHeaders(html: string): ParsedCourseHeader[] {
  const headerRegex =
    /<table[^>]*bgcolor=["']#ccffcc["'][^>]*>\s*<tr>\s*<td width="50%">\s*<b>\s*<a name=(?<anchor>["']?[^"'>\s]+["']?)>(?<courseHtml>[\s\S]*?)<\/a>\s*&nbsp;\s*<a href=(?<href>["']?[^>\s]+["']?)>(?<titleHtml>[\s\S]*?)<\/a>\s*<\/b>\s*<\/td>\s*<td width="15%">\s*<b>(?<tagsHtml>[\s\S]*?)<\/b>\s*<\/td>[\s\S]*?<\/table>/gi;
  const matches = Array.from(html.matchAll(headerRegex));

  return matches.map((match, index) => {
    const currentIndex = match.index ?? 0;
    const nextIndex = matches[index + 1]?.index ?? html.length;
    const rawCourse = normalizeWhitespace(match.groups?.courseHtml ?? '');
    const tags = normalizeWhitespace(match.groups?.tagsHtml ?? '')
      .replace(/^\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    return {
      anchor: normalizeWhitespace(match.groups?.anchor ?? '').replace(/^["']|["']$/g, ''),
      courseKey: rawCourse,
      courseTitle: normalizeWhitespace(match.groups?.titleHtml ?? ''),
      catalogUrl: match.groups?.href
        ? absoluteUrl(match.groups.href.replace(/^["']|["']$/g, ''))
        : undefined,
      tags,
      blockHtml: html.slice(currentIndex, nextIndex),
    };
  });
}

function parseNoteLines(sectionHtml: string) {
  return decodeEntities(sectionHtml)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(1)
    .filter((line) => line !== '--');
}

function parseMeetingTokens(rawTail: string) {
  const statusIndex = rawTail.search(/\b(?:Open|Closed)\b/);
  const tail = statusIndex >= 0 ? rawTail.slice(0, statusIndex).trim() : rawTail.trim();
  const normalized = tail.replace(/\s+/g, ' ').trim();
  const arranged = /to be arranged/i.test(normalized);
  const timeMatch = normalized.match(/(?<days>MTWThF|MTWTh|MTW|TTh|MWF|MTWThF|MW|WF|Th|T|W|F)\s+(?<time>\d{3,4}-\d{3,4}[A-Z]?)/i);
  const creditMatch = normalized.match(/\b(\d+(?:[-/]\d+)?|VAR)\b/i);

  if (arranged) {
    return {
      credits: creditMatch?.[1],
      meetingMode: 'arranged' as const,
      meetingDays: 'to be arranged',
      timeText: 'to be arranged',
      daysSource: 'row' as const,
      timeSource: 'row' as const,
    };
  }

  if (timeMatch?.groups?.days && timeMatch.groups.time) {
    return {
      credits: creditMatch?.[1],
      meetingMode: 'scheduled' as const,
      meetingDays: timeMatch.groups.days,
      timeText: timeMatch.groups.time,
      daysSource: 'row' as const,
      timeSource: 'row' as const,
    };
  }

  return {
    credits: creditMatch?.[1],
    meetingMode: 'scheduled' as const,
    meetingDays: 'unknown',
    timeText: 'unknown',
    daysSource: 'row' as const,
    timeSource: 'row' as const,
  };
}

function parseExtraMeetings(noteLines: string[]) {
  return noteLines.flatMap((line) => {
    const match = line.match(/^(?<days>MTWThF|MTWTh|MTW|TTh|MWF|MW|WF|Th|T|W|F)\s+(?<time>\d{3,4}-\d{3,4}[A-Z]?)$/i);
    if (!match?.groups?.days || !match.groups.time) {
      return [];
    }
    const timeMatch = match.groups.time.match(/^(?<start>\d{3,4})-(?<end>\d{3,4}[A-Z]?)$/);
    return [
      {
        days: match.groups.days,
        rawTime: match.groups.time,
        startTime: timeMatch?.groups?.start,
        endTime: timeMatch?.groups?.end,
        daysSource: 'note' as const,
        timeSource: 'note' as const,
      },
    ];
  });
}

function inferLocation(noteLines: string[]) {
  const patterns = [
    /\bCLASS WILL BE IN ([A-Z]{2,5}\s+\d{2,4}[A-Z]?)\b/i,
    /\b(?:COURSE\s+)?MEETS IN ([A-Z]{2,5}\s+\d{2,4}[A-Z]?)\b/i,
    /\bIN ROOM ([A-Z]{2,5}\s+\d{2,4}[A-Z]?)\b/i,
  ];

  for (const line of noteLines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match?.[1]) {
        return match[1].trim();
      }
    }
  }

  return undefined;
}

function extractMeetingFromNotes(noteLines: string[]) {
  for (const line of noteLines) {
    const directMatch = line.match(
      /^MEETS\s+(?<days>[A-Z]+(?:DAYS)?|MONDAYS|TUESDAYS|WEDNESDAYS|THURSDAYS|FRIDAYS|SATURDAYS|SUNDAYS)\s+(?<time>\d{1,2}:\d{2}-\d{1,2}:\d{2}(?:\s*[AP]M)?)/i,
    );
    if (directMatch?.groups?.days && directMatch.groups.time) {
      return {
        days: directMatch.groups.days,
        timeText: directMatch.groups.time,
      };
    }

    const alternateMatch = line.match(
      /^WILL MEET\s+(?<days>[A-Z]+(?:DAYS)?|MONDAYS|TUESDAYS|WEDNESDAYS|THURSDAYS|FRIDAYS|SATURDAYS|SUNDAYS)\s+(?<time>\d{1,2}(?::\d{2})?-\d{1,2}(?::\d{2})?(?:\s*[AP]M)?)/i,
    );
    if (alternateMatch?.groups?.days && alternateMatch.groups.time) {
      return {
        days: alternateMatch.groups.days,
        timeText: alternateMatch.groups.time,
      };
    }
  }

  return undefined;
}

function inferModality(noteLines: string[]) {
  const joined = noteLines.join(' ').toUpperCase();
  if (!joined) {
    return undefined;
  }
  if (joined.includes('REMOTE') && joined.includes('IN-PERSON')) {
    return 'hybrid' as const;
  }
  if (joined.includes('ONLINE')) {
    return 'online' as const;
  }
  if (joined.includes('ASYNCHRONOUS REMOTE')) {
    return 'remote_async' as const;
  }
  if (joined.includes('SYNCHRONOUS REMOTE')) {
    return 'remote_sync' as const;
  }
  return undefined;
}

function splitTimeRange(timeText: string) {
  const match = timeText.match(/^(?<start>\d{3,4})-(?<end>\d{3,4}[A-Z]?)$/);
  return {
    startTime: match?.groups?.start,
    endTime: match?.groups?.end,
  };
}

function parseSection(sectionHtml: string, courseKey: string, warnings: string[]) {
  const lineText = normalizeWhitespace(sectionHtml);
  const prefixMatch = lineText.match(/^(?:(?:Restr|IS)\s+)?(?<sln>\d{5})\s+(?<sectionId>[A-Z0-9]+)\s+(?<tail>.+)$/i);
  if (!prefixMatch?.groups?.sln || !prefixMatch.groups.sectionId || !prefixMatch.groups.tail) {
    return undefined;
  }

  const noteLines = parseNoteLines(sectionHtml);
  const locationText = inferLocation(noteLines);
  const modality = inferModality(noteLines);
  const rowMeeting = parseMeetingTokens(prefixMatch.groups.tail);
  const noteMeeting = extractMeetingFromNotes(noteLines);
  const primaryMeetingDays = noteMeeting?.days ?? rowMeeting.meetingDays;
  const primaryTimeText = noteMeeting?.timeText ?? rowMeeting.timeText;
  const primaryDaysSource = noteMeeting ? ('note' as const) : rowMeeting.daysSource;
  const primaryTimeSource = noteMeeting ? ('note' as const) : rowMeeting.timeSource;
  const primaryMeetingTime = splitTimeRange(primaryTimeText === 'to be arranged' ? '' : primaryTimeText);
  const meetings: PublicCourseOfferingMeeting[] = [
    {
      days: primaryMeetingDays,
      rawTime: primaryTimeText,
      startTime: primaryMeetingTime.startTime,
      endTime: primaryMeetingTime.endTime,
      daysSource: primaryDaysSource,
      timeSource: primaryTimeSource,
      modality,
    },
    ...parseExtraMeetings(noteLines),
  ];

  if (locationText) {
    warnings.push(`location_can_be_note_derived:${courseKey}:${prefixMatch.groups.sectionId}`);
  }
  if (modality) {
    warnings.push(`modality_is_note_derived:${courseKey}:${prefixMatch.groups.sectionId}`);
  }

  return {
    sectionIdentity: `${courseKey}:${prefixMatch.groups.sectionId}:${prefixMatch.groups.sln}`,
    sectionId: prefixMatch.groups.sectionId,
    sln: prefixMatch.groups.sln,
    credits: rowMeeting.credits,
    status: parseStatus(lineText),
    meetingMode: rowMeeting.meetingMode,
    meetingDays: primaryMeetingDays,
    timeText: primaryTimeText,
    daysSource: primaryDaysSource,
    timeSource: primaryTimeSource,
    locationText,
    locationSource: locationText ? ('note' as const) : undefined,
    modality,
    noteLines,
    meetings,
  } satisfies PublicCourseOfferingSection;
}

export function extractScheduleRootSnapshot(html: string): ScheduleRootSnapshot {
  const publicDisclosure = normalizeWhitespace(
    html.match(/<p>(?<content>[\s\S]*?Course Offerings pages allow[\s\S]*?)<\/p>/i)?.groups?.content ?? '',
  );

  const quarterLinks = Array.from(
    html.matchAll(
      /<li>[\s\S]*?(?<quarter>(?:Winter|Spring|Summer|Autumn)\s+Quarter\s+\d{4})[\s\S]*?<a href="(?<netid>[^"]+)">Time Schedule View[^<]*<\/a>[\s\S]*?<a href="(?<public>[^"]+)">Course Offerings View<\/a>[\s\S]*?<\/li>/gi,
    ),
  ).map((match) => ({
    quarter: normalizeWhitespace(match.groups?.quarter ?? ''),
    netIdTimeScheduleUrl: absoluteUrl(match.groups?.netid ?? '/'),
    publicCourseOfferingsUrl: absoluteUrl(match.groups?.public ?? '/'),
  }));

  return {
    publicDisclosure,
    quarterLinks,
  };
}

export function parseTimeScheduleBoundaryHtml(html: string, _sourceUrl: string): TimeScheduleBoundaryProof {
  const snapshot = extractScheduleRootSnapshot(html);
  return {
    fullScheduleRequiresNetId: /require a NetID to view/i.test(snapshot.publicDisclosure),
    publicCourseOfferingsAvailable: /limited view/i.test(snapshot.publicDisclosure),
    publicViewStatement: snapshot.publicDisclosure,
    quarterLinks: snapshot.quarterLinks.map((entry) => ({
      quarterLabel: entry.quarter,
      fullScheduleUrl: entry.netIdTimeScheduleUrl,
      publicOfferingsUrl: entry.publicCourseOfferingsUrl,
    })),
  };
}

export function extractPublicCourseOfferingsPage(html: string): PublicCourseOfferingsPage {
  const warnings: string[] = [];
  const courses = parseCourseHeaders(html).map((header) => {
    const sectionRegex = /<table[^>]*width="100%"[^>]*>\s*<tr>\s*<td>\s*<pre>([\s\S]*?)<\/td>\s*<\/tr>\s*<\/table>/gi;
    const sections: PublicCourseOfferingSection[] = [];
    for (const match of Array.from(header.blockHtml.matchAll(sectionRegex))) {
      const parsedSection = parseSection(match[1] ?? '', header.courseKey, warnings);
      if (parsedSection) {
        sections.push(parsedSection);
      }
    }

    return {
      courseKey: header.courseKey,
      title: header.courseTitle,
      catalogUrl: header.catalogUrl,
      subject: header.courseKey.split(' ')[0],
      catalogNumber: header.courseKey.split(' ').slice(1).join(' '),
      tags: header.tags,
      sections,
      offerings: sections,
    } satisfies PublicCourseOfferingCourse;
  });

  return {
    carrier: 'public_course_offerings',
    quarter: normalizeWhitespace(html.match(/<h1>\s*(?<quarter>[^<]+?)\s+Course Offerings\s*<\/h1>/i)?.groups?.quarter ?? ''),
    department: normalizeWhitespace(
      html.match(/<h2>\s*(?<department>[\s\S]*?)<\/h2>/i)?.groups?.department ?? '',
    ) || undefined,
    lastUpdatedText:
      normalizeWhitespace(
        html.match(/\(<b>(?<stamp>[^<]+)<\/b>\)\s+but may have changed since then\./i)?.groups?.stamp ?? '',
      ) || undefined,
    courses,
    warnings,
  };
}

export function extractPublicCourseOfferingsPrototype(input: {
  html: string;
  sourceUrl: string;
  quarterLabel: string;
}) {
  const page = extractPublicCourseOfferingsPage(input.html);
  const events = page.courses.flatMap((course) =>
    course.sections.map((section) => ({
      sectionIdentity: section.sectionIdentity,
      courseKey: course.courseKey,
      courseTitle: course.title,
      sectionCode: section.sectionId,
      sln: section.sln,
      meetingPatternText:
        section.meetingMode === 'arranged'
          ? 'to be arranged'
          : `${section.meetingDays} ${section.timeText}`.trim(),
      modality:
        section.modality === 'hybrid'
          ? 'mixed'
          : section.modality,
      location: section.locationText,
    })),
  );

  return {
    carrier: 'public-course-offerings-view',
    quarterLabel: input.quarterLabel,
    sourceUrl: input.sourceUrl,
    courses: page.courses.map((course) => ({
      courseKey: course.courseKey,
      courseTitle: course.title,
      tags: course.tags,
      offerings: course.sections.map((section) => ({
        sectionCode: section.sectionId,
        sln: section.sln,
        credits: section.credits,
        status: section.status,
        location: section.locationText,
        modality: section.modality === 'hybrid' ? 'mixed' : section.modality,
        meetings: section.meetings.map((meeting) => ({
          days: meeting.days,
          rawTime: meeting.rawTime,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          modality: meeting.modality === 'hybrid' ? 'mixed' : meeting.modality,
        })),
      })),
    })),
    events,
    warnings: page.warnings,
  };
}
