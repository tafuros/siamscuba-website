import { useEffect, useState } from "react";
import { nextInstructorExam, type NextExam } from "@/data/goPro";

/**
 * Resolution state for the next Instructor Examination.
 *
 * "pending" and "none" MUST stay distinguishable. Collapsing them into a single
 * null is a real bug: the prerendered HTML renders before any clock is read, so
 * a null-means-none UI tells every crawler and no-JS visitor that the exam
 * season has finished - all year round.
 */
export type NextExamState =
  | { status: "pending"; exam: null }
  | { status: "resolved"; exam: NextExam | null };

/**
 * The next Instructor Examination, resolved on the client.
 *
 * WHY IT IS NOT COMPUTED DURING RENDER
 * The site is prerendered by vite-react-ssg. A date read from the clock while
 * rendering would be the CLOCK AT BUILD TIME, baked into the static HTML: the
 * homepage would cheerfully announce "in 2 days" for weeks after that stopped
 * being true, on the exact page where we claim to be professionals.
 *
 * Resolving it in an effect means the prerendered markup carries no computed
 * date (so it cannot go stale), the real one appears on the client, and both
 * agree on the first paint - no hydration mismatch.
 *
 * While pending, callers still render the real schedule from IE_SCHEDULE - it
 * is static, true, and worth having in the HTML for search engines. Only the
 * "which one is next" highlight and the countdown wait for the client.
 */
export function useNextExam(): NextExamState {
  const [state, setState] = useState<NextExamState>({ status: "pending", exam: null });

  useEffect(() => {
    setState({ status: "resolved", exam: nextInstructorExam(new Date()) });
  }, []);

  return state;
}
