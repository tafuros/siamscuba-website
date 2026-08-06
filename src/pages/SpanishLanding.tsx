import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink } from "@/utils/whatsapp";
import { HOME_HREFLANG_ALTERNATES } from "@/lib/localeRoutes";

const SPANISH_WHATSAPP_HREF = buildWhatsAppLink({ offer: "general", lang: "es" });

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Buceo en Koh Tao - la guía completa en español 2026",
  description:
    "La guía en español para bucear en Koh Tao: precios reales de los cursos PADI, presupuesto del viaje, mejor época del año y por qué en Siam Scuba buceas en grupos de máximo 4 y sin depósito.",
  inLanguage: "es",
  datePublished: "2026-08-06T00:00:00+07:00",
  dateModified: "2026-08-06T00:00:00+07:00",
  author: { "@type": "Organization", name: "Siam Scuba" },
  publisher: {
    "@type": "Organization",
    name: "Siam Scuba",
    logo: { "@type": "ImageObject", url: "https://siamscuba.com/favicon.png" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://siamscuba.com/es" },
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 mb-12">
    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h2>
    <div className="space-y-3 text-foreground/85 leading-relaxed">{children}</div>
  </section>
);

const SpanishLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="ltr" lang="es">
      <Seo
        title="Buceo en Koh Tao en español | Cursos PADI con Siam Scuba"
        description="Guía en español para bucear en Koh Tao: cursos PADI desde 2,600 THB, máximo 4 alumnos por instructor, sin depósito, barcos propios. Instructores que hablan español."
        ogType="article"
        jsonLd={articleSchema}
        hreflangAlternates={HOME_HREFLANG_ALTERNATES}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Buceo en Koh Tao" },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-16">
        {/* Hero */}
        <div className="relative overflow-hidden bg-ocean-deep">
          <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-accent text-accent-foreground mb-4">En español</Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                Bucear en Koh Tao - la guía completa en español
              </h1>
              <p className="mt-4 text-primary-foreground/80 text-lg max-w-3xl mx-auto">
                Los precios de verdad, los cursos que puedes hacer, el presupuesto completo del viaje
                y por qué Siam Scuba es el centro que estás buscando. Todo en español, sin letra
                pequeña y sin sorpresas al pagar.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <a
                    href={SPANISH_WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ location: "spanish_landing_hero", url: SPANISH_WHATSAPP_HREF })}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Escríbenos por WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="#precios">Ver los precios</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <article className="container mx-auto px-4 max-w-3xl mt-12">
          {/* Mini ToC */}
          <nav aria-label="Índice de la guía" className="mb-10 p-4 rounded-2xl bg-secondary/40">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              En esta guía
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              <li><a href="#por-que-koh-tao" className="text-primary hover:underline">¿Por qué Koh Tao?</a></li>
              <li><a href="#precios" className="text-primary hover:underline">Precios de los cursos 2026</a></li>
              <li><a href="#presupuesto" className="text-primary hover:underline">Presupuesto del viaje</a></li>
              <li><a href="#coste-vida" className="text-primary hover:underline">Coste de vida si te quedas</a></li>
              <li><a href="#temporada" className="text-primary hover:underline">La mejor época del año</a></li>
              <li><a href="#costes-ocultos" className="text-primary hover:underline">Costes ocultos que debes preguntar</a></li>
              <li><a href="#por-que-nosotros" className="text-primary hover:underline">¿Por qué Siam Scuba?</a></li>
              <li><a href="#reservar" className="text-primary hover:underline">Cómo reservar</a></li>
            </ul>
          </nav>

          <Section id="por-que-koh-tao" title="¿Por qué Koh Tao?">
            <p>
              Koh Tao es una isla pequeña del golfo de Tailandia que certifica cada año más buceadores
              PADI Open Water que ningún otro lugar del mundo. Si estás buscando dónde sacarte el
              título, es muy probable que ya te hayan hablado de ella.
            </p>
            <p>
              Hay tres razones que la convierten en la mejor opción para los que venimos de España o
              Latinoamérica:
            </p>
            <p>
              <strong>1. El precio.</strong> El curso PADI Open Water cuesta aquí 12,000 THB (unos 320
              euros). El mismo curso en el Caribe cuesta entre 600 y 900 dólares; en Australia, más de
              700 dólares australianos; en el Mediterráneo, entre 500 y 650 euros. Mismo temario,
              mismos estándares, misma titulación internacional - por la mitad o un tercio.
            </p>
            <p>
              <strong>2. Las condiciones.</strong> El agua está entre 28 y 30 grados todo el año, así
              que no necesitas traje grueso ni pasarás frío. La visibilidad llega a 20-30 metros en
              los buenos días y los sitios de buceo están a 20-40 minutos de barco. Corales, tortugas,
              bancos de barracudas y, entre abril y mayo, tiburones ballena.
            </p>
            <p>
              <strong>3. El ambiente.</strong> Koh Tao es una isla de buceadores. Vas a conocer gente
              en el curso, en el barco y por la noche - no es un viaje solitario. El único riesgo es
              el de siempre: mucha gente reserva en el primer centro que ve porque "se lo recomendó
              alguien". Compara antes de pagar.
            </p>
          </Section>

          <Section id="precios" title="Precios de los cursos en Siam Scuba (2026)">
            <p>
              Estos son los precios reales de 2026. Incluyen todo el equipo, los barcos, la
              certificación y las tasas. Sin sorpresas al final.
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Discover Scuba Diving (bautismo):</strong> 2,600 THB una inmersión, 3,600 THB
                dos inmersiones el mismo día. Un día, sin certificación. Tu primera respiración es en
                el mar, sobre un arrecife, con instructor personal.
              </li>
              <li>
                <strong>PADI Bubble Maker (niños desde 8 años):</strong> 3,800 THB. Introducción
                segura y divertida al buceo, siempre con un instructor PADI.
              </li>
              <li>
                <strong>Scuba Review (repaso para certificados):</strong> 2,500 THB. Un día: repaso de
                habilidades y 2 inmersiones en el mar con instructor.
              </li>
              <li>
                <strong>PADI Open Water Diver:</strong> 12,000 THB. 2,5 días, certificación de por
                vida, máximo 4 alumnos por instructor y 2 noches de alojamiento incluidas. Te permite
                bucear hasta 18 metros en cualquier parte del mundo.
              </li>
              <li>
                <strong>PADI Advanced Open Water:</strong> 11,000 THB. 1,5 días, 5 inmersiones de
                aventura - profunda, pecio, nocturna, navegación y flotabilidad. Te lleva a 30 metros
                y no tiene exámenes.
              </li>
              <li>
                <strong>PADI Rescue Diver:</strong> 11,000 THB (añade el EFR por 5,000 THB si aún no
                lo tienes). Es el curso que todo el mundo recuerda como el que le convirtió en mejor
                buceador.
              </li>
              <li>
                <strong>Peak Performance Buoyancy (flotabilidad):</strong> 5,500 THB. Un día, 2
                inmersiones. La mejora más grande que puedes hacer en tu forma de bucear.
              </li>
              <li>
                <strong>Especialidades (pecio, profunda, sidemount, DPV):</strong> desde 7,000 THB por
                especialidad.
              </li>
              <li>
                <strong>PADI Divemaster:</strong> 38,500 THB. De 4 a 8 semanas, con periodo de
                prácticas incluido. Tu primera certificación profesional.
              </li>
              <li>
                <strong>PADI IDC (curso de instructor):</strong> precio bajo consulta. Somos un centro
                PADI 5 Star IDC, así que puedes hacer todo el camino de Open Water a instructor en el
                mismo sitio.
              </li>
            </ul>
            <p>
              <Link to="/es/blog/curso-buceo-koh-tao" className="text-primary hover:underline">
                Lee la guía completa del curso de buceo en Koh Tao
              </Link>
              {" - "}
              nuestro artículo detallado, en español, con todo de la A a la Z.
            </p>
          </Section>

          <Section id="presupuesto" title="Presupuesto del viaje (lo que cuesta de verdad)">
            <p>
              El precio del curso no cuenta toda la historia. Vas a estar en Koh Tao al menos 3 días
              para el Open Water, y más si sigues con el Advanced. Este es un presupuesto diario
              realista:
            </p>
            <p>
              <strong>Alojamiento:</strong> cama en hostel compartido, 250-450 THB la noche. Habitación
              privada con ventilador, 700-1,200 THB. Habitación con aire acondicionado, 1,200-2,500
              THB. Sairee Beach y Mae Haad son las dos zonas principales. Ojo: con el curso Open Water
              van 2 noches incluidas, y con el Advanced, 1 noche.
            </p>
            <p>
              <strong>Comida:</strong> un plato tailandés en la calle, 70-120 THB. Una comida en
              restaurante para turistas, 250-450 THB. Una cena en condiciones, 400-700 THB. Botella de
              agua de 1,5 litros, 20 THB.
            </p>
            <p>
              <strong>Transporte en la isla:</strong> alquiler de moto 200-300 THB al día con gasolina.
              Songthaew (camioneta compartida) 100-200 THB el trayecto.
            </p>
            <p>
              <strong>Ferry desde Bangkok o Koh Samui:</strong> 800-1,300 THB por trayecto. Nosotros
              recomendamos Lomprayah o Songserm.
            </p>
            <p>
              <strong>Vuelo desde España o Latinoamérica:</strong> entre 700 y 1,500 euros según la
              temporada. Los billetes más baratos salen entre semana y fuera de vacaciones.
            </p>
            <p>
              <strong>Total para 4 días en Koh Tao con el curso Open Water:</strong> entre 18,000 y
              26,000 THB en la isla (unos 480-700 euros), más el vuelo.
            </p>
          </Section>

          <Section id="coste-vida" title="Coste de vida si te quedas más tiempo">
            <p>
              Si piensas encadenar el Advanced (un día y medio más) o hacer el Divemaster (de 4 a 8
              semanas), conviene saber lo que cuesta vivir aquí al mes:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Estudio mensual con ventilador:</strong> 8,000-15,000 THB al mes. Es lo que
                alquila la mayoría de los alumnos de Divemaster.
              </li>
              <li>
                <strong>Habitación con aire acondicionado:</strong> 15,000-25,000 THB al mes.
              </li>
              <li>
                <strong>Comida:</strong> 8,000-15,000 THB al mes, según cuánto comas en la calle y
                cuánto en restaurantes para turistas.
              </li>
              <li>
                <strong>Ocio y copas:</strong> 5,000-10,000 THB al mes. Sairee tiene vida nocturna
                todos los días y es barata comparada con Europa.
              </li>
            </ul>
            <p>
              <strong>Total de 6 semanas con el Divemaster:</strong> entre 80,000 y 120,000 THB
              (unos 2,100-3,200 euros), curso, alojamiento, comida y ocio incluidos. Probablemente sea
              la forma más barata del mundo de convertir una afición en una profesión.
            </p>
            <p>
              <Link to="/es/blog/divemaster-koh-tao-padi-espanol" className="text-primary hover:underline">
                Cómo es el Divemaster en Koh Tao, día a día
              </Link>
              {" - "}
              lo que haces cada semana, en español.
            </p>
          </Section>

          <Section id="temporada" title="¿Cuál es la mejor época para venir?">
            <p>
              En Koh Tao se bucea todo el año - no es un destino de temporada como el Caribe. Pero hay
              meses mejores que otros:
            </p>
            <p>
              <strong>De febrero a mayo, la mejor época:</strong> visibilidad de 20-30 metros o más,
              mar plano y 28-32 grados de aire. La temporada de tiburón ballena está en su punto
              álgido en abril y mayo.
            </p>
            <p>
              <strong>De junio a septiembre, muy bien y con menos gente:</strong> visibilidad de 15-25
              metros, alguna tormenta por la tarde y precios más bajos.
            </p>
            <p>
              <strong>De octubre a mediados de diciembre, temporada de lluvias:</strong> es la que
              nadie te cuenta. Llueve fuerte, el mar se pica en los sitios del norte y la visibilidad
              baja a 5-15 metros en los peores días. Nosotros salimos casi todos los días - nuestros
              barcos son grandes - pero no es lo mismo.
            </p>
            <p>
              <strong>De mediados de diciembre a febrero, vuelve la temporada alta:</strong> las
              condiciones mejoran rápido. Son fechas de vacaciones: reserva el alojamiento con 2-3
              meses de antelación.
            </p>
            <p>
              <strong>Nuestra recomendación:</strong> si puedes elegir, ven en marzo o abril. Si vienes
              igualmente en octubre o noviembre, reserva 5-7 días en la isla para poder aprovechar las
              ventanas de buen tiempo.
            </p>
          </Section>

          <Section id="costes-ocultos" title="Costes ocultos que deberías preguntar antes de reservar">
            <p>
              No todos los centros de Koh Tao te dan el precio final a la primera. Cosas que conviene
              preguntar antes de pagar en ningún sitio:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Precios "desde":</strong> algunos centros anuncian "desde 9,500 THB", pero ese
                precio no incluye el material de PADI, la tarjeta de certificación o las tasas.
                Pregunta siempre: ¿cuál es el precio final, todo incluido?
              </li>
              <li>
                <strong>Material PADI aparte:</strong> el eLearning cuesta entre 2,500 y 3,000 THB si
                te lo cobran por separado. Con nosotros va incluido en el precio del curso.
              </li>
              <li>
                <strong>Suplementos de equipo:</strong> ordenador de buceo, máscara graduada o equipo
                específico pueden sumar 500-1,500 THB. Confírmalo antes.
              </li>
              <li>
                <strong>Suplemento de combustible del barco:</strong> cuando sube el gasoil, algunos
                centros añaden 100-200 THB al día. Ya es poco habitual, pero sigue pasando.
              </li>
              <li>
                <strong>Tamaño del grupo:</strong> PADI permite hasta 8 alumnos por instructor. La
                mayoría de los centros de la isla trabaja con 6-8. Nosotros, con un máximo de 4.
                Pregunta cuántos vais a ser antes de pagar.
              </li>
              <li>
                <strong>Presión para comprar más:</strong> si en pleno Open Water te empujan a añadir
                especialidades o inmersiones extra, mala señal. Termina el curso a tu ritmo; las
                especialidades vienen después.
              </li>
            </ul>
          </Section>

          <Section id="por-que-nosotros" title="¿Por qué Siam Scuba?">
            <p>
              No somos el único centro de la isla, pero hay cosas que nos diferencian y queremos que
              las sepas antes de decidir:
            </p>
            <p>
              <strong>Máximo 4 alumnos por instructor.</strong> Sin excepciones. Significa que el
              instructor te ve de verdad debajo del agua, en vez de repartir su atención entre 8
              personas.
            </p>
            <p>
              <strong>Sin depósito.</strong> Nunca hemos pedido pago por adelantado. Llegas a Koh Tao,
              conoces al equipo, ves los barcos y el equipo, y solo entonces te comprometes. Si no
              encaja con lo que buscabas, no nos debes nada.
            </p>
            <p>
              <strong>Instructores que hablan español.</strong> Puedes hacer el curso entero en tu
              idioma - teoría, briefings y señales - que es exactamente donde se pierde la gente
              cuando estudia en un idioma que no domina.
            </p>
            <p>
              <strong>Dos barcos propios.</strong> Barcos diseñados para bucear (no barcas de pesca
              adaptadas), con espacio, sombra, ducha de agua dulce y botellas listas. En temporada
              alta, esa es la diferencia entre salir a la hora y esperar en el muelle.
            </p>
            <p>
              <strong>Centro PADI 5 Star IDC.</strong> Es la categoría más alta de PADI. Pasamos
              auditorías periódicas y cubrimos todo el camino, de Open Water a instructor, en el mismo
              sitio.
            </p>
            <p>
              <strong>4,9 en Google (845 reseñas) y 5,0 en TripAdvisor (776 reseñas).</strong> No es
              una promesa nuestra: puedes comprobarlo tú mismo antes de escribirnos.
            </p>
          </Section>

          <Section id="reservar" title="Cómo reservar">
            <p>
              Escríbenos por WhatsApp con las fechas que tienes previstas, cuántos sois y qué curso te
              interesa. Contestamos en menos de una hora en horario de día (hora de Tailandia).
            </p>
            <p>
              <strong>Sin depósito.</strong> Se paga al llegar a Koh Tao, después de ver el sitio. La
              mayoría de nuestros alumnos vienen directos del ferry a Mae Haad, se registran y empiezan
              el curso a la mañana siguiente.
            </p>
            <p>
              <strong>Si quieres ahorrarte un día en la isla:</strong> empieza el eLearning de PADI
              antes de llegar. Te pasamos el enlace en cuanto cerramos las fechas, y así puedes ponerte
              a bucear desde el día que llegas.
            </p>
            <div className="mt-6 p-6 rounded-2xl bg-ocean-deep text-center">
              <p className="font-display text-xl font-semibold text-primary-foreground mb-2">
                ¿Listo para reservar? Escríbenos por WhatsApp
              </p>
              <p className="text-primary-foreground/70 text-sm mb-4">
                Contestamos en menos de una hora - también en español
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <a
                  href={SPANISH_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ location: "spanish_landing_footer", url: SPANISH_WHATSAPP_HREF })}
                >
                  <MessageCircle className="h-5 w-5" />
                  Abrir WhatsApp
                </a>
              </Button>
            </div>
          </Section>

          {/* Cross-links to the rest of the Spanish site */}
          <Section id="mas-en-espanol" title="Más contenido en español">
            <ul className="space-y-3">
              <li>
                <Link to="/es/discover-scuba-diving" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Bautismo de buceo (Discover Scuba Diving) - tu primera inmersión
                </Link>
              </li>
              <li>
                <Link to="/es/open-water-course" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Curso PADI Open Water - 2,5 días, certificación de por vida
                </Link>
              </li>
              <li>
                <Link to="/es/advanced-open-water-course" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Curso PADI Advanced Open Water - 1,5 días, 5 inmersiones
                </Link>
              </li>
              <li>
                <Link to="/es/fun-dives" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Inmersiones para buceadores certificados
                </Link>
              </li>
              <li>
                <Link to="/es/sail-rock-diving" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Sail Rock - la mejor inmersión del golfo de Tailandia
                </Link>
              </li>
              <li>
                <Link to="/es/blog/curso-buceo-koh-tao" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Guía: el curso de buceo en Koh Tao paso a paso
                </Link>
              </li>
              <li>
                <Link to="/es/blog/divemaster-koh-tao-padi-espanol" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Guía: el Divemaster PADI en Koh Tao, en español
                </Link>
              </li>
            </ul>
          </Section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default SpanishLanding;
