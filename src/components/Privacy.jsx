import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Privacy Notice</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How We Handle Your Personal Information</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This Privacy Notice describes how GuruLink gathers, uses, and safeguards your personal information when you interact with our app and related services. By continuing to use GuruLink, you acknowledge and agree to the practices described here as well as in our <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">About Us</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink<br />
              Trident House, 42–43 Victoria Street<br />
              St Albans, Hertfordshire AL1 3HZ<br />
              United Kingdom<br />
              <br />
              Website: <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a><br />
              Email: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a>
            </p>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              For users located in the United Kingdom and the European Union, we act as the data controller. You can contact us at any time with questions about this notice or to exercise your privacy rights.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Scope of This Notice</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              This notice outlines how we handle personal information when you use the GuruLink mobile app and any of our services, including spiritual guidance tools, astrology features, and premium offerings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Information You Provide to Us</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Account information (such as your name, email address, age, and gender)</li>
              <li>Your spiritual objectives and personal preferences</li>
              <li>Birth details needed for astrology-related features</li>
              <li>Palm images for palm reading functionality</li>
              <li>Messages or information submitted to our support team</li>
            </ul>
            <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>Information We Automatically Collect</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Device identifiers and technical details about the device you use</li>
              <li>Usage patterns and interaction data within the app</li>
              <li>App performance data and analytics</li>
            </ul>
            <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>Information We Receive from Third Parties</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Details provided through social login options (Google, Apple, etc.)</li>
              <li>Payment information processed through app stores</li>
              <li>Analytics data from partners like Google Analytics</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Deliver spiritual guidance, astrology insights, and other GuruLink features</li>
              <li>Manage your user profile, app settings, and subscription services</li>
              <li>Enhance and improve the performance of our app</li>
              <li>Reply to support requests and resolve issues</li>
              <li>Send marketing messages or promotional offers (only with your consent)</li>
              <li>Maintain security, prevent misuse, and detect fraudulent activity</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Legal Grounds for Processing</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We process your information under the following bases:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>To perform a contract, such as providing access to the services you&apos;ve requested</li>
              <li>Legitimate interests, including app improvements and ensuring security</li>
              <li>Your consent, particularly for marketing communications and notifications</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sharing Your Information</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We may share your data with:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Service providers who assist us in operating and maintaining GuruLink</li>
              <li>Payment processing partners</li>
              <li>Analytics and advertising partners (only where your device settings allow it)</li>
              <li>Legal authorities when disclosure is required by law</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">International Transfers</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Your information may be transferred to locations outside the UK or EEA. When this occurs, we apply appropriate safeguards to ensure your data remains protected.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Privacy Rights</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>You can request to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Delete your data</li>
              <li>Transfer your data to another provider</li>
              <li>Object to certain types of processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
              To exercise these rights, contact us at <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Data Security</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We take appropriate technical and organizational measures to keep your personal information secure and to prevent unauthorized access, loss, or disclosure.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We retain personal information only for as long as needed to deliver our services or to comply with legal and regulatory requirements.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Children&apos;s Privacy</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              GuruLink is designed for individuals aged 18 and over. We do not knowingly collect information from minors.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Cookies and Tracking Technologies</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We use cookies and similar tools to support core functionality, gather analytics, and provide personalized advertising. You can adjust your cookie and tracking preferences through your device settings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">California Privacy Rights (CCPA)</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>If you reside in California, you may have additional rights, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>The right to know what personal information we collect</li>
              <li>The right to request deletion</li>
              <li>The right to opt out of the sale of personal information</li>
              <li>The right to be free from discrimination for exercising your rights</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Updates to This Privacy Notice</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We may revise this notice periodically. Continued use of the app after any updates signifies your acceptance of the revised version.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              If you have questions about this notice or wish to exercise your privacy rights, you can reach us at:
            </p>
            <p className="text-sm" style={{ color: '#4B5563' }}>
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


