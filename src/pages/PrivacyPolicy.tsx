import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="Privacy Policy | Siam Scuba"
        description="How Siam Scuba collects, uses, and safeguards your personal information when you visit siamscuba.com or use our services."
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-36 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>Siam Scuba ("we," "our," or "us") operates the website siamscuba.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our website, you consent to the practices described in this policy.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <h3 className="font-semibold text-foreground/90">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Diving certification level</li>
              <li>Booking and reservation details</li>
              <li>Payment information (processed securely via third-party providers)</li>
            </ul>
            <h3 className="font-semibold text-foreground/90 mt-4">Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited, time spent, and referring URLs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processing bookings and reservations</li>
              <li>Communicating with you about your inquiries and bookings</li>
              <li>Improving our website and services</li>
              <li>Sending promotional communications (with your consent)</li>
              <li>Complying with legal obligations</li>
              <li>Analyzing website usage and trends</li>
              <li>Preventing fraud and ensuring security</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. Cookies and Tracking Technologies</h2>
            <p>We use cookies, web beacons, and similar technologies to enhance your experience. These include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site (e.g., Google Analytics)</li>
              <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="mt-2">You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Third-Party Services</h2>
            <p>We may share your information with trusted third parties, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment processors for secure transaction handling</li>
              <li>Analytics providers (e.g., Google Analytics, Google Tag Manager)</li>
              <li>Communication platforms (e.g., WhatsApp, email services)</li>
              <li>Booking and scheduling platforms</li>
            </ul>
            <p className="mt-2">These third parties have their own privacy policies, and we encourage you to review them.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Data Retention</h2>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When no longer needed, data is securely deleted or anonymized.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your personal data</li>
              <li><strong>Withdraw consent:</strong> Withdraw previously given consent at any time</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please contact us at info@siamscuba.com.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">9. Children's Privacy</h2>
            <p>Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately so we can delete it.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">10. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">12. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Email:</strong> info@siamscuba.com</li>
              <li><strong>Phone:</strong> +972 52 864 1581</li>
              <li><strong>Address:</strong> Sairee Beach, Koh Tao, Surat Thani, Thailand</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
