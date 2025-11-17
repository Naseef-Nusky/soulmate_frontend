import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function PaymentDialog({
  amountLabel,
  currencyLabel,
  onCancel,
  onSuccess,
  email,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please try again.');
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment not completed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wide text-[#D4A34B]">Secure Checkout</p>
          <h2 className="text-2xl font-bold text-[#1A2336]">
            Unlock GuruLink for {amountLabel}
          </h2>
          <p className="text-sm text-[#4B5563] mt-1">
            Complete your payment to continue creating your soulmate profile.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <PaymentElement />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-lg border border-[#1A2336] px-4 py-3 font-semibold text-[#1A2336] transition hover:bg-[#F5F5F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || submitting}
              className="w-full rounded-lg bg-[#1A2336] px-4 py-3 font-semibold text-white transition hover:bg-[#D4A34B] hover:text-[#1A2336] disabled:opacity-50"
            >
              {submitting ? 'Processing...' : `Pay ${amountLabel}`}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-[#6b7280]">
          SECURED BY STRIPE · {currencyLabel}
        </p>
      </div>
    </div>
  );
}


