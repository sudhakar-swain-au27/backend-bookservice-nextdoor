import { DateTime } from 'luxon';

// NOTE: luxon is used here for clearer timezone handling. If not installed,
// either add it to package.json or replace with native Date logic.

function parseTimeToDate(dateISO, timeStr, zone = 'UTC') {
  // dateISO: '2026-06-10' timeStr: '09:30'
  const [hour, minute] = timeStr.split(':').map((s) => parseInt(s, 10));
  return DateTime.fromISO(dateISO, { zone }).set({ hour, minute, second: 0, millisecond: 0 });
}

export function generateSlotsForDate({ workingHours = [], slotDuration = 30, timezone = 'UTC', blockedDates = [] }, dateISO, existingBookings = [], maxConcurrent = 1) {
  // dateISO: 'YYYY-MM-DD'
  const dayOfWeek = DateTime.fromISO(dateISO, { zone: timezone }).weekday % 7; // Luxon: 1=Mon..7=Sun; convert to 0=Sun..6
  const targetDay = dayOfWeek; // 0-6 where 0=Sunday

  // Find working hours for the day
  const dayHours = workingHours.find((w) => w.day === targetDay);
  if (!dayHours || dayHours.isClosed) return [];

  // Check blockedDates
  const isBlocked = (blockedDates || []).some((b) => {
    if (!b || !b.date) return false;
    const d = DateTime.fromJSDate(new Date(b.date)).toISODate();
    return d === dateISO;
  });
  if (isBlocked) return [];

  const open = dayHours.open; // '09:00'
  const close = dayHours.close; // '17:00'
  if (!open || !close) return [];

  const startDT = parseTimeToDate(dateISO, open, timezone);
  const endDT = parseTimeToDate(dateISO, close, timezone);

  const slots = [];
  let cursor = startDT;
  while (cursor.plus({ minutes: slotDuration }) <= endDT) {
    const slotStart = cursor;
    const slotEnd = cursor.plus({ minutes: slotDuration });

    // Check breaks
    const inBreak = (dayHours.breaks || []).some((b) => {
      if (!b.start || !b.end) return false;
      const breakStart = parseTimeToDate(dateISO, b.start, timezone);
      const breakEnd = parseTimeToDate(dateISO, b.end, timezone);
      return !(slotEnd <= breakStart || slotStart >= breakEnd);
    });
    if (inBreak) {
      cursor = cursor.plus({ minutes: slotDuration });
      continue;
    }

    // Count existing overlapping bookings
    const overlapping = existingBookings.filter((bk) => {
      const bStart = DateTime.fromJSDate(new Date(bk.slot.start)).setZone(timezone);
      const bEnd = bk.slot.end ? DateTime.fromJSDate(new Date(bk.slot.end)).setZone(timezone) : bStart.plus({ minutes: slotDuration });
      return !(slotEnd <= bStart || slotStart >= bEnd);
    }).length;

    if (overlapping < maxConcurrent) {
      slots.push({ start: slotStart.toISO(), end: slotEnd.toISO() });
    }

    cursor = cursor.plus({ minutes: slotDuration });
  }

  return slots;
}

export default generateSlotsForDate;
