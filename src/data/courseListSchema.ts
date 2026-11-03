/**
 * Course ItemList structured data - emitted on the homepage only (/, /he, /es),
 * moved out of index.html on 2026-11-03: as a global <head> block it was injected
 * into every page (hotel, privacy, 404...) and pointed offers at /?course= URLs
 * that canonicalise to "/". Offer URLs are now the real course pages.
 * Keep prices in step with CoursesSection / info.json.
 */
export const COURSE_LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "PADI Diving Courses",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Course",
        "name": "Discover Scuba Diving",
        "description": "One day introductory scuba experience. No experience needed. Your first breath is in shallow sheltered sea, then 1 or 2 ocean dives with a PADI instructor.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1D"
        },
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "2600",
          "highPrice": "3600",
          "offerCount": "2",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/discover-scuba"
        },
        "url": "https://siamscuba.com/discover-scuba"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Course",
        "name": "PADI Open Water Diver",
        "description": "Full PADI certification course. 2.5 days, dive to 18m, lifetime certification with 4 open water dives.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P2DT12H"
        },
        "offers": {
          "@type": "Offer",
          "price": "12000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/open-water"
        },
        "url": "https://siamscuba.com/open-water"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Course",
        "name": "Bubble Maker",
        "description": "Fun scuba introduction for children in a safe, supervised environment.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1D"
        },
        "offers": {
          "@type": "Offer",
          "price": "3800",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/bubble-maker"
        },
        "url": "https://siamscuba.com/bubble-maker"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Course",
        "name": "Scuba Review",
        "description": "Refresher course for certified divers. 1 day, 2 open water dives with instructor guidance.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1D"
        },
        "offers": {
          "@type": "Offer",
          "price": "2500",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/scuba-review"
        },
        "url": "https://siamscuba.com/scuba-review"
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Course",
        "name": "PADI Advanced Open Water",
        "description": "Advanced certification. 1.5 days, 5 adventure dives, dive to 30m including deep and navigation.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1DT12H"
        },
        "offers": {
          "@type": "Offer",
          "price": "11000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/advanced-open-water-course"
        },
        "url": "https://siamscuba.com/advanced-open-water-course"
      }
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Course",
        "name": "PADI Rescue Diver",
        "description": "Emergency and rescue skills training. 2 days including stress management and rescue techniques.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P2D"
        },
        "offers": {
          "@type": "Offer",
          "price": "11000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/rescue-diver"
        },
        "url": "https://siamscuba.com/rescue-diver"
      }
    },
    {
      "@type": "ListItem",
      "position": 7,
      "item": {
        "@type": "Course",
        "name": "Emergency First Response (EFR)",
        "description": "CPR and first aid certification. International certification for life-saving skills.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1D"
        },
        "offers": {
          "@type": "Offer",
          "price": "5000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/efr"
        },
        "url": "https://siamscuba.com/efr"
      }
    },
    {
      "@type": "ListItem",
      "position": 8,
      "item": {
        "@type": "Course",
        "name": "PADI Divemaster",
        "description": "Professional-level diving course. 21-42 day internship, PADI materials included (PADI certification fee paid separately), lead dives, start your diving career.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P42D"
        },
        "offers": {
          "@type": "Offer",
          "price": "48000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/divemaster-course"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 9,
      "item": {
        "@type": "Course",
        "name": "Peak Performance Buoyancy",
        "description": "Specialty course to master buoyancy control, improve air consumption and underwater gliding.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P1D"
        },
        "offers": {
          "@type": "Offer",
          "price": "5000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/peak-performance-buoyancy"
        },
        "url": "https://siamscuba.com/peak-performance-buoyancy"
      }
    },
    {
      "@type": "ListItem",
      "position": 10,
      "item": {
        "@type": "Course",
        "name": "Extended PADI Digital UW Photographer and Videographer",
        "description": "5-day professional underwater photography and videography course. 10 dives, 1-on-1 instruction, PADI certification.",
        "provider": {
          "@type": "Organization",
          "name": "Siam Scuba",
          "sameAs": "https://siamscuba.com"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": "P5D"
        },
        "offers": {
          "@type": "Offer",
          "price": "37000",
          "priceCurrency": "THB",
          "availability": "https://schema.org/InStock",
          "url": "https://siamscuba.com/uw-photography"
        },
        "url": "https://siamscuba.com/uw-photography"
      }
    }
  ]
} as const;
