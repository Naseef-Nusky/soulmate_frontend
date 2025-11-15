import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Terms &amp; Conditions</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How GuruLink Operates</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            These Terms explain how you may use GuruLink and its services. By continuing to browse our website or access our products, you acknowledge and agree to the rules outlined here.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Service Provider</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink<br />
              Trident House, 42–43 Victoria Street<br />
              St Albans, Hertfordshire AL1 3HZ<br />
              United Kingdom<br />
              Website: <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">1. Agreement to These Terms</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              By using GuruLink (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;), you confirm that you accept these Terms. GuruLink offers spiritual and metaphysical services, including palm readings, birth chart insights, and related features available through our platform.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">2. Services We Offer</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>Our platform includes:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Digital palmistry and astrology tools</li>
              <li>Personal birth chart interpretations and spiritual guidance</li>
              <li>Expert consultations via chat or video sessions</li>
              <li>Subscription-based upgrades and premium services</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">3. Important Notices &amp; Disclaimers</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Our services are intended for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Entertainment</li>
              <li>Spiritual exploration and personal insight</li>
              <li>Educational and reflective purposes</li>
            </ul>
            <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>They are not intended to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Replace professional medical, legal, or financial advice</li>
              <li>Serve as the basis for significant life decisions</li>
              <li>Guarantee predictions or outcomes</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">4. Account Eligibility</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>To use GuruLink, you must:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Be at least 18 years old</li>
              <li>Create only one user account</li>
              <li>Provide accurate and truthful information</li>
              <li>Keep your login credentials private and secure</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">5. Subscription Plans</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Trial Access</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>A 7-day introductory trial is available</li>
              <li>Pricing begins at £1.00</li>
              <li>Trials automatically convert into a paid plan unless cancelled</li>
            </ul>
            <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>Subscription Options</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Weekly plans: £7.99–£14.99</li>
              <li>Monthly plans: £19.99–£49</li>
            </ul>
            <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>Payments</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Payments are processed securely</li>
              <li>Major credit and debit cards accepted</li>
              <li>Subscriptions renew automatically until cancelled</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">6. Cancellations &amp; Refunds</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>How to Cancel</p>
            <p className="text-sm" style={{ color: '#4B5563' }}>You may cancel:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Through your account settings</li>
              <li>By emailing <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a></li>
            </ul>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>Cancellations apply at the end of the current billing cycle.</p>
            <p className="text-sm font-medium mt-4" style={{ color: '#4B5563' }}>Refund Terms</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Trial fees can be refunded within 30 days</li>
              <li>Standard subscriptions are generally non-refundable</li>
              <li>Exceptions may apply if services are unavailable</li>
              <li>Refunds are issued only to the original payment method</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7. User Obligations</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>Users agree to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Provide correct birth information for readings</li>
              <li>Upload clear palm images</li>
              <li>Interact respectfully with advisors and experts</li>
              <li>Refrain from recording sessions without permission</li>
              <li>Use the app responsibly and ethically</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">8. Intellectual Property Rights</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              All content, technologies, algorithms, trademarks, and materials belonging to GuruLink remain our exclusive property. You receive a limited, personal, non-transferable right to access and use the platform.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">9. Limitations of Liability</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>GuruLink is not responsible for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Choices or actions taken based on readings</li>
              <li>Interruptions caused by events outside of our control</li>
              <li>Device-related technical problems</li>
              <li>The accuracy or interpretation of analyses provided</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">10. Resolving Disputes</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              These Terms are governed by the laws of England and Wales. We encourage you to contact us first to address concerns. Any legal action must be pursued through the courts located in the United Kingdom.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">11. Updates to These Terms</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We may revise our Terms from time to time. You will receive at least 30 days&apos; notice of any significant changes. Continued use of GuruLink after updates indicates acceptance of the new Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">12. Contact Details</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Customer Support: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a><br />
              Legal Enquiries: <a href="mailto:legal@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>legal@gurulink.app</a>
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold" style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}


