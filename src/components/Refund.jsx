import { Link } from 'react-router-dom';

export default function Refund() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">GuruLink Refund Policy</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold">When You Can Receive a Refund</h2>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            This document explains the circumstances under which users may request a refund for purchases made through GuruLink. Please read it together with our <Link to="/terms" className="underline" style={{ color: '#D4A34B' }}>Terms &amp; Conditions</Link> and <Link to="/privacy" className="underline" style={{ color: '#D4A34B' }}>Privacy Policy</Link>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-8" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Refund Eligibility for Trial Plans</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>The following trial offers (£1.00, £3.99, £6.99, £9.99) may be refunded in full within 30 days if all of the conditions below are met:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>You are using a GuruLink trial for the very first time</li>
              <li>No previous trial refund has been granted to your account or any account linked to you</li>
              <li>You have complied with all of GuruLink&apos;s Terms &amp; Conditions</li>
              <li>Your request is submitted through an official support channel</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Refund Eligibility for Standard Subscriptions</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>Paid subscription fees are usually not refundable, unless one of these situations applies:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li><strong>Extended Service Outage:</strong> The service was unavailable for more than 24 straight hours and the issue is confirmed</li>
              <li><strong>Technical Malfunctions:</strong> Errors or platform problems prevent you from accessing essential features (must be reported within 30 days)</li>
              <li><strong>Billing Issues:</strong> Incorrect charges, accidental duplicates, or unauthorized payments</li>
              <li><strong>Legal Requirements:</strong> A refund is required by consumer protection laws in the UK</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">When Refunds Cannot Be Offered</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We are unable to issue refunds in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Any remaining time on a subscription after you decide to cancel</li>
              <li>Reducing your plan to a lower tier</li>
              <li>Minor or temporary disruptions caused by scheduled maintenance</li>
              <li>Simply changing your mind or deciding you no longer want the service</li>
              <li>Not cancelling before the next renewal date</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">How to Request a Refund</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>To request a refund, please contact us via one of these official methods:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>GuruLink Help Center</li>
              <li>GuruLink support portal</li>
              <li>Email: <a href="mailto:help@gurulink.app" className="underline" style={{ color: '#D4A34B' }}>help@gurulink.app</a></li>
            </ul>
            <p className="text-sm font-medium mt-4" style={{ color: '#4B5563' }}>Your message should include:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>The email associated with your account</li>
              <li>Details of the payment</li>
              <li>The reason you&apos;re seeking a refund</li>
              <li>Any relevant proof or documentation, if needed</li>
            </ul>
            <p className="text-sm mt-4" style={{ color: '#4B5563' }}>We aim to review and respond to refund requests within 3 business days.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Refund Payment Method</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Refunds are always returned to the original payment method</li>
              <li>If your card has expired or been replaced, the refund will still be sent to that same card number; your bank will process the credit</li>
              <li>Whether a refund is accepted on an expired card depends on your bank&apos;s policies</li>
            </ul>
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
