import type { EntityRef } from '@campus-copilot/schema';
import { WeeklyLoadEntrySchema, type WeeklyLoadEntry } from './contracts';
import { campusCopilotDb, type CampusCopilotDB } from './db';
import {
  endOfUtcDay,
  isAssignmentOpen,
  isOverlayDismissed,
  isOverlaySnoozed,
  isPast,
  isWithinUpcomingHours,
  startOfUtcDay,
  toDateKey,
  toEntityRef,
} from './storage-shared';

export async function getWeeklyLoad(now: string, db: CampusCopilotDB = campusCopilotDb): Promise<WeeklyLoadEntry[]> {
  const [assignments, events, overlays] = await Promise.all([
    db.assignments.toArray(),
    db.events.toArray(),
    db.local_entity_overlay.toArray(),
  ]);
  const overlayMap = new Map(overlays.map((overlay) => [overlay.entityId, overlay]));
  const bucketStarts = Array.from({ length: 7 }, (_, index) => startOfUtcDay(now, index));
  const buckets = bucketStarts.map((start) => {
    return {
      dateKey: start.toISOString().slice(0, 10),
      startsAt: start.toISOString(),
      endsAt: endOfUtcDay(start).toISOString(),
      assignmentCount: 0,
      eventCount: 0,
      overdueCount: 0,
      dueSoonCount: 0,
      pinnedCount: 0,
      totalScore: 0,
      items: [] as EntityRef[],
    };
  });
  const bucketMap = new Map(buckets.map((bucket) => [bucket.dateKey, bucket]));
  const todayBucket = buckets[0];

  for (const assignment of assignments) {
    if (!isAssignmentOpen(assignment)) {
      continue;
    }

    const overlay = overlayMap.get(assignment.id);
    if (isOverlayDismissed(overlay, now)) {
      continue;
    }
    if (isOverlaySnoozed(overlay, now) && !overlay?.pinnedAt) {
      continue;
    }
    if (!assignment.dueAt) {
      continue;
    }

    const bucketKey = isPast(assignment.dueAt, now) ? todayBucket.dateKey : toDateKey(assignment.dueAt);
    const bucket = bucketMap.get(bucketKey);
    if (!bucket) {
      continue;
    }

    bucket.assignmentCount += 1;
    bucket.items.push(toEntityRef(assignment));
    if (overlay?.pinnedAt) {
      bucket.pinnedCount += 1;
      bucket.totalScore += 120;
    }
    if (isPast(assignment.dueAt, now)) {
      bucket.overdueCount += 1;
      bucket.totalScore += assignment.status === 'missing' ? 260 : 230;
    } else if (isWithinUpcomingHours(assignment.dueAt, now, 48)) {
      bucket.dueSoonCount += 1;
      bucket.totalScore += assignment.status === 'missing' ? 210 : 180;
    } else {
      bucket.totalScore += 90;
    }
  }

  for (const event of events) {
    const overlay = overlayMap.get(event.id);
    if (isOverlayDismissed(overlay, now)) {
      continue;
    }
    if (isOverlaySnoozed(overlay, now) && !overlay?.pinnedAt) {
      continue;
    }

    const eventAt = event.startAt ?? event.endAt;
    if (!eventAt) {
      continue;
    }

    const bucketKey = isPast(eventAt, now) ? todayBucket.dateKey : toDateKey(eventAt);
    const bucket = bucketMap.get(bucketKey);
    if (!bucket) {
      continue;
    }

    bucket.eventCount += 1;
    bucket.items.push(toEntityRef(event));
    bucket.totalScore += overlay?.pinnedAt ? 70 : 40;
    if (overlay?.pinnedAt) {
      bucket.pinnedCount += 1;
    }
  }

  return buckets.map((bucket) => {
    const highlights: string[] = [];
    if (bucket.overdueCount > 0) {
      highlights.push(`${bucket.overdueCount} 个已逾期`);
    }
    if (bucket.dueSoonCount > 0) {
      highlights.push(`${bucket.dueSoonCount} 个 48 小时内到期`);
    }
    if (bucket.pinnedCount > 0) {
      highlights.push(`${bucket.pinnedCount} 个手动置顶`);
    }
    if (bucket.eventCount > 0) {
      highlights.push(`${bucket.eventCount} 个日程节点`);
    }

    const loadBand =
      bucket.totalScore >= 200
        ? '高负荷'
        : bucket.totalScore >= 120
          ? '中等负荷'
          : bucket.totalScore > 0
            ? '轻负荷'
            : '空档';
    const summary =
      highlights.length > 0
        ? `${loadBand}：${highlights.join('，')}。`
        : `${loadBand}：当前没有新的计划压力。`;

    return WeeklyLoadEntrySchema.parse({
      ...bucket,
      summary,
      highlights,
    });
  });
}
