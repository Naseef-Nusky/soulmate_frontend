import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Terms &amp; Conditions</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Understand How GuruLink Works</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            These terms govern your use of GuruLink&apos;s services. By continuing to use our website or products, you agree to the policies described below.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Service Provider</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink Ltd<br />
              Trident House, 42-43 Victoria Street<br />
              St Albans, Hertfordshire AL1 3HZ<br />
              United Kingdom<br />
              Website: <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              By accessing GuruLink (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), you agree to these Terms. We provide spiritual guidance services including birth chart analysis and palm readings through our platform.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">2. Service Description</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Digital astrology and palm reading services</li>
              <li>Birth chart analysis and spiritual guidance</li>
              <li>Expert consultations via chat or video</li>
              <li>Subscription-based premium features</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">3. Important Disclaimers</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Our services are intended for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Entertainment purposes</li>
              <li>Personal reflection and spiritual guidance</li>
              <li>Educational value</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>They are not intended for:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Professional medical, financial, or legal advice</li>
              <li>Making important life decisions</li>
              <li>Predicting future events with certainty</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">4. Account Requirements</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>You must be 18 years or older</li>
              <li>Only one account per user</li>
              <li>Accurate information is required</li>
              <li>Keep your login details secure</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">5. Subscription Plans</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Trial Period</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>7-day trial available</li>
              <li>Price starts from £0.50</li>
              <li>Converts to paid subscription automatically</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Subscription Options</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Weekly plans: £7.99 - £14.99 per week</li>
              <li>Monthly plans: £19.99 - £49 per month</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Payment</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Major cards accepted</li>
              <li>Secure payment processing</li>
              <li>Auto-renewal until cancelled</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">6. Cancellation &amp; Refunds</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>How to Cancel</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Self-service via account settings</li>
              <li>Email: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a></li>
              <li>Cancellation becomes effective at the end of the current billing period</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Refund Policy</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Trial periods: refundable within 30 days</li>
              <li>Regular subscriptions: generally non-refundable</li>
              <li>Exceptions made for service unavailability</li>
              <li>All refunds returned to the original payment method</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Provide accurate birth information</li>
              <li>Submit clear palm images</li>
              <li>Maintain respectful communication with experts</li>
              <li>Do not record sessions without consent</li>
              <li>Use the services responsibly</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">8. Intellectual Property</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink owns all platform content, technologies, analytical methods, algorithms, and trademarks. Your access is limited to a personal, non-transferable license.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">9. Limitations</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink is not liable for personal decisions made based on readings, service interruptions beyond our control, technical issues with user devices, or the accuracy of interpretations.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">10. Dispute Resolution</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              These terms are governed by the laws of England and Wales. Please contact us first to resolve any issues. Legal proceedings must take place in UK courts.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">11. Changes to Terms</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We may update these terms with 30 days&apos; notice. Continued use of GuruLink after updates means you accept the revised terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">12. Contact Information</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Customer Support: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a><br />
              Legal Matters: <a href="mailto:legal@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>legal@gurulink.app</a>
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

