import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import adBackground from "@/assets/ad-background.jpg";
import seaCreatures from "@/assets/sea-creatures-nobg.png";
import siamLogo from "@/assets/siam-logo.png";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AdPage = () => {
  const adRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!adRef.current) return;
    const canvas = await html2canvas(adRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = "sea-creatures-ad.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 gap-6">
      <Button onClick={handleDownload} size="lg" className="gap-2 bg-teal-600 hover:bg-teal-700">
        <Download className="w-5 h-5" />
        הורד מודעה כתמונה
      </Button>

      {/* A4 aspect ratio container */}
      <div
        ref={adRef}
        className="relative w-[620px] h-[877px] overflow-hidden rounded-lg shadow-2xl"
        style={{
          backgroundImage: `url(${adBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center h-full px-8 py-6 text-center" dir="rtl">
          {/* Logo */}
          <img src={siamLogo} alt="Siam Scuba" className="w-20 h-20 rounded-full mb-2 shadow-lg border-2 border-white/60" />

          {/* Title */}
          <h1
            className="text-3xl font-black mb-1 drop-shadow-lg"
            style={{ color: "#1a3a4a", textShadow: "0 2px 8px rgba(255,255,255,0.6)" }}
          >
            🌊 חיות ים סרוגות 🌊
          </h1>
          <p
            className="text-lg font-bold mb-3"
            style={{ color: "#2a5a6a", textShadow: "0 1px 4px rgba(255,255,255,0.5)" }}
          >
            בעבודת יד | ממוחזר מהים
          </p>

          {/* Product Image */}
          <div className="flex-1 flex items-center justify-center w-full">
            <img
              src={seaCreatures}
              alt="חיות ים סרוגות"
              className="w-[85%] max-h-[320px] object-contain drop-shadow-2xl"
            />
          </div>

          {/* Story */}
          <div
            className="rounded-xl p-4 mb-3 mx-2"
            style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
          >
            <h2 className="text-base font-bold mb-1" style={{ color: "#1a4a5a" }}>
              ♻️ הסיפור שמאחורי היצירה
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#2a4a5a" }}>
              כל חיית ים סרוגה בעבודת יד וממולאת בפלסטיק שנאסף ישירות מקרקעית הים.
              <br />
              כל רכישה תורמת לניקוי האוקיינוס ושומרת על הטבע שלנו.
              <br />
              <strong>מחזיק מפתחות ייחודי עם משמעות אמיתית. 🐢🐙🦈</strong>
            </p>
          </div>

          {/* CTA */}
          <div
            className="rounded-full px-6 py-2 mb-2 font-bold text-lg shadow-lg"
            style={{ backgroundColor: "#0d9488", color: "white" }}
          >
            להזמנות: Siam Scuba Diving
          </div>

          <p className="text-xs font-medium" style={{ color: "#1a4a5a", textShadow: "0 1px 3px rgba(255,255,255,0.5)" }}>
            📍 Koh Tao, Thailand &nbsp;|&nbsp; 🌐 siamscuba.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdPage;
