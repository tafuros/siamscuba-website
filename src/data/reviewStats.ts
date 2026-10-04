/**
 * Review ratings and counts - ONE place for the numbers the new review strip
 * and course pages show.
 *
 * Checked on the live profiles 2026-10-04 (Ben asked): Google 4.9 from 954
 * reviews, TripAdvisor 4.9 from 796. The site had quoted 845 / 854 and a
 * TripAdvisor 5.0 with 776 / 778 - all updated the same day. A few older pages
 * keep their own copy of these numbers in their copy files.
 */
export const REVIEW_STATS = {
  google: {
    rating: 4.9,
    count: 954,
    url: "https://maps.app.goo.gl/U3JzU7fcJsdqVR768",
  },
  tripadvisor: {
    rating: 4.9,
    count: 796,
    url: "https://www.tripadvisor.com/Attraction_Review-g303910-d2385121-Reviews-Siam_Scuba-Koh_Tao_Surat_Thani_Province.html",
  },
} as const;
