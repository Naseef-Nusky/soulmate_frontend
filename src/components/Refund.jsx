import { Link } from 'react-router-dom';

export default function Refund() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: '#D4A34B' }}>GuruLink Refund Policy</p>
          <h1 className="text-3xl sm:text-4xl font-bold">How Refunds Work at GuruLink</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This refund policy explains when and how you can request a refund for GuruLink services. Please read it alongside our <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link> and <Link to="/privacy" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7.1 Trial Period Refunds</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>Trials (£0.50, £3.99, £5, £6.99, £9, £13.21) are eligible for a full refund within 30 days if all conditions are met:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>You are a first-time trial user</li>
              <li>No previous trial refunds on any GuruLink account</li>
              <li>No violations of our Terms &amp; Conditions</li>
              <li>You submit your request through official support channels</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7.2 Regular Subscription Refunds</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>Regular subscriptions are generally non-refundable unless one of the following applies:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li><strong>Service Unavailability:</strong> Documented downtime exceeding 24 consecutive hours</li>
              <li><strong>Technical Issues:</strong> Platform bugs preventing access to core features (must be reported within 30 days)</li>
              <li><strong>Billing Errors:</strong> Duplicate charges, incorrect amounts, or unauthorized transactions</li>
              <li><strong>Legal Requirements:</strong> Refunds mandated by UK consumer law</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7.3 Non-Refundable Cases</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We cannot offer refunds in these circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Partial or unused subscription time after cancellation</li>
              <li>Plan downgrades</li>
              <li>Temporary feature unavailability during maintenance</li>
              <li>Change of mind or no longer needing the service</li>
              <li>Failure to cancel before automatic renewal</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7.4 Refund Process</h2>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Submit your request through one of these official channels:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>GuruLink Help Center</li>
              <li>Support portal</li>
              <li>Email: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a></li>
            </ul>
            <p className="text-sm font-medium" style={{ color: '#4B5563' }}>Please include:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <li>Your account email</li>
              <li>Transaction details</li>
              <li>Reason for the refund</li>
              <li>Supporting documentation (if applicable)</li>
            </ul>
            <p className="text-sm" style={{ color: '#4B5563' }}>We aim to process all refund requests within 3 business days.</p>

            <div className="space-y-1 text-sm" style={{ color: '#4B5563' }}>
              <p className="font-semibold">7.4.1 Refund Payment Methods</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refunds are issued only to the original payment method</li>
                <li>If a card has expired or been cancelled, the refund is sent to the same card and your bank handles the credit</li>
                <li>Whether refunds are accepted on expired cards depends on your bank&apos;s policies</li>
              </ul>
            </div>
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
