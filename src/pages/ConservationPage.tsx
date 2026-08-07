import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink, CONSERVATION_WHATSAPP_NUMBER } from "@/utils/whatsapp";

// Conservation at Siam Scuba - the destination of the gate's fourth card.
//
// The copy is our instructor Paul's, near-verbatim (2026-08-07). Two deliberate
// omissions, both to keep the page honest:
//   1. NO PRICES. The specialties below are real PADI courses we run, but their
//      pricing is not published anywhere else on the site, so quoting numbers
//      here would create a second source of truth that drifts.
//   2. NO "AOW PATHWAYS". The seven themed pathways Paul drafted are explicitly
//      concepts pending a sit-down with Ben - publishing them as products would
//      be selling something we have not agreed to deliver.
//
// WhatsApp on this page goes to PAUL's direct line, not the shop inbox: he owns
// the conservation programme end to end (Ben, 2026-08-07). That is the ONLY
// reason buildWhatsAppLink takes a `number` override - do not spread it around.
//
// Visual line: lighter turquoise than the blue dive landers, with owned photos
// fading into the cards rather than blocks of running text (Ben, 2026-08-07).

const WHATSAPP_HREF = buildWhatsAppLink({
  // The prefill names the page on purpose: this lands on Paul's personal phone,
  // so he needs to know at a glance why a stranger is messaging him and not the
  // shop. Without it every conservation enquiry reads as a generic diving DM.
  topic: "conservation",
  lang: "en",
  number: CONSERVATION_WHATSAPP_NUMBER,
});

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Conservation at Siam Scuba - Protect What You Love",
  description:
    "Conservation diving on Koh Tao with Siam Scuba: PADI AWARE, Dive Against Debris, Shark & Ray Conservation, Coral Reef Conservation, Underwater Naturalist, Fish ID and Peak Performance Buoyancy - plus how we run the shop itself more sustainably.",
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: "Siam Scuba", url: "https://siamscuba.com" },
  about: { "@type": "Thing", name: "Marine conservation" },
  publisher: {
    "@type": "Organization",
    name: "Siam Scuba",
    logo: { "@type": "ImageObject", url: "https://siamscuba.com/favicon.png" },
  },
};

/**
 * What you actually learn. Paul's list, broken out of its bullet run so each
 * point can be scanned on its own instead of read as a paragraph.
 */
const LEARN: { short: string; long: string }[] = [
  { short: "Marine life", long: "Responsible interaction with the animals you meet" },
  { short: "Technique", long: "Environmentally friendly diving from the first minute" },
  { short: "Buoyancy", long: "The control that keeps fins and gauges off the coral" },
  { short: "Reef health", long: "Reading the difference between a healthy and a stressed reef" },
  { short: "Footprint", long: "Practical ways to cut your own environmental impact" },
  { short: "Afterwards", long: "How divers keep contributing long after certification" },
];

/** The conservation specialties we teach. No prices - see the note above. */
const SPECIALTIES: {
  name: string;
  payoff: string;
  body: string;
  note?: string;
  img: string;
  alt: string;
}[] = [
  {
    name: "PADI AWARE Specialty",
    payoff: "Become part of the solution",
    body: "Conservation starts with informed divers. Learn about today's biggest marine conservation challenges and discover how your everyday actions can help protect marine life.",
    note: "Every certification also supports the PADI AWARE Foundation's global projects - protecting vulnerable species, removing marine debris and expanding marine protected areas.",
    img: "/conservation/divers-ascending-koh-tao.webp",
    alt: "Two scuba divers ascending towards the sunlight above Koh Tao",
  },
  {
    name: "Dive Against Debris®",
    payoff: "Every dive can make a difference",
    body: "Finish a dive knowing you left the reef cleaner than you found it. You'll remove marine debris while contributing to one of the world's largest underwater citizen-science databases.",
    note: "Every piece of rubbish removed makes an immediate difference. You are not just cleaning the reef - you are helping protect its future.",
    img: "/conservation/diver-underwater-camera-reef-koh-tao.webp",
    alt: "Scuba diver working close to an anemone-covered reef at Koh Tao",
  },
  {
    name: "AWARE Shark & Ray Conservation",
    payoff: "Protect ocean icons",
    body: "Sharks and rays are among the ocean's most important and most threatened animals. Discover why they are essential to healthy marine ecosystems, what they are up against, and how divers are helping protect them.",
    note: "This course turns a shark encounter into a conservation experience.",
    img: "/conservation/blue-spotted-stingray-koh-tao.webp",
    alt: "Blue-spotted stingray resting on the reef at Koh Tao",
  },
  {
    name: "Coral Reef Conservation",
    payoff: "Understanding the ocean's rainforests",
    body: "Coral reefs support almost 25% of all marine life while covering less than 1% of the ocean floor. Learn how reefs function, why they are under pressure from climate change and human activity, and what we can do about it.",
    img: "/conservation/jellyfish-coral-reef-koh-tao.webp",
    alt: "Jellyfish drifting past a coral reef wall with reef fish at Koh Tao",
  },
  {
    name: "Underwater Naturalist",
    payoff: "See more than ever before",
    body: "The reef comes alive when you understand what you are looking at. Learn to identify marine life, recognise behaviours, and read the relationships between species and their environment.",
    img: "/conservation/nudibranch-macro-koh-tao.webp",
    alt: "Close-up of a brightly coloured nudibranch sea slug on the reef at Koh Tao",
  },
  {
    name: "Fish Identification",
    payoff: "Know the fish. Understand the reef.",
    body: "Fish are more than colourful photo opportunities - each species has a role in keeping a reef healthy. Learn straightforward identification techniques and the biodiversity behind them.",
    img: "/conservation/clownfish-anemone-koh-tao.webp",
    alt: "Clownfish sheltering in a sea anemone on the sand at Koh Tao",
  },
  {
    name: "Peak Performance Buoyancy",
    payoff: "The ultimate conservation skill",
    body: "Precise buoyancy reduces accidental contact with coral, protects fragile habitats, and lets you observe wildlife without disturbing it. You'll also use less air and feel far more relaxed underwater.",
    note: "Better buoyancy means better diving - and healthier reefs.",
    img: "/conservation/diver-neutral-buoyancy-koh-tao.webp",
    alt: "Scuba diver hovering horizontally in mid-water with neutral buoyancy at Koh Tao",
  },
];

