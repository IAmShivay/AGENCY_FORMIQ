import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Calendar, Mail, Eye, Database, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Privacy Policy | FormiqStudio',
  description: 'Privacy policy explaining how FormiqStudio collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 animated-gradient-text">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: January 2024
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-2xl border border-primary/20 shadow-lg overflow-hidden">
            <div className="p-8 md:p-12 space-y-8">
              
              {/* Section 1 */}
              <section>
                <div className="flex items-center mb-4">
                  <Database className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-primary">1. Information We Collect</h2>
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
                  <Eye className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-primary">2. How We Use Your Information</h2>
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
                  <UserCheck className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-primary">3. Information Sharing</h2>
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
                <h2 className="text-2xl font-bold mb-4 text-primary">4. Data Security</h2>
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
                <h2 className="text-2xl font-bold mb-4 text-primary">5. Cookies and Tracking</h2>
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

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">6. Your Rights</h2>
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

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">7. Data Retention</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">8. International Transfers</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">9. Children's Privacy</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">10. Changes to This Policy</h2>
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
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold mb-4">Questions About Your Privacy?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this privacy policy or our data practices, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:hello@formiqstudio.com" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    hello@formiqstudio.com
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
