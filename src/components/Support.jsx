import { Link } from 'react-router-dom';

export default function Support() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Support</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Get help from GuruLink support</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            Our dedicated support team is here to assist you with any questions or concerns regarding our spiritual guidance services. Whether you need help with your subscription, have questions about your birth chart readings, need assistance with palm reading analysis, or require technical support, we&apos;re here to help 24/7.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Methods:</h2>
            <ul className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>
                  help@gurulink.app
                </a>
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>
                  https://gurulink.app
                </a>
              </li>
              <li>
                <strong>In-App Support:</strong> Access through your account settings
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Our Support Services Include:</h2>
            <ul className="space-y-2 text-sm list-disc list-inside" style={{ color: '#4B5563' }}>
              <li>Subscription and billing assistance</li>
              <li>Technical troubleshooting</li>
              <li>Spiritual guidance services support</li>
              <li>Birth chart interpretation help</li>
              <li>Palm reading analysis queries</li>
              <li>Account management</li>
              <li>Refund requests</li>
              <li>Feature guidance</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Response Time:</h2>
            <ul className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li><strong>Initial response within 24 hours</strong></li>
              <li><strong>Comprehensive support 24/7/365</strong></li>
              <li><strong>Emergency technical issues:</strong> 6-hour response target</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What to Include in Your Query:</h2>
            <ul className="space-y-2 text-sm list-disc list-inside" style={{ color: '#4B5563' }}>
              <li>Your registered email address</li>
              <li>Detailed description of the issue</li>
              <li>Relevant screenshots (if applicable)</li>
              <li>Device and app version information</li>
              <li>Previous communication references</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-4" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-sm" style={{ color: '#4B5563' }}>
            We are committed to providing you with exceptional support for all your spiritual guidance needs and ensuring your experience with GuruLink is smooth and enlightening.
          </p>
        </section>

        <div className="pt-8 border-t text-center" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-sm mb-4" style={{ color: '#4B5563' }}>
            Need more information? Check out our other resources:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/terms" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Cookie Policy
            </Link>
            <Link to="/refund" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