/** How we run the shop itself. */
const ON_LAND: { title: string; body: string; list?: string[] }[] = [
  {
    title: "Paperless operations",
    body: "We're moving towards fully digital training materials, registrations and administration to cut unnecessary paper out of the shop.",
  },
  {
    title: "Responsible waste management",
    body: "We minimise waste, recycle wherever possible, and keep reviewing our operations to reduce single-use plastics and unnecessary packaging.",
  },
  {
    title: "Sustainable diving practices",
    body: "Every instructor is committed to techniques that minimise environmental impact:",
    list: [
      "Perfect buoyancy before approaching reefs",
      "Never touching, standing on or collecting marine life",
      "Respectful wildlife interactions",
      "Secure equipment to prevent accidental reef damage",
      "Responsible dive planning and reef awareness",
      "Leading by example on every dive",
    ],
  },
  {
    title: "Conservation through education",
    body: "Every course is an opportunity to inspire. Whether you're learning to dive or completing an advanced specialty, conservation is part of the experience rather than a module bolted onto it.",
  },
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-300">{children}</p>
);

const ConservationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: WHATSAPP_HREF });

  return (
    <div className="min-h-screen bg-[#0a3a4a] text-white" dir="ltr" lang="en">
      <Seo
        title="Conservation Diving on Koh Tao | PADI AWARE with Siam Scuba"
        description="Conservation is not a single course at Siam Scuba - it is how we dive. PADI AWARE, Dive Against Debris, Shark & Ray Conservation, Coral Reef Conservation, Underwater Naturalist, Fish ID and Peak Performance Buoyancy on Koh Tao."
        canonical="https://siamscuba.com/conservation"
        ogImage="https://siamscuba.com/conservation/divers-sunbeams-koh-tao.webp"
        jsonLd={pageSchema}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Conservation" }]}
      />
      <Navbar />

      {/* ---------------------------------------------------------------- Hero */}
      <header className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <img
          src="/conservation/divers-sunbeams-koh-tao.webp"
          alt="Divers silhouetted against sunbeams and rising bubbles in the water at Koh Tao"
          width={1920}
          height={1248}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Two layers, deliberately. A LIGHT turquoise veil over the whole frame
            keeps the bubbles and the diver readable, and a soft radial scrim sits
            only behind the text column so the copy clears AA without flattening
            the photo. Darkening the whole image to fix contrast is what made the
            first pass look like an empty black box. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,58,74,0.62) 0%, rgba(10,58,74,0.28) 38%, rgba(10,58,74,0.48) 72%, rgba(10,58,74,0.92) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 58% at 50% 46%, rgba(5,35,46,0.78) 0%, rgba(5,35,46,0.45) 55%, rgba(5,35,46,0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-100 [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]"
          >
            Conservation at Siam Scuba
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium leading-[1.08] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.75)] sm:text-6xl"
          >
            Protect what you love
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/95 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-lg"
          >
            Conservation isn't a single course here - it's part of who we are. Every diver has the
            power to protect the underwater world, whether you're taking your first breaths
            underwater, sharpening your skills, or simply passing through Koh Tao.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 font-display text-xl italic text-teal-100 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-2xl"
          >
            Learn. Dive. Protect.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp("conservation_hero")}
              className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-7 py-3.5 text-sm font-semibold text-[#062a36] shadow-[0_10px_30px_-10px_rgba(45,212,191,0.9)] transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask us about a conservation course
            </a>
            <a
              href="#specialties"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-teal-200/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            >
              See the specialties
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </header>

      <main>
        {/* ------------------------------------------------------ Why with us */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <Eyebrow>Why learn conservation with Siam Scuba</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              Lots of dive centres teach conservation courses.
              <span className="block text-teal-300">We live them.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75">
              Our instructors don't simply teach from manuals - they apply sustainable diving
              practices on every dive and expect every student to dive responsibly from day one.
              The goal isn't to certify divers. It's to create divers who become ambassadors for
              the ocean.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEARN.map((item) => (
                <li
                  key={item.short}
                  className="rounded-xl border border-teal-300/15 bg-white/[0.05] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                    {item.short}
                  </p>
                  <p className="mt-2 leading-relaxed text-white/80">{item.long}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------- Full-bleed band */}
        <section className="relative h-[38vh] min-h-[260px] overflow-hidden sm:h-[46vh]">
          <img
            src="/conservation/green-sea-turtle-koh-tao.webp"
            alt="Green sea turtle resting on the sand beside the reef at Koh Tao"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Fades the photo into the sections above and below it, so it reads as
              a break in the page rather than a pasted-in rectangle. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #0a3a4a 0%, rgba(10,58,74,0.72) 14%, rgba(10,58,74,0.18) 42%, rgba(10,58,74,0.30) 62%, rgba(13,69,87,0.80) 86%, #0d4557 100%)",
            }}
          />
          <p className="absolute inset-x-0 bottom-8 px-6 text-center font-display text-lg italic text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl">
            The best divers don't just explore the ocean - they protect it.
          </p>
        </section>

        {/* ----------------------------------------------------- Specialties */}
        <section id="specialties" className="scroll-mt-24 bg-[#0d4557] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <Eyebrow>Conservation specialties</Eyebrow>
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              Practical diving skills, married to marine science
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              Each of these gives you the knowledge to better understand - and actively protect -
              the underwater world. Message us for dates and pricing; we'll tell you honestly which
              one fits where you are as a diver.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {SPECIALTIES.map((s) => (
                <article
                  key={s.name}
                  className="group overflow-hidden rounded-2xl border border-teal-300/15 bg-white/[0.05] transition-colors hover:border-teal-300/40 hover:bg-white/[0.08]"
                >
                  {/* The photo dissolves downward into the card body instead of
                      ending on a hard edge - the "fade" Ben asked for. */}
                  <div className="relative h-44 overflow-hidden sm:h-52">
                    <img
                      src={s.img}
                      alt={s.alt}
                      width={900}
                      height={506}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(13,69,87,0.05) 0%, rgba(13,69,87,0.28) 52%, rgba(13,69,87,0.88) 86%, #0e4759 100%)",
                      }}
                    />
                  </div>

                  <div className="-mt-6 relative p-7 pt-0">
                    <h3 className="font-display text-xl font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                      {s.name}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium italic text-teal-300">{s.payoff}</p>
                    <p className="mt-4 leading-relaxed text-white/80">{s.body}</p>
                    {s.note && (
                      <p className="mt-4 border-l-2 border-teal-300/50 pl-4 text-sm leading-relaxed text-white/65">
                        {s.note}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Beyond the water */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <Eyebrow>Sustainability beyond diving</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              Conservation starts on land
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              Protecting the ocean doesn't stop when we leave the water. We keep changing how the
              shop runs so we lead by example rather than by poster.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {ON_LAND.map((block) => (
                <div
                  key={block.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className="font-display text-lg font-semibold text-white">{block.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/75">{block.body}</p>
                  {block.list && (
                    <ul className="mt-4 space-y-2">
                      {block.list.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                          <span
                            aria-hidden="true"
                            className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-teal-300"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ Close */}
        <section className="relative overflow-hidden border-t border-white/10 px-6 py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 120% at 50% 100%, rgba(45,212,191,0.22) 0%, rgba(10,58,74,0) 62%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              Join us in protecting Koh Tao
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
              The ocean gives us unforgettable days, every day. Together we can give something
              back - whether you're earning your first certification, adding a specialty, or simply
              choosing a dive centre that shares your values.
            </p>
            <p className="mt-8 font-display text-xl italic text-teal-100 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-2xl">
              Dive with purpose. Learn with passion. Protect what you love.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsApp("conservation_footer")}
                className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-7 py-3.5 text-sm font-semibold text-[#062a36] shadow-[0_10px_30px_-10px_rgba(45,212,191,0.9)] transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Talk to us on WhatsApp
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-teal-200/70 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
              >
                Browse all our courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConservationPage;
