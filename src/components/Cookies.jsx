import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Cookie Policy</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How We Use Cookies and Similar Technologies</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This Cookie Policy explains how GuruLink uses cookies and similar technologies on <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a> to provide, protect, and improve our services. Please read it alongside our <Link to="/privacy" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</Link> and <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">About Cookies</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep the site secure, and understand how you use our services.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Managing Cookies</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              You can control cookies through your browser settings. Options typically include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Refusing some or all cookies</li>
              <li>Receiving alerts when cookies are set</li>
              <li>Deleting cookies already stored on your device</li>
            </ul>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Note: Restricting cookies may affect certain features and functionality of the GuruLink website.
            </p>

            <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <p className="font-semibold">Browser Guides:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.microsoft.com/edge" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Microsoft Edge</a></li>
                <li><a href="https://support.mozilla.org/firefox" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Firefox</a></li>
                <li><a href="https://support.google.com/chrome" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Chrome</a></li>
                <li><a href="https://support.apple.com/safari" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Safari</a></li>
                <li><a href="https://help.opera.com" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Opera</a></li>
              </ul>
              <p className="font-semibold">Mobile Devices:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.google.com/android" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Android: Google Support</a></li>
                <li><a href="https://support.apple.com/ios" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>iOS: Apple Support</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Cookies We Use</h2>
            <div className="space-y-3 text-sm" style={{ color: '#4B5563' }}>
              <div>
                <p className="font-semibold">Essential Cookies</p>
                <p>Purpose: Ensure website functionality and security</p>
                <p>Duration: Session-based</p>
                <p>These cookies are necessary for GuruLink to function properly.</p>
              </div>
              <div>
                <p className="font-semibold">Analytics Cookies</p>
                <p>Purpose: Understand how visitors use our site</p>
                <p>Duration: Persistent</p>
                <p>We use these cookies to improve our services and user experience.</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              We use Google Analytics to analyze website traffic. Learn more about Google&apos;s privacy practices by reviewing their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</a>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Consent</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              By using GuruLink's website, you consent to our use of cookies as described in this policy. You can adjust your settings at any time.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              For questions about this Cookie Policy or our data practices:<br />
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

