// Per-course SEO meta. Title pattern: "PADI [Course] Course Koh Tao | Siam Scuba"
// Description: 150-160 chars, course-specific selling points (group size, duration, price).

export interface CourseSeo {
  title: string;
  description: string;
}

export const COURSE_SEO: Record<string, CourseSeo> = {
  "discover-scuba": {
    title: "Discover Scuba Diving in Koh Tao – Try Diving | Siam Scuba",
    description:
      "Try scuba diving in Koh Tao with no experience needed. One-day intro with PADI instructor: pool training plus 1-2 ocean dives in calm tropical water. ฿2,600.",
  },
  "open-water": {
    title: "PADI Open Water Course Koh Tao – 4 Days, ฿11,000 | Siam Scuba",
    description:
      "Get your PADI Open Water Diver certification in Koh Tao. 3-4 day course, max 4 students per instructor, two custom dive boats, lifetime certification. ฿11,000.",
  },
  "advanced-open-water": {
    title: "PADI Advanced Open Water Course Koh Tao – 2 Days | Siam Scuba",
    description:
      "Advance to 30m depth with the PADI Advanced Open Water course in Koh Tao. 2 days, 5 adventure dives, deep diving and navigation. ฿10,000 with Siam Scuba.",
  },
  "rescue-diver": {
    title: "PADI Rescue Diver Course Koh Tao – 4 Days | Siam Scuba",
    description:
      "Build emergency response and rescue skills in Koh Tao with the PADI Rescue Diver course. 3-4 days of scenarios, stress management, and rescue techniques. ฿12,000.",
  },
  "divemaster": {
    title: "PADI Divemaster Course Koh Tao – Pro Internship | Siam Scuba",
    description:
      "Start your professional diving career with the PADI Divemaster course in Koh Tao. 4-8 week internship: lead dives, mentor students, two boats daily. ฿38,500.",
  },
  "idc": {
    title: "PADI IDC Instructor Course Koh Tao | Siam Scuba 5 Star IDC",
    description:
      "Become a PADI Open Water Scuba Instructor in Koh Tao at a 5 Star IDC center. Full Instructor Development Course with two custom dive boats and small groups.",
  },
  "bubble-maker": {
    title: "PADI Bubble Maker for Kids in Koh Tao | Siam Scuba",
    description:
      "Safe, supervised first scuba experience for children aged 8+ in Koh Tao. PADI Bubble Maker: pool-based, with PADI instructor, fun and confidence-building. ฿3,800.",
  },
  "scuba-review": {
    title: "Scuba Review – Refresher Course Koh Tao | Siam Scuba",
    description:
      "Refresh your dive skills before exploring Koh Tao. One-day Scuba Review with 2 supervised ocean dives, perfect after a break from diving. ฿2,500.",
  },
  "peak-performance-buoyancy": {
    title: "PADI Peak Performance Buoyancy – Koh Tao | Siam Scuba",
    description:
      "Master buoyancy control in Koh Tao with the PADI Peak Performance Buoyancy specialty. Improve air consumption and effortless underwater gliding. ฿5,500.",
  },
  "wreck-diving": {
    title: "PADI Wreck Diver Specialty Koh Tao – HTMS Sattakut | Siam Scuba",
    description:
      "Explore Koh Tao's HTMS Sattakut wreck and learn safe wreck-diving techniques. PADI Wreck Diver specialty with experienced instructors at Siam Scuba.",
  },
  "deep-diving": {
    title: "PADI Deep Diver Specialty Koh Tao – Up to 40m | Siam Scuba",
    description:
      "Dive deeper safely in Koh Tao with the PADI Deep Diver specialty. 4 dives down to 40m, including Chumphon Pinnacle and Sail Rock with Siam Scuba.",
  },
  "dpv": {
    title: "Underwater Scooter (DPV) Course Koh Tao | Siam Scuba",
    description:
      "Learn to dive with an underwater scooter (DPV) in Koh Tao. PADI specialty course for fast, effortless exploration of larger reef areas with Siam Scuba.",
  },
  "sidemount": {
    title: "PADI Sidemount Diver Course Koh Tao | Siam Scuba",
    description:
      "Learn sidemount diving in Koh Tao – a more streamlined, redundant gear configuration. PADI Sidemount specialty course with experienced instructors.",
  },
  "efr": {
    title: "Emergency First Response (EFR) Course Koh Tao | Siam Scuba",
    description:
      "International CPR and first aid certification in Koh Tao. EFR Primary and Secondary Care – essential for Rescue Diver, Divemaster, and life skills. ฿4,500.",
  },
  "uw-photography": {
    title: "Underwater Photography Course Koh Tao – 5 Days | Siam Scuba",
    description:
      "Extended PADI UW Photographer & Videographer course in Koh Tao. 5 days, 10 dives, 1-on-1 instruction, professional underwater imaging. ฿37,000.",
  },
};
