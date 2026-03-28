import { motion } from "framer-motion";
import { Star, ExternalLink, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g303910-d2385121-Reviews-Siam_Scuba-Koh_Tao_Surat_Thani_Province.html";
const TRIPADVISOR_REVIEW_URL =
  "https://www.tripadvisor.com/UserReviewEdit-g303910-d2385121-Siam_Scuba-Koh_Tao_Surat_Thani_Province.html";

const reviews = [
  {
    name: "Sarah M.",
    country: "🇬🇧 United Kingdom",
    text: "There are so many dive schools in Koh Tao and this one is definitely the best. The friendliest instructor ever — best day of our trip!",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "The Johnson Family",
    country: "🇺🇸 United States",
    text: "Our instructors Chris and Noah were incredible — kind, helpful, funny and patient. We owe a huge thanks to Siam Scuba, easily one of the nicest dive shops in Koh Tao.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Lucas R.",
    country: "🇩🇪 Germany",
    text: "Fantastic experience. The staff were incredibly kind and welcoming. Small group meant I got tons of personal attention. Certified in 4 days and already planning my next dive.",
    rating: 5,
    date: "January 2026",
  },
];

const TripAdvisorLogo = () => (
  <svg viewBox="0 0 148 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
    <circle cx="14" cy="14" r="14" fill="#34E0A1" />
    <circle cx="14" cy="14" r="8" fill="white" />
    <circle cx="14" cy="14" r="4" fill="#34E0A1" />
    <text x="33" y="19" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#000">
      Tripadvisor
    </text>
  </svg>
);

const RatingBubbles = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-4 h-4 rounded-full border-2 ${
          i <= rating ? "bg-[#34E0A1] border-[#34E0A1]" : "border-gray-300"
        }`}
      />
    ))}
  </div>
);

const TripAdvisorSection = () => {
  return (
    <section className="section-padding bg-ocean-surface">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TripAdvisorLogo />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <RatingBubbles rating={5} />
            <span className="text-2xl font-bold text-foreground">5.0</span>
            <span className="text-muted-foreground">Excellent</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Based on <strong className="text-foreground">776+ verified reviews</strong> on Tripadvisor
          </p>
        </motion.div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm border border-border flex flex-col gap-4"
            >
              <RatingBubbles rating={review.rating} />
              <p className="text-foreground/80 text-sm leading-relaxed italic">
                "{review.text}"
              </p>
              <div className="mt-auto pt-2 border-t border-border">
                <p className="font-semibold text-sm text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.country} · {review.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 gap-2 border-[#34E0A1] text-foreground hover:bg-[#34E0A1]/10"
          >
            <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Read all 776 reviews
            </a>
          </Button>
          <Button
            asChild
            className="rounded-full px-8 gap-2 bg-[#34E0A1] hover:bg-[#34E0A1]/90 text-black font-semibold"
          >
            <a href={TRIPADVISOR_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              <PenLine className="h-4 w-4" />
              Write a review
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TripAdvisorSection;
