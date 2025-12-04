import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { applyTranslation } from '../lib/translation.js';

export default function Terms() {
  const navigate = useNavigate();

  // Re-apply translation when component mounts or language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply translation on mount - immediate
    const state = window.__GuruLinkTranslationState;
    if (state?.lang && state.lang !== 'en') {
      // Use requestAnimationFrame for immediate execution after DOM is ready
      requestAnimationFrame(() => {
        applyTranslation(state.lang, { silent: true }).catch((error) => {
          console.error('Terms page translation error on mount:', error);
        });
      });
    }

    // Listen for language changes - translate immediately
    const handleLanguageChange = (event) => {
      const lang = event?.detail?.lang || window.__GuruLinkTranslationState?.lang;
      
      if (!lang || lang === 'en') {
        if (lang === 'en') {
          window.location.reload();
        }
        return;
      }

      // Translate immediately - use requestAnimationFrame for next frame
      // The global translation from changeLanguage() should already translate everything,
      // but we force a refresh to ensure Terms page content is included
      requestAnimationFrame(() => {
        applyTranslation(lang, { silent: true })
          .then(() => {
            console.log('Terms page translation completed for language:', lang);
          })
          .catch((error) => {
            console.error('Terms page translation error:', error);
            // Try once more after a brief delay
            setTimeout(() => {
              applyTranslation(lang, { silent: true }).catch(console.error);
            }, 500);
          });
      });
    };

    window.addEventListener('gurulink:language-applied', handleLanguageChange);
    return () => window.removeEventListener('gurulink:language-applied', handleLanguageChange);
  }, []);
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left" style={{ color: '#1A2336' }}>
        <div className="space-y-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">GURU LINK – TERMS &amp; CONDITIONS</h1>
          <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>
            These Terms &amp; Conditions (&quot;Terms&quot;) form a binding agreement between you and Guru Link, operated by Gurulink, located. By accessing, installing, or using any Guru Link services, you acknowledge that you have read, understood, and agreed to comply with these Terms. If you do not agree, you must stop using the Service immediately.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-8" style={{ borderColor: '#E5E7EB' }}>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">1. Definitions</h2>
            
            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: '#4B5563' }}>1.1 Company Terminology</p>
              <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <li><strong>Guru Link / Company / We / Us / Our:</strong> Refers to Gurulink operating under the brand name Guru Link.</li>
                <li><strong>Service:</strong> All products, features, tools, content, software, reports, and digital experiences offered by Guru Link.</li>
                <li><strong>Platform:</strong> The Guru Link mobile application, website, and all related digital systems.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-4" style={{ color: '#4B5563' }}>1.2 User Terminology</p>
              <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <li><strong>User / You / Your:</strong> Any person who accesses or interacts with the Service.</li>
                <li><strong>Account:</strong> A registered profile used to access features of the Service.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-4" style={{ color: '#4B5563' }}>1.3 Guidance Terminology</p>
              <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <li><strong>Birth Chart Reading:</strong> A personalized astrological interpretation generated using your birth data.</li>
                <li><strong>Spiritual Content:</strong> Interpretations, reports, predictions, insights, and general guidance supplied by the service</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-4" style={{ color: '#4B5563' }}>1.4 Payment Terminology</p>
              <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <li><strong>Subscription:</strong> A recurring paid plan that unlocks premium features.</li>
                <li><strong>Billing Cycle:</strong> The recurring time period during which subscription fees are charged.</li>
                <li><strong>Trial Period:</strong> Temporary access that may convert into a paid subscription if not canceled.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">2. Introduction</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Guru Link provides spiritual guidance services, including astrology-based interpretations, personal insight tools, and advisor consultations. These services are designed for entertainment, personal reflection, and educational use only. They are not scientifically verified or guaranteed to produce specific results.
            </p>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Your continued use of the Platform indicates your acceptance of these Terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">3. Spiritual &amp; Esoteric Services Disclaimer</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Guru Link offers content related to astrology, spiritual insights, and esoteric practices. These materials are:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Not intended as professional advice,</li>
              <li>Not a substitute for licensed medical, psychological, financial, or legal services,</li>
              <li>Not guaranteed to be accurate or predictive of actual life outcomes.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              You are solely responsible for any decisions you make based on information obtained through the Service.
            </p>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
              If you need professional assistance in any area of your life, please contact a qualified expert.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">4. Acceptance of Terms</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>You agree to be bound by these Terms when you:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Install the app,</li>
              <li>Create an account,</li>
              <li>Use any feature of the Service,</li>
              <li>Purchase or subscribe to any product,</li>
              <li>Engage with an advisor,</li>
              <li>Or continue accessing the Platform in any manner.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              If you do not agree with the Terms at any point, you must stop using the Service immediately.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">5. Eligibility &amp; Account Requirements</h2>
            
            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>5.1 Age Requirement</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                You must be at least 18 years old to use the Service.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>5.2 Accuracy of Information</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                You agree to provide truthful, complete, and current information when creating or updating your account.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>5.3 Responsibility for Account Use</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
              </p>
              <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
                We may suspend or terminate accounts found to violate these Terms.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">6. Subscription Services</h2>
            
            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>6.1 Subscription Terms</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Certain features require a paid subscription. When you begin a subscription, charges occur immediately and automatically renew at the end of each billing cycle unless canceled.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>6.2 Auto-Renewal</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Unless canceled at least 24 hours prior to the renewal date, subscriptions renew automatically at the applicable rate.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>6.3 Payment Responsibility</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Payments are processed through authorized payment providers or app marketplaces. Guru Link does not store your financial information.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">7. Refund Policy</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Purchases made through third-party marketplaces are subject to their respective policies. Guru Link cannot issue refunds for transactions processed through external stores.
            </p>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Refunds requested for purchases made directly through Guru Link will be evaluated at our discretion, where permitted by applicable law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">8. Intellectual Property</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              All materials provided through the Service — including text, graphics, software, images, reports, readings, logos, and designs — are owned by Guru Link or its licensors.
            </p>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Copy,</li>
              <li>Reproduce,</li>
              <li>Modify,</li>
              <li>Sell,</li>
              <li>Distribute, or</li>
              <li>Create derivative works</li>
            </ul>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
              from any part of the Service without written authorization.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">9. User-Submitted Content</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              By providing information, messages, images, or other materials to the Service, you grant Guru Link a non-exclusive, worldwide, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Store,</li>
              <li>Process,</li>
              <li>Use,</li>
              <li>Analyze, and</li>
              <li>Display</li>
            </ul>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
              the content solely to operate, improve, and provide the Service.
            </p>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              You agree not to upload harmful, illegal, abusive, or infringing content.
            </p>
            <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
              Guru Link does not sell personal data.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">10. Service Level &amp; Availability</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Guru Link strives to maintain stable access to its Platform, but does not guarantee uninterrupted availability.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Emergency technical issues will receive a targeted initial response within approximately 6 hours.</li>
              <li>General support inquiries will receive a response within approximately 24 hours.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Occasional downtime may occur due to maintenance or unforeseen issues.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">11. Technical Requirements</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>To access the Service, you must have:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>A compatible device,</li>
              <li>An active internet connection,</li>
              <li>The current version of the Guru Link app.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Performance may vary depending on your device and operating system.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">12. Customer Support &amp; Complaints</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              You may contact Guru Link support directly through in-app options or email. When submitting a request, provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>The email associated with your account,</li>
              <li>A clear explanation of your issue,</li>
              <li>Screenshots when applicable,</li>
              <li>Device model and app version,</li>
              <li>Any previous communication or ticket references.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              We will respond as promptly as possible.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">13. Limitation of Liability</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>To the fullest extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Guru Link is not responsible for reliance on spiritual, astrological, or esoteric content.</li>
              <li>We make no guarantees regarding accuracy, completeness, or usefulness of readings or insights.</li>
              <li>The Service is provided &quot;as is&quot; and &quot;as available.&quot;</li>
              <li>We are not liable for indirect, incidental, consequential, or special damages arising from use of the Service.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Your use of the Platform is entirely at your own discretion and risk.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">14. Dispute Resolution</h2>
            
            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>14.1 Governing Law</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                These Terms are governed by the laws of United Kingdom and Wales.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium mt-3" style={{ color: '#4B5563' }}>14.2 Mandatory Arbitration</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Any dispute, claim, or disagreement must be resolved through binding arbitration. You waive the right to participate in class actions or jury trials.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">15. Modifications to the Service</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Guru Link may revise, update, or discontinue any part of the Service at any time. Major changes may be communicated to users when appropriate.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">16. Termination of Account</h2>
            <p className="text-sm" style={{ color: '#4B5563' }}>We may suspend or terminate your access if you:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>Violate these Terms,</li>
              <li>Misuse the Service,</li>
              <li>Provide false information,</li>
              <li>Engage in harmful behavior,</li>
              <li>Attempt to bypass security features.</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: '#4B5563' }}>
              Termination does not entitle you to refunds unless required by applicable law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">17. General Legal Provisions</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm" style={{ color: '#4B5563' }}>
              <li>If any section of these Terms is deemed unenforceable, the remaining provisions stay in full effect.</li>
              <li>These Terms represent the complete agreement between you and Guru Link.</li>
              <li>Your continued use of the Service constitutes ongoing acceptance of any updates or changes to these Terms.</li>
            </ul>
          </div>
        </section>

        <div className="text-center">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold" 
            style={{ backgroundColor: '#1A2336', color: '#F5F5F5' }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
