import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-neutral-25 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-dark transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-primary-alpha rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-950">Privacy Policy</h1>
              <p className="text-neutral-400 text-sm mt-1">Last updated: February 19, 2026</p>
            </div>
          </div>
          <p className="text-neutral-500 text-lg">
            At Rivio, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-card p-8 md:p-10 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">1. Information We Collect</h2>
            <p className="text-neutral-500 mb-4">
              We collect information that you provide directly to us when using the Rivio platform, including:
            </p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Personal Information:</strong> Name, email address, and any other details you provide when submitting feedback or creating an account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Feedback Content:</strong> Reviews, ratings, comments, and any media you submit through our platform.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Usage Data:</strong> Browser type, IP address, pages visited, and interaction patterns with our service.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Device Information:</strong> Operating system, device type, and unique device identifiers.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">2. How We Use Your Information</h2>
            <p className="text-neutral-500 mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Provide, maintain, and improve the Rivio platform and its features.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Process and display customer feedback and reviews.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Communicate with you about your account, submissions, or support requests.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Detect, prevent, and address fraud, abuse, or other harmful activities.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Analyze usage trends to enhance user experience and platform performance.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">3. Information Sharing & Disclosure</h2>
            <p className="text-neutral-500 mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Public Reviews:</strong> Feedback you submit may be displayed publicly on the platform, depending on moderation settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Service Providers:</strong> We may share data with trusted third-party vendors who assist in operating our platform.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Legal Requirements:</strong> When required by law, regulation, or legal process.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                <span><strong className="text-neutral-800">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">4. Data Security</h2>
            <p className="text-neutral-500">
              We implement industry-standard security measures to protect your personal information, including encryption, 
              secure server infrastructure, and access controls. However, no method of electronic transmission or storage 
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">5. Data Retention</h2>
            <p className="text-neutral-500">
              We retain your personal information for as long as necessary to provide our services, comply with legal 
              obligations, resolve disputes, and enforce our agreements. You may request deletion of your data at any 
              time by contacting us.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">6. Your Rights</h2>
            <p className="text-neutral-500 mb-4">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Access, correct, or delete your personal information.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Withdraw consent for data processing.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Request a portable copy of your data.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Object to or restrict certain processing of your data.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">7. Cookies & Tracking</h2>
            <p className="text-neutral-500">
              We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. 
              You can manage cookie preferences through your browser settings. Disabling cookies may affect certain 
              features of the platform.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">8. Third-Party Links</h2>
            <p className="text-neutral-500">
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy 
              practices of these external sites. We encourage you to review their privacy policies before providing any 
              personal information.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">9. Children's Privacy</h2>
            <p className="text-neutral-500">
              Rivio is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children. If we become aware that we have collected data from a child under 13, we will take steps to 
              delete it promptly.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">10. Changes to This Policy</h2>
            <p className="text-neutral-500">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
              the updated policy on this page with a revised "Last updated" date. Your continued use of the platform after 
              changes constitutes acceptance of the revised policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-neutral-25 rounded-lg p-6 border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-950 mb-3">Contact Us</h2>
            <p className="text-neutral-500">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-neutral-800 font-medium">Rivio Support</p>
              <p className="text-brand-primary">support@rivio.com</p>
              <p className="text-neutral-500">123 Business Ave, Suite 100, San Francisco, CA 94102</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
