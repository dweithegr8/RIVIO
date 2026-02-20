import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
            <div className="w-12 h-12 bg-brand-dark-alpha rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-dark" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-950">Terms of Service</h1>
              <p className="text-neutral-400 text-sm mt-1">Last updated: February 19, 2026</p>
            </div>
          </div>
          <p className="text-neutral-500 text-lg">
            Please read these Terms of Service carefully before using the Rivio platform.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-card p-8 md:p-10 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">1. Acceptance of Terms</h2>
            <p className="text-neutral-500">
              By accessing or using the Rivio platform ("Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply 
              to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">2. Description of Service</h2>
            <p className="text-neutral-500">
              Rivio is a customer feedback and reputation management platform that allows businesses to collect, 
              manage, moderate, and publicly display customer reviews. The Service includes a user-facing feedback 
              submission system and an administrative dashboard for managing reviews.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">3. User Accounts</h2>
            <p className="text-neutral-500 mb-4">When using Rivio, you agree to:</p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Provide accurate, current, and complete information during registration or feedback submission.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Maintain the security of your account credentials and accept responsibility for all activities under your account.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Notify us immediately of any unauthorized access to or use of your account.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Not create accounts for the purpose of abusing the platform or impersonating others.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">4. User-Generated Content</h2>
            <p className="text-neutral-500 mb-4">
              By submitting feedback, reviews, or any other content ("User Content") to Rivio, you:
            </p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Grant Rivio a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your User Content on the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Represent that the content is your original work, truthful, and does not violate any third-party rights.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Acknowledge that User Content may be subject to moderation and may be edited, removed, or declined at our discretion.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">5. Prohibited Conduct</h2>
            <p className="text-neutral-500 mb-4">You agree not to:</p>
            <ul className="space-y-2 text-neutral-500">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Submit false, misleading, defamatory, or fraudulent reviews or feedback.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Use the Service to harass, threaten, or intimidate any individual or business.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Upload content that contains hate speech, explicit material, or illegal content.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Attempt to gain unauthorized access to the platform, other user accounts, or connected systems.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Use automated tools, bots, or scripts to submit reviews or scrape content from the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold mt-0.5">•</span>
                Interfere with or disrupt the integrity or performance of the Service.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">6. Moderation & Content Removal</h2>
            <p className="text-neutral-500">
              Rivio reserves the right to review, moderate, edit, or remove any User Content at our sole discretion, 
              without prior notice. We may remove content that violates these Terms, is deemed inappropriate, or that we 
              believe may expose Rivio or its users to harm or legal liability. We are not obligated to monitor all 
              User Content but may do so at our discretion.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">7. Intellectual Property</h2>
            <p className="text-neutral-500">
              The Rivio platform, including its design, logo, branding, software, text, graphics, and other proprietary 
              content, is owned by Rivio and protected by intellectual property laws. You may not copy, reproduce, 
              distribute, modify, or create derivative works from any part of the Service without our express written 
              permission.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-neutral-500">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether 
              express or implied. Rivio does not guarantee that the Service will be uninterrupted, secure, or 
              error-free. We do not warrant the accuracy, completeness, or reliability of any User Content displayed 
              on the platform.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">9. Limitation of Liability</h2>
            <p className="text-neutral-500">
              To the maximum extent permitted by law, Rivio and its officers, directors, employees, and agents shall 
              not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not 
              limited to loss of profits, data, reputation, or business opportunities, arising out of or related to your 
              use of the Service.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">10. Indemnification</h2>
            <p className="text-neutral-500">
              You agree to indemnify, defend, and hold harmless Rivio and its affiliates from any claims, damages, 
              losses, liabilities, and expenses (including reasonable attorney fees) arising out of or related to your 
              use of the Service, your User Content, or your violation of these Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">11. Termination</h2>
            <p className="text-neutral-500">
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause 
              or notice, for conduct that we believe violates these Terms or is harmful to other users, third parties, or 
              the business interests of Rivio. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">12. Governing Law</h2>
            <p className="text-neutral-500">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              United States, without regard to its conflict of law provisions. Any legal disputes arising from these 
              Terms will be resolved in the courts located in San Francisco County, California.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-neutral-950 mb-3">13. Changes to Terms</h2>
            <p className="text-neutral-500">
              We may revise these Terms at any time by posting the updated version on this page. Your continued use of 
              the Service after any changes constitutes acceptance of the new Terms. We encourage you to review these 
              Terms periodically for any updates.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-neutral-25 rounded-lg p-6 border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-950 mb-3">Contact Us</h2>
            <p className="text-neutral-500">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-neutral-800 font-medium">Rivio Legal</p>
              <p className="text-brand-primary">legal@rivio.com</p>
              <p className="text-neutral-500">123 Business Ave, Suite 100, San Francisco, CA 94102</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
