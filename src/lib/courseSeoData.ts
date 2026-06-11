// Per-course SEO meta. Title pattern: "PADI [Course] Course Koh Tao | Siam Scuba"
// Description: 150-160 chars, course-specific selling points (group size, duration, price).
// h1: on-page hero lead line; the hero appends an italic "in Koh Tao" accent after it,
//     so this should read naturally followed by "in Koh Tao".

export interface CourseSeo {
  title: string;
  description: string;
  h1: string;
}

export const COURSE_SEO: Record<string, CourseSeo> = {
  "discover-scuba": {
    title: "Discover Scuba Diving in Koh Tao – Try Diving | Siam Scuba",
    description:
      "Try scuba diving in Koh Tao with no experience needed. One-day intro with PADI instructor: an easy shallow-water start plus 1-2 ocean dives in calm tropical water. ฿2,600.",
    h1: "Discover Scuba Diving",
  },
  "open-water": {
    title: "PADI Open Water Course Koh Tao – ฿12,000 Lifetime Cert | Siam Scuba",
    description:
      "Get your PADI Open Water Diver certification in Koh Tao. Small groups, two custom dive boats, lifetime certification. ฿12,000.",
    h1: "PADI Open Water Diver Course",
  },
  "advanced-open-water": {
    title: "PADI Advanced Open Water Course Koh Tao – 2 Days | Siam Scuba",
    description:
      "Advance to 30m depth with the PADI Advanced Open Water course in Koh Tao. 2 days, 5 adventure dives, deep diving and navigation. ฿11,000 with Siam Scuba.",
    h1: "PADI Advanced Open Water Course",
  },
  "rescue-diver": {
    title: "PADI Rescue Diver Course Koh Tao – 4 Days | Siam Scuba",
    description:
      "Build emergency response and rescue skills in Koh Tao with the PADI Rescue Diver course. 3-4 days of scenarios, stress management, and rescue techniques. ฿11,000.",
    h1: "PADI Rescue Diver Course",
  },
  "divemaster": {
    title: "PADI Divemaster Course Koh Tao – Pro Internship | Siam Scuba",
    description:
      "Start your professional diving career with the PADI Divemaster course in Koh Tao. 4-8 week internship: lead dives, mentor students, two boats daily. ฿38,500.",
    h1: "PADI Divemaster Course",
  },
  "idc": {
    title: "PADI IDC Instructor Course Koh Tao | Siam Scuba 5 Star IDC",
    description:
      "Become a PADI Open Water Scuba Instructor in Koh Tao at a 5 Star IDC center. Full Instructor Development Course with two custom dive boats and small groups.",
    h1: "PADI IDC Instructor Course",
  },
  "bubble-maker": {
    title: "PADI Bubble Maker for Kids in Koh Tao | Siam Scuba",
    description:
      "Safe, supervised first scuba experience for children aged 8+ in Koh Tao. PADI Bubble Maker: pool-based, with PADI instructor, fun and confidence-building. ฿3,800.",
    h1: "PADI Bubble Maker for Kids",
  },
  "scuba-review": {
    title: "Scuba Review – Refresher Course Koh Tao | Siam Scuba",
    description:
      "Refresh your dive skills before exploring Koh Tao. One-day Scuba Review with 2 supervised ocean dives, perfect after a break from diving. ฿2,500.",
    h1: "Scuba Review Refresher",
  },
  "peak-performance-buoyancy": {
    title: "PADI Peak Performance Buoyancy – Koh Tao | Siam Scuba",
    description:
      "Master buoyancy control in Koh Tao with the PADI Peak Performance Buoyancy specialty. Improve air consumption and effortless underwater gliding. ฿5,500.",
    h1: "PADI Peak Performance Buoyancy",
  },
  "wreck-diving": {
    title: "PADI Wreck Diver Specialty Koh Tao – HTMS Sattakut | Siam Scuba",
    description:
      "Explore Koh Tao's HTMS Sattakut wreck and learn safe wreck-diving techniques. PADI Wreck Diver specialty with experienced instructors at Siam Scuba.",
    h1: "PADI Wreck Diver Course",
  },
  "deep-diving": {
    title: "PADI Deep Diver Specialty Koh Tao – Up to 40m | Siam Scuba",
    description:
      "Dive deeper safely in Koh Tao with the PADI Deep Diver specialty. 4 dives down to 40m, including Chumphon Pinnacle and Sail Rock with Siam Scuba.",
    h1: "PADI Deep Diver Course",
  },
  "night-dive": {
    title: "Night Diving in Koh Tao – Guided Night Dive | Siam Scuba",
    description:
      "Explore Koh Tao's reefs after dark with a guided night dive. Spot hunting marine life and glowing plankton with experienced PADI instructors at Siam Scuba. ฿1,300.",
    h1: "Night Diving",
  },
  "dpv": {
    title: "Underwater Scooter (DPV) Course Koh Tao | Siam Scuba",
    description:
      "Learn to dive with an underwater scooter (DPV) in Koh Tao. PADI specialty course for fast, effortless exploration of larger reef areas with Siam Scuba.",
    h1: "Underwater Scooter (DPV) Course",
  },
  "sidemount": {
    title: "PADI Sidemount Diver Course Koh Tao | Siam Scuba",
    description:
      "Learn sidemount diving in Koh Tao – a more streamlined, redundant gear configuration. PADI Sidemount specialty course with experienced instructors.",
    h1: "PADI Sidemount Diver Course",
  },
  "efr": {
    title: "Emergency First Response (EFR) Course Koh Tao | Siam Scuba",
    description:
      "International CPR and first aid certification in Koh Tao. EFR Primary and Secondary Care – essential for Rescue Diver, Divemaster, and life skills. ฿5,000.",
    h1: "Emergency First Response (EFR)",
  },
  "uw-photography": {
    title: "Underwater Photography Course Koh Tao – 5 Days | Siam Scuba",
    description:
      "Extended PADI UW Photographer & Videographer course in Koh Tao. 5 days, 10 dives, 1-on-1 instruction, professional underwater imaging. ฿37,000.",
    h1: "Underwater Photography Course",
  },
  "self-reliant-diver": {
    title: "PADI Self-Reliant Diver Course Koh Tao – 1.5 Days | Siam Scuba",
    description:
      "Learn to dive independently in Koh Tao with the PADI Self-Reliant Diver specialty. 1.5 days, 3 dives, backup-gear redundancy and SAC-rate planning. ฿13,000.",
    h1: "PADI Self-Reliant Diver Course",
  },
};
