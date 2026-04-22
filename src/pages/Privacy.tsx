import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PAGE_TITLE = "Privacy Policy – Siam Scuba";
const PAGE_DESCRIPTION =
  'Siam Scuba ("we", "us", "our") operates siamscuba.com and the WhatsApp assistant "Nemo" reachable at +972 52-864-1581. This policy explains what personal data we collect, why, and your rights over it.';

const Privacy = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? null;
    metaDesc?.setAttribute("content", PAGE_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) metaDesc?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8"><strong>Last updated:</strong> 22 April 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <p>
            Siam Scuba ("we", "us", "our") operates <strong>siamscuba.com</strong> and the WhatsApp assistant "Nemo"
            reachable at <strong>+972 52-864-1581</strong>. This policy explains what personal data we collect, why,
            and your rights over it.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Who we are</h2>
            <p>Siam Scuba is a PADI dive centre based on Koh Tao, Thailand.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Address:</strong> 9/9 Koh Tao, Amphoe Ko Pha-Ngan, Surat Thani 84360, Thailand</li>
              <li><strong>Business phone:</strong> +66 82 506 8898</li>
              <li><strong>Email:</strong> info@siamscuba.com</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Data we collect</h2>
            <p>When you interact with us through the website, WhatsApp, or in person we may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Identification data</strong> — name, email address, phone/WhatsApp number, nationality, date of birth (as required for PADI certification).</li>
              <li><strong>Diving history</strong> — certification level, number of logged dives, relevant medical declarations (only when needed for a specific course).</li>
              <li><strong>Booking data</strong> — course or trip selected, dates, accommodation preference, payment method.</li>
              <li><strong>Messages</strong> — the content of WhatsApp conversations with Nemo and any email you send us.</li>
              <li><strong>Technical data</strong> — IP address, browser type, pages visited, referral source (via standard web analytics).</li>
            </ul>
            <p>We never collect payment-card details directly; payments are processed by our third-party payment provider.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. Why we use it</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To answer questions and schedule dives, courses, and transfers.</li>
              <li>To meet PADI and Thai regulatory requirements for dive training records.</li>
              <li>To send booking confirmations and safety information.</li>
              <li>To improve our services and website.</li>
              <li>To comply with tax, accounting, and other legal obligations in Thailand.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. AI assistant (Nemo)</h2>
            <p>
              Our WhatsApp assistant uses <strong>Google Gemini</strong> to generate replies. When you message Nemo,
              the text of your message is sent to Google's Gemini API together with information about our services
              drawn from siamscuba.com. Google processes the message under its own privacy terms and does not use it to
              train general models. We store WhatsApp conversations for operational and quality purposes and delete
              them on request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Who we share data with</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Meta Platforms, Inc.</strong> — as the operator of WhatsApp Business Cloud API.</li>
              <li><strong>Google LLC</strong> — as the operator of the Gemini AI service.</li>
              <li><strong>Our payment, email, and hosting providers</strong> — strictly to deliver the service you requested.</li>
              <li><strong>Thai authorities</strong> — where required by law.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. How long we keep it</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Booking and certification records: <strong>7 years</strong> (Thai tax and PADI training standards).</li>
              <li>WhatsApp conversation history: <strong>24 months</strong> or until you ask us to delete it.</li>
              <li>Website analytics: <strong>14 months</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Your rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>access the personal data we hold about you;</li>
              <li>correct inaccurate data;</li>
              <li>request deletion (see our <Link to="/data-deletion" className="text-primary hover:underline">Data Deletion page</Link>);</li>
              <li>object to or restrict certain processing;</li>
              <li>receive a copy of your data in a portable format;</li>
              <li>lodge a complaint with your local data-protection authority.</li>
            </ul>
            <p>To exercise any of these rights, email <strong>info@siamscuba.com</strong>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">8. International transfers</h2>
            <p>
              Our service providers (Meta, Google, hosting) process data outside Thailand. We rely on their standard
              contractual safeguards.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">9. Children</h2>
            <p>
              Our services are aimed at divers aged 10 and over. Divers under 18 require parental consent, which we
              collect as part of the booking process.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">10. Changes to this policy</h2>
            <p>We will post material changes on this page and update the "Last updated" date above.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">11. Contact</h2>
            <p>Questions or complaints: <strong>info@siamscuba.com</strong></p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
