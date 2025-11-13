import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Privacy Notice</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How We Handle Your Personal Information</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This notice explains how GuruLink collects, uses, and protects your personal data when you use our app and services. By continuing to use GuruLink, you agree to these practices and our <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Who We Are</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink Ltd<br />
              Trident House, 42-43 Victoria Street<br />
              St Albans, Hertfordshire AL1 3HZ<br />
              United Kingdom<br />
              Website: <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a>
            </p>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We are the data controller for users in the UK and EU. For questions about this notice or to exercise your rights, contact us at <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">What This Notice Covers</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              This notice explains how we collect, use, and protect your personal data when you use our GuruLink app and services, including spiritual guidance, astrology tools, and premium features.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Information You Provide</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Account details (name, email, age, gender)</li>
              <li>Spiritual goals and preferences</li>
              <li>Birth details for astrology services</li>
              <li>Palm images for reading services</li>
              <li>Customer support queries</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Information Collected Automatically</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Device information and unique identifiers</li>
              <li>App usage data and analytics</li>
              <li>Technical details about your device</li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Information from Third Parties</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Social login details (if you sign in with Google, Apple, etc.)</li>
              <li>Payment processing information through app stores</li>
              <li>Analytics from partners such as Google Analytics</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Provide spiritual guidance and astrology services</li>
              <li>Manage your account and subscriptions</li>
              <li>Improve our app experience and services</li>
              <li>Respond to customer support requests</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Ensure app security and prevent fraud</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Legal Basis for Processing</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Contract performance (to deliver the services you requested)</li>
              <li>Legitimate interests (improving the app, maintaining security)</li>
              <li>Your consent (for marketing messages and push notifications)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We may share your information with trusted service providers who help us operate GuruLink, payment processors, analytics partners, advertising partners (with your device consent), and legal authorities when required by law.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">International Transfers</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Your data may be transferred outside the UK/EEA. When this happens, we ensure appropriate safeguards are in place to protect your information.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Rights</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              You have the right to access, correct, delete, or port your personal data, object to processing, and withdraw consent. To exercise these rights, contact us at <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Data Security</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We implement appropriate security measures to protect your personal data from unauthorized access, loss, or disclosure.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We retain your personal data for as long as necessary to provide our services or to comply with legal obligations.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Children&apos;s Privacy</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink is intended for users aged 18 and older. We do not knowingly collect personal data from children.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Cookies and Tracking</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We use cookies and similar technologies for app functionality, analytics, and personalized advertising. You can manage these preferences via your device settings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">California Residents (CCPA)</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              If you are a California resident, you have additional rights under the CCPA, including the right to know what personal information is collected, the right to delete your information, the right to opt out of sales, and the right to non-discrimination.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Changes to This Notice</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We may update this notice periodically. Continued use of our services after an update means you accept the revised policy.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              For questions or to exercise your rights:<br />
              Email: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a><br />
              Website: <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a>
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
