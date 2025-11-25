import { Link } from 'react-router-dom';

export default function CancelSubscription() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>Subscription Management</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How do I cancel my subscription?</h1>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
              To cancel your subscription, you can use our system as follows:
            </p>
            <ol className="space-y-3 text-sm sm:text-base list-decimal list-inside" style={{ color: '#4B5563' }}>
              <li>Login using your email address and confirmation code.</li>
              <li>Proceed with the cancellation option. ✅</li>
            </ol>
            <div className="mt-6 flex justify-center">
              <Link
                to="/cancellation-portal"
                className="px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: '#D4A34B',
                  color: '#1A2336',
                  boxShadow: '0 4px 6px -1px rgba(212, 163, 75, 0.3)'
                }}
              >
                Access Cancellation Portal
              </Link>
            </div>
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#FFF7EB', borderColor: '#D4A34B', borderWidth: '1px' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#1A2336' }}>
                Note: When you cancel a subscription, you will still have access for the time you&apos;ve already paid.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Example:</h2>
            <div className="space-y-2 text-sm sm:text-base" style={{ color: '#4B5563' }}>
              <p>If you buy a monthly subscription on January 1st for £29.99 and cancel on July 1st:</p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>You will still have access until July 31st (the end of your current billing cycle).</li>
                <li>You will not be charged again on August 1st.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Need Assistance?</h2>
            <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
              If you have any questions or need help, contact our support team at:
            </p>
            <p className="text-sm sm:text-base">
              <a href="mailto:help@gurulink.app" className="underline font-semibold" style={{ color: '#D4A34B' }}>
                help@gurulink.app
              </a>
            </p>
          </div>
        </section>

        <div className="pt-8 border-t text-center" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-sm mb-4" style={{ color: '#4B5563' }}>
            Need more information? Check out our other resources:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/support" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Customer Support
            </Link>
            <Link to="/terms" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Privacy Policy
            </Link>
            <Link to="/refund" className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: '#D4A34B' }}>
              Refund Policy
            </Link>
          </div>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: '#1A2336',
                color: '#F5F5F5',
                boxShadow: '0 10px 15px -3px rgba(26, 35, 54, 0.3)'
              }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

