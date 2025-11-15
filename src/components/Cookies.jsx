import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Cookie Policy</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Understanding How GuruLink Uses Cookies</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This Cookie Policy explains how GuruLink uses cookies and similar technologies on <a href="https://gurulink.app" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>https://gurulink.app</a> to operate, secure, and enhance our website. Please review this alongside our <Link to="/privacy" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</Link> and <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">What Are Cookies?</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Cookies are small data files placed on your device when you visit our site. They help us remember your preferences, provide essential functions, and gain insights into how users interact with our services.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Controlling Your Cookie Preferences</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Most browsers and mobile devices allow you to manage how cookies are handled. Depending on your settings, you can:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Block certain cookies</li>
              <li>Receive a notification before a cookie is stored</li>
              <li>Remove cookies that have already been saved on your device</li>
            </ul>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Please be aware that disabling some cookies may affect the performance and functionality of the GuruLink website.
            </p>

            <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <p className="font-semibold">Browser Help Pages</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.microsoft.com/edge" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Microsoft Edge</a></li>
                <li><a href="https://support.mozilla.org/firefox" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Firefox</a></li>
                <li><a href="https://support.google.com/chrome" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Google Chrome</a></li>
                <li><a href="https://support.apple.com/safari" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Safari</a></li>
                <li><a href="https://help.opera.com" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Opera</a></li>
              </ul>
              <p className="font-semibold">Mobile Device Support</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.google.com/android" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Android – Google Support</a></li>
                <li><a href="https://support.apple.com/ios" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>iOS – Apple Support</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Types of Cookies Used on GuruLink</h2>
            <div className="space-y-4 text-sm" style={{ color: '#4B5563' }}>
              <div>
                <p className="font-semibold">Essential Cookies</p>
                <p><span className="font-medium">What they do:</span> Help the site run smoothly and maintain security</p>
                <p><span className="font-medium">How long they last:</span> Active only during your browsing session</p>
                <p className="mt-2">These cookies are necessary for the website to function correctly.</p>
              </div>
              <div>
                <p className="font-semibold">Analytics Cookies</p>
                <p><span className="font-medium">What they do:</span> Provide information on how visitors use the site</p>
                <p><span className="font-medium">How long they last:</span> Persistent</p>
                <p className="mt-2">These tracking tools allow us to improve our website and enhance the user experience.</p>
                <p className="mt-2">We use Google Analytics for traffic insights. You can read about Google&apos;s data practices in their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</a>.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Choice and Consent</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              By using the GuruLink website, you agree to our use of cookies as described in this policy. You may adjust your cookie settings at any time through your browser or device controls.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              If you have questions about this Cookie Policy or how we use data:
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


