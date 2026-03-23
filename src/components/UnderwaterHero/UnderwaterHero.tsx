import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const HERO_HEIGHT_VH = 210;

const UnderwaterHero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isDirtyRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Draw video frame to canvas
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // object-fit: cover
    const scale = Math.max(cw / vw, ch / vh);
    const sw = vw * scale;
    const sh = vh * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.drawImage(video, sx, sy, sw, sh);
  }, []);

  // Resize canvas to match screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100vh";
      drawFrame();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // Setup video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = "/hero-video.mp4";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.pause();

    const onReady = () => setVideoReady(true);
    const onError = () => setVideoError(true);

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };
  }, []);

  // Render loop
  useEffect(() => {
    const loop = () => {
      if (isDirtyRef.current) {
        isDirtyRef.current = false;
        const video = videoRef.current;
        if (video && video.readyState >= 2 && isFinite(video.duration)) {
          video.currentTime = progressRef.current * video.duration;
          drawFrame();
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Scroll listener
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const clamped = Math.max(0, Math.min(1, v));
      progressRef.current = clamped;
      isDirtyRef.current = true;
    });
    return unsub;
  }, [scrollYProgress]);

  // Draw on video seek
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onSeeked = () => drawFrame();
    video.addEventListener("seeked", onSeeked);
    return () => video.removeEventListener("seeked", onSeeked);
  }, [drawFrame]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <div ref={containerRef} style={{ height: `${HERO_HEIGHT_VH}vh` }} className="relative w-full">
      {/* Hidden video element */}
      <video ref={videoRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', zIndex: -1 }} />

      {/* Sticky canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: "linear-gradient(180deg, #020B18 0%, #0A2744 100%)" }}
        />

        {/* Bottom fade to white */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none"
          style={{
            height: "35%",
            background: "linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%)",
          }}
        />

        {/* Explore text at bottom */}
        <div className="absolute bottom-8 left-0 right-0 z-[4] flex flex-col items-center pointer-events-none">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-xs uppercase tracking-[0.4em] text-foreground/50">
              Explore
            </span>
            <svg className="h-5 w-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Placeholder when video not ready */}
        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center z-[5] bg-ocean-deep">
            {videoError ? (
              <span className="text-primary-foreground/50 font-body text-sm uppercase tracking-widest">
                Hero video coming soon
              </span>
            ) : (
              <div className="w-8 h-8 border-2 border-ocean-light/30 border-t-ocean-light rounded-full animate-spin" />
            )}
          </div>
        )}

        {/* Text overlay */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-block text-ocean-light/80 font-body text-[11px] md:text-xs uppercase tracking-[0.45em] border border-ocean-light/20 rounded-full px-5 py-1.5 backdrop-blur-sm bg-ocean-deep/20">
              {t("hero_badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] max-w-3xl mx-auto text-center backdrop-blur-md bg-ocean-deep/30 rounded-2xl px-8 py-6 border border-primary-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]"
          >
            {t("hero_title_1")}
            <br />
            <span className="text-ocean-light italic">{t("hero_title_2")}</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mt-6 mb-6 h-px w-24 bg-gradient-to-r from-transparent via-ocean-light/60 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-base md:text-lg max-w-xl mx-auto font-body font-light leading-relaxed text-primary-foreground/90 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-1"
          >
            <span className="text-primary-foreground/40 font-body text-[10px] uppercase tracking-[0.3em]">
              {t("hero_explore")}
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <svg className="h-5 w-5 text-primary-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderwaterHero;
