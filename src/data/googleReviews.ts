// Google reviews for the ambient background layer (AmbientReviews.tsx).
//
// These are decorative, faded background cards scattered across the homepage.
// Real reviews from the Siam Scuba Google Business profile, lightly trimmed to
// 1-2 lines so the faded cards stay tidy. Keep `text` short. Add/remove freely;
// the layer cycles through whatever is here.

export type GoogleReview = {
  name: string;
  country: string; // flag emoji + country
  text: string;
  rating: number; // 1-5
  date: string; // e.g. "March 2026"
};

export const googleReviews: GoogleReview[] = [
  {
    name: "Sipra K.",
    country: "🇳🇵 Nepal",
    text: "Did my Open Water here with the most amazing instructor - so much learning, with so much love, care and patience. Highly recommend!",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Alon S.",
    country: "🇮🇱 Israel",
    text: "This dive center is incredible. The level of professionalism is unmatched, yet they keep the vibes so much fun and full of energy.",
    rating: 5,
    date: "June 2026",
  },
  {
    name: "Morganne V.",
    country: "🇧🇪 Belgium",
    text: "Had the best time doing my refresh and advanced course - great experience, great hospitality, funny, friendly and very professional staff!",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Hod M.",
    country: "🇮🇱 Israel",
    text: "Finished my first and second star here - amazing, amazing and caring people. I enjoyed every single moment.",
    rating: 5,
    date: "June 2026",
  },
  {
    name: "Lea C.",
    country: "🇫🇷 France",
    text: "Had the best time ever learning my PADI Open Water with Kate, she's the best! I felt safe and so much more confident in my diving.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Noam G.",
    country: "🇮🇱 Israel",
    text: "Amazing experience with Siam Scuba! 2 dives in 2 beautiful dive sites, with a lot of colourful fish and corals. Really recommend!",
    rating: 5,
    date: "June 2026",
  },
  {
    name: "Mariana R.",
    country: "🇲🇽 Mexico",
    text: "John was a very good instructor, responsible, and explained everything very well. Diving with this center was 10/10! Incredible experience.",
    rating: 5,
    date: "November 2025",
  },
  {
    name: "Idan E.",
    country: "🇮🇱 Israel",
    text: "Thank you for a fun and educational experience. Did a fun dive and refresh with Lea - she was awesome, responsible and patient.",
    rating: 5,
    date: "May 2026",
  },
  {
    name: "Sophie L.",
    country: "🇬🇧 United Kingdom",
    text: "Had the best time learning to dive with John! We really valued his patient teaching style and felt safe and at ease the whole time.",
    rating: 5,
    date: "June 2026",
  },
  {
    name: "Racheli A.",
    country: "🇮🇱 Israel",
    text: "Went for an introductory dive, a little worried as it was my first time. The team was simply amazing - patient and supportive. Unforgettable!",
    rating: 5,
    date: "May 2026",
  },
];
