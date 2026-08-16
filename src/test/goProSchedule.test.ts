import { describe, it, expect } from "vitest";
import {
  IE_SCHEDULE,
  IE_SCHEDULE_YEAR,
  nextInstructorExam,
  formatExamDate,
} from "@/data/goPro";

/**
 * The homepage banner publishes these dates as a promise, so the thing that
 * must never break is the "next exam" arithmetic - a wrong date on the page
 * where we claim to be professionals is worse than no date at all.
 */
describe("go-pro instructor exam schedule", () => {
  const Y = IE_SCHEDULE_YEAR;

  it("has a complete, ordered April-December season", () => {
    expect(IE_SCHEDULE).toHaveLength(9);
    expect(IE_SCHEDULE.map((e) => e.month)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const e of IE_SCHEDULE) {
      expect(e.examDay).toBeGreaterThan(0);
      expect(e.examDay).toBeLessThanOrEqual(31);
    }
  });

  it("picks the next exam from a mid-season date", () => {
    // 10 August -> the 18 August exam.
    const next = nextInstructorExam(new Date(Y, 7, 10));
    expect(next).not.toBeNull();
    expect(next!.entry.month).toBe(8);
    expect(next!.examDate.getDate()).toBe(18);
    expect(next!.daysAway).toBe(8);
  });

  it("still counts the exam on the day it happens", () => {
    const next = nextInstructorExam(new Date(Y, 7, 18));
    expect(next!.entry.month).toBe(8);
    expect(next!.daysAway).toBe(0);
  });

  it("rolls to the following month once an exam has passed", () => {
    // 19 August is one day after August's exam -> September.
    const next = nextInstructorExam(new Date(Y, 7, 19));
    expect(next!.entry.month).toBe(9);
    expect(next!.examDate.getDate()).toBe(22);
  });

  it("returns the first exam of the season from before it starts", () => {
    // February - the season has not begun.
    const next = nextInstructorExam(new Date(Y, 1, 1));
    expect(next!.entry.month).toBe(4);
  });

  it("returns null after the last exam instead of inventing next year", () => {
    // The day numbers are pinned to weekdays and do not carry over, so rolling
    // into an unpublished year would print a wrong date. Null lets the UI say
    // "message us for next year's dates".
    expect(nextInstructorExam(new Date(Y, 11, 16))).toBeNull();
    expect(nextInstructorExam(new Date(Y + 1, 0, 5), Y)).toBeNull();
  });

  it("keeps December's refresher in the previous month", () => {
    // Prep starts 28 November for a 1 December IDC - the one entry that spans
    // a month boundary, and the one most likely to be mis-rendered.
    const december = IE_SCHEDULE.find((e) => e.month === 12)!;
    expect(december.prepMonthOffset).toBe(-1);
    expect(december.prepDay).toBe(28);
    const next = nextInstructorExam(new Date(Y, 10, 25));
    expect(next!.entry.month).toBe(12);
    expect(next!.idcDate.getMonth()).toBe(10); // November, not December
    expect(next!.idcDate.getDate()).toBe(1);
  });

  it("is not affected by the time of day", () => {
    const morning = nextInstructorExam(new Date(Y, 7, 18, 6, 0));
    const night = nextInstructorExam(new Date(Y, 7, 18, 23, 59));
    expect(morning!.daysAway).toBe(0);
    expect(night!.daysAway).toBe(0);
  });

  it("formats the exam date per language", () => {
    const d = new Date(Y, 7, 18);
    expect(formatExamDate(d, "en")).toMatch(/18/);
    expect(formatExamDate(d, "en")).toMatch(/August/i);
    expect(formatExamDate(d, "es")).toMatch(/agosto/i);
    expect(formatExamDate(d, "fr")).toMatch(/août/i);
  });
});
