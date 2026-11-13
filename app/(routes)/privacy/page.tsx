import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Calendar, Mail, Eye, Database, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONSENT_COOKIE_MAX_AGE_DAYS, PRIVACY_ADVERTISING_ANCHOR } from '@/lib/tracking-config';
import { MONETAG_PRIVACY_POLICY_URL } from '@/lib/ads/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | FormiqStudio',
  description: 'Privacy policy explaining how FormiqStudio collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-24 sm:pt-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center min-h-11 text-foreground rounded-sm link-draw focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <Lock className="w-6 h-6 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Privacy & Security</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 border border-border rounded-full mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-[2.6rem] leading-[0.98] sm:text-6xl font-bold tracking-[-0.05em] mb-6">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: November 2026
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-[22px] border border-border overflow-hidden">
            <div className="p-8 md:p-12 space-y-8">
              
              {/* Section 1 */}
              <section>
                <div className="flex items-center mb-4">
                  <Database className="w-6 h-6 text-muted-foreground mr-3" />
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">1. Information We Collect</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Fill out contact forms or request quotes</li>
                    <li>Subscribe to our newsletter or updates</li>
                    <li>Communicate with us via email or phone</li>
                    <li>Use our website and services</li>
                    <li>Participate in surveys or feedback sessions</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    This may include your name, email address, phone number, company information, project details, and any other information you choose to provide.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-muted-foreground mr-3" />
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">2. How We Use Your Information</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Communicate about projects, services, and promotional offers</li>
                    <li>Process transactions and send related information</li>
                    <li>Monitor and analyze usage patterns and trends</li>
                    <li>Detect, investigate, and prevent fraudulent activities</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <div className="flex items-center mb-4">
                  <UserCheck className="w-6 h-6 text-muted-foreground mr-3" />
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">3. Information Sharing</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To trusted service providers who assist in our operations</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Any third-party service providers are bound by confidentiality agreements and are prohibited from using your information for any other purpose.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">4. Data Security</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">5. Cookies and Tracking</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve our website functionality</li>
                    <li>Provide personalized content and advertisements</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    You can control cookies through your browser settings, but disabling them may affect website functionality.
                  </p>
                </div>
              </section>

              <section id={PRIVACY_ADVERTISING_ANCHOR} className="scroll-mt-28">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">6. Advertising</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our blog articles may show In-Page Push ads served by Monetag (operated by Propeller Ads Ltd and its group companies). These ads load only on blog article pages, and only after you choose "Accept advertising" or switch on "Blog advertising" in our cookie banner. No ads appear on any other page, and we do not use pop-under, interstitial or push-notification ad formats.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When an ad loads, the ad network may process:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Your IP address and approximate location (country or region)</li>
                    <li>Device, operating system and browser information</li>
                    <li>The page showing the ad and the referring page</li>
                    <li>Cookies or similar identifiers set or read by the ad network</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Monetag says it uses this data to show relevant ads and to detect fraud. Its own processing is described in the{' '}
                    <a href={MONETAG_PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
                      Monetag privacy policy
                    </a>
                    .
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    You can withdraw or change your consent at any time through "Cookie settings" in the site footer. Ads stop from your next page load; an ad script that has already run on the current page cannot be unloaded until you navigate or refresh. We store your choice for {CONSENT_COOKIE_MAX_AGE_DAYS} days in a first-party cookie and in your browser's local storage, and ask again when our list of cookies changes.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">7. Your Rights</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                    <li>Object to processing of your information</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">8. Data Retention</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong className="text-foreground">Job applications.</strong> When you apply through our careers page we collect your name, contact details, location, the links you share (portfolio, CV, LinkedIn) and your message. We use them only to assess your application for the role you applied for and, with your consent, for future roles. We keep applications for 12 months and then delete them. You can ask us to delete your application sooner at any time by emailing us.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">9. International Transfers</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">10. Children's Privacy</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-4 text-foreground">11. Changes to This Policy</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <div className="bg-primary/5 rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">Questions About Your Privacy?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this privacy policy or our data practices, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:hello@formiqstudio.in" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    hello@formiqstudio.in
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
