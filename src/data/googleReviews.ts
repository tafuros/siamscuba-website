// Google reviews for the ambient background layer (AmbientReviews.tsx).
//
// These are decorative, faded background cards scattered across the homepage.
// PLACEHOLDERS - replace `text`/`name`/`country`/`date` with your real Google
// reviews (copy from your Google Business profile). Keep `text` short (~1-2
// lines) so the faded cards stay tidy. Add/remove freely; the layer cycles
// through whatever is here.

export type GoogleReview = {
  name: string;
  country: string; // flag emoji + country
  text: string;
  rating: number; // 1-5
  date: string; // e.g. "March 2026"
};

export const googleReviews: GoogleReview[] = [
  {
    name: "Emma W.",
    country: "🇬🇧 United Kingdom",
    text: "Best dive school on Koh Tao - tiny groups, the instructors actually care. Did my Open Water here and never felt rushed.",
    rating: 5,
    date: "May 2026",
  },
  {
    name: "Marco B.",
    country: "🇮🇹 Italy",
    text: "Professional, friendly and genuinely fun. The boats are beautiful and the 4:1 ratio makes a huge difference underwater.",
    rating: 5,
    date: "April 2026",
  },
  {
    name: "Sophie L.",
    country: "🇫🇷 France",
    text: "From the first message to the last dive everything was perfect. Patient instructors, great equipment, unforgettable.",
    rating: 5,
    date: "April 2026",
  },
  {
    name: "Daniel K.",
    country: "🇩🇪 Germany",
    text: "Got Advanced certified in three days. Small classes, real attention, and the Sail Rock trip was the highlight of Thailand.",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Ava T.",
    country: "🇦🇺 Australia",
    text: "Could not recommend Siam Scuba more. Felt safe the whole time and laughed all day - the nicest crew on the island.",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Noa P.",
    country: "🇮🇱 Israel",
    text: "First time diving and they made it so easy. Calm, clear, super welcoming. Already planning to come back for Divemaster.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "James R.",
    country: "🇺🇸 United States",
    text: "Outstanding. The personal attention you get here just doesn't exist at the bigger shops. Worth every baht.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Lena S.",
    country: "🇳🇱 Netherlands",
    text: "Amazing experience from start to finish. Beautiful reefs, brilliant instructors, and two gorgeous private boats.",
    rating: 5,
    date: "January 2026",
  },
  {
    name: "Carlos M.",
    country: "🇪🇸 Spain",
    text: "The flexible schedule let us dive around our trip. Friendly, relaxed, and seriously good in the water. Five stars.",
    rating: 5,
    date: "January 2026",
  },
  {
    name: "Yuki H.",
    country: "🇯🇵 Japan",
    text: "Such a warm little dive family. They remembered our names, our nerves, and made every dive special. Thank you!",
    rating: 5,
    date: "December 2025",
  },
];
