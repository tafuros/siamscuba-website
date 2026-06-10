import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DataDeletion = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="Data Deletion Request | Siam Scuba"
        description="Request deletion of personal data Siam Scuba holds about you, at any time."
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Data Deletion</h1>
        <p className="text-muted-foreground text-sm mb-8"><strong>Last updated:</strong> 22 April 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <p>You can ask us to delete personal data we hold about you at any time.</p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">What you can delete</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your WhatsApp conversation history with our assistant "Nemo".</li>
              <li>Your name, email, phone number, and other contact details in our records.</li>
              <li>Enquiries or bookings that are not subject to a legal retention obligation (see Privacy Policy §6).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">What we cannot fully delete</h2>
            <p>
              Some records must be kept for a fixed period under Thai tax law and PADI training standards (for example,
              booking invoices and certification records must be kept for 7 years). We will redact and restrict such
              records so they are not used for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">How to request deletion</h2>
            <p>Send an email to <strong>info@siamscuba.com</strong> with:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>The subject line <strong>"Data deletion request"</strong>.</li>
              <li>The name, email, or WhatsApp number you used when you contacted us or booked.</li>
              <li>A short description of what you want deleted (for example: <em>"my WhatsApp conversation history"</em> or <em>"all personal data you hold about me"</em>).</li>
            </ol>
            <p>
              Or message our WhatsApp assistant Nemo from the number on your account and type <strong>"delete my data"</strong>
              — a human team member will follow up to confirm.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">What happens next</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We acknowledge every request within <strong>7 days</strong>.</li>
              <li>We complete deletion (or explain any legal exception) within <strong>30 days</strong> of the request.</li>
              <li>Once deletion is complete, we send a written confirmation to the email or WhatsApp number you used.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Identity verification</h2>
            <p>
              To protect your privacy we may ask you to confirm ownership of the email or phone number on the account
              before we delete anything.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
            <p>Siam Scuba</p>
            <p>9/9 Koh Tao, Amphoe Ko Pha-Ngan, Surat Thani 84360, Thailand</p>
            <ul className="list-none space-y-1">
              <li><strong>Email:</strong> info@siamscuba.com</li>
              <li><strong>Business phone:</strong> +66 82 506 8898</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataDeletion;
