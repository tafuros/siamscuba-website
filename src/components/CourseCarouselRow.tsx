import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";

interface CourseCarouselRowProps {
  courses: any[];
  t: (key: any) => string;
  setSelectedCourse: (key: string) => void;
}

const CourseCarouselRow = ({ courses, t, setSelectedCourse }: CourseCarouselRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      const ro = new ResizeObserver(checkScroll);
      ro.observe(el);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        ro.disconnect();
      };
    }
  }, [courses]);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth || 300;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {courses.map((course, i) => (
          <motion.div
            key={course.dialogKey}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="min-w-[260px] w-[280px] sm:w-[300px] lg:w-[calc(33.333%-11px)] shrink-0 snap-start"
          >
            <CourseCard course={course} t={t} setSelectedCourse={setSelectedCourse} />
          </motion.div>
        ))}
      </div>

      {/* Fade edges when scrollable */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-[1]" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-[1]" />
      )}

      {/* Nav buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CourseCarouselRow;
