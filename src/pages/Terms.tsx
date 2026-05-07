import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="Terms of Service | Siam Scuba"
        description='Terms governing your use of siamscuba.com, our WhatsApp assistant "Nemo", and the dive-related services we offer.'
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-8"><strong>Last updated:</strong> 22 April 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <p>
            These terms govern your use of <strong>siamscuba.com</strong>, our WhatsApp assistant "Nemo", and the
            dive-related services we offer. By using any of these, you accept these terms.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Who we are</h2>
            <p>Siam Scuba, a PADI dive centre on Koh Tao, Thailand.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Address:</strong> 9/9 Koh Tao, Amphoe Ko Pha-Ngan, Surat Thani 84360, Thailand</li>
              <li><strong>Business phone:</strong> +66 82 506 8898</li>
              <li><strong>Email:</strong> info@siamscuba.com</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Our services</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Recreational scuba diving courses and certifications under PADI standards.</li>
              <li>Fun dives and guided dive trips.</li>
              <li>Equipment rental and related gear.</li>
              <li>Information and booking assistance through siamscuba.com, email, and our WhatsApp assistant.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. Bookings and payment</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Quoted prices are in Thai Baht unless stated otherwise and include standard dive-centre services.</li>
              <li>A booking is confirmed only once we send a written confirmation (email or WhatsApp).</li>
              <li>Payment terms are stated at the time of booking.</li>
              <li>Cancellation, refund, and rescheduling terms are provided before booking and accepted by you at confirmation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. Eligibility and safety</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Diving carries inherent risks. You must complete a medical declaration and disclose any condition that affects diving.</li>
              <li>Minimum age: 10 years (Junior Open Water). Minors require signed parental consent.</li>
              <li>We may refuse to train or guide anyone we judge unfit to dive, with no obligation to refund a non-cancellable component.</li>
              <li>You must follow the briefings, safety rules, and instructor directions at all times. Failure to do so is grounds for terminating a course or trip without refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Use of the WhatsApp assistant (Nemo)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nemo is an AI assistant. Answers are generated automatically and may contain errors. For anything safety-critical, price-critical, or booking-critical, please confirm with a human team member before acting.</li>
              <li>Do not send Nemo confidential information, payment-card details, or material you do not want processed by a third-party AI provider (see Privacy Policy §4).</li>
              <li>We may record, review, and store messages to improve the service and for operational purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Website content</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Website content is provided for information only and may change without notice.</li>
              <li>Photos on the site may include identifiable divers, posted with permission. If you appear in a photo and want it removed, contact <strong>info@siamscuba.com</strong>.</li>
              <li>You may not copy, scrape, or redistribute site content for commercial use without written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Intellectual property</h2>
            <p>
              All logos, photos, written content, and designs on siamscuba.com are the property of Siam Scuba or our
              licensors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">8. Liability</h2>
            <p>To the extent permitted by Thai law:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We are liable only for direct, foreseeable losses that result from our negligence or a breach of these terms.</li>
              <li>We are not liable for events outside our reasonable control (weather, sea conditions, force majeure, government action).</li>
              <li>Nothing in these terms excludes liability we are not permitted to exclude by law — including liability for death or personal injury caused by our proven negligence.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">9. Governing law</h2>
            <p>
              These terms are governed by the laws of Thailand. Any dispute is subject to the exclusive jurisdiction
              of the courts of Surat Thani Province.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">10. Changes</h2>
            <p>
              We may update these terms from time to time. The "Last updated" date at the top reflects the most recent
              change.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">11. Contact</h2>
            <p><strong>info@siamscuba.com</strong></p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
