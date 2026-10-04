/**
 * Review ratings and counts - ONE place for the numbers the new review strip
 * and course pages show.
 *
 * PENDING BEN (2026-10-04): the site quoted conflicting figures (TripAdvisor
 * 4.9 / 5.0 with 776 / 778 reviews, Google 845 / 854). These are the most
 * common live values until Ben confirms the current ones; then change them
 * here only. Older pages still carry their own copies of the numbers.
 */
export const REVIEW_STATS = {
  google: {
    rating: 4.9,
    count: 845,
    url: "https://maps.app.goo.gl/U3JzU7fcJsdqVR768",
  },
  tripadvisor: {
    rating: 5.0,
    count: 776,
    url: "https://www.tripadvisor.com/Attraction_Review-g303910-d2385121-Reviews-Siam_Scuba-Koh_Tao_Surat_Thani_Province.html",
  },
} as const;
