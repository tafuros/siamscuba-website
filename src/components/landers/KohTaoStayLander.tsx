import { Link } from "react-router-dom";
import { MapPin, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import LanderNav from "@/components/landers/LanderNav";
import {
  STAY_SECTIONS,
  stayWhatsAppUrl,
  type StayPlace,
  type StaySectionId,
} from "@/lib/kohTaoStay";
import { trackStayMapClick, trackStayWhatsAppClick } from "@/utils/tracking";

const BUTTON_BASE =
  "inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition-colors";

interface PlaceCardProps {
  place: StayPlace;
  section: StaySectionId;
  isFirst: boolean;
}

const PlaceCard = ({ place, section, isFirst }: PlaceCardProps) => (
  <article className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
    <div className="relative">
      <img
        src={place.image}
        alt={place.alt}
        width={800}
        height={600}
        loading={isFirst ? "eager" : "lazy"}
        decoding="async"
        className="aspect-[4/3] w-full object-cover"
      />
      {place.badges && (
        <div className="absolute right-3 top-3 flex flex-wrap gap-2">
          {place.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-ocean-deep/90 px-3 py-1 text-sm font-semibold text-white"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold leading-snug text-foreground">{place.name}</h3>
      <p className="mt-1 text-base text-muted-foreground">{place.label}</p>
      {place.whatsappContact && (
        <p className="mt-1 text-base text-muted-foreground">בוואטסאפ: {place.whatsappContact}</p>
      )}
      <div className="mt-4 flex gap-3">
        <a
          href={place.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackStayMapClick({ place_name: place.name, section })}
          className={`${BUTTON_BASE} border border-input bg-background text-foreground hover:bg-muted`}
        >
          <MapPin className="h-5 w-5" aria-hidden="true" />
          מפה
        </a>
        {place.whatsapp && (
          <a
            href={stayWhatsAppUrl(place.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStayWhatsAppClick({ place_name: place.name, section })}
            className={`${BUTTON_BASE} bg-[#128C7E] text-white hover:bg-[#0f766a]`}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            וואטסאפ
          </a>
        )}
      </div>
    </div>
  </article>
);

const KohTaoStayLander = () => (
  <div dir="rtl" lang="he" className="min-h-screen bg-background text-foreground">
    <header className="relative bg-ocean-deep px-4 pb-10 pt-24 text-center text-white md:pb-14 md:pt-28">
      <LanderNav homePath="/he" />
      <h1 className="text-4xl font-bold leading-tight md:text-5xl">איפה לישון בקוטאו?</h1>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-white/85">
        האי קטן - 7.5 ק״מ לאורכו, בערך מרידינג לנמל יפו.
      </p>
    </header>

    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {STAY_SECTIONS.map((section, sectionIndex) => (
        <section key={section.id} className="mb-12 last:mb-0">
          <h2 className="text-2xl font-bold md:text-3xl">{section.title}</h2>
          <p className="mb-5 mt-1 text-lg text-muted-foreground">{section.intro}</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {section.places.map((place, placeIndex) => (
              <PlaceCard
                key={place.name}
                place={place}
                section={section.id}
                isFirst={sectionIndex === 0 && placeIndex === 0}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="mt-12 border-t border-border pt-8 text-center text-base text-muted-foreground">
        בא לכם גם לצלול?{" "}
        <Link to="/he/discover-scuba" className="font-semibold text-foreground underline underline-offset-4">
          צלילת היכרות עם Siam Scuba
        </Link>
      </p>
    </div>

    <Footer />
  </div>
);

export default KohTaoStayLander;
