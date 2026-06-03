import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Terms and Conditions | FormiqStudio',
  description: 'Terms and conditions for using FormiqStudio services and website.',
};

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Legal Documents</span>
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
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services.
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
                <h2 className="text-2xl font-bold mb-4 text-primary">1. Acceptance of Terms</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using FormiqStudio's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">2. Services Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    FormiqStudio provides custom software development services including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Custom SaaS development</li>
                    <li>Mobile application development</li>
                    <li>Web application development</li>
                    <li>E-commerce platform development</li>
                    <li>Business intelligence solutions</li>
                    <li>API development and integration</li>
                    <li>CRM and ERP systems</li>
                    <li>DevOps and cloud services</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">3. Client Responsibilities</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Clients are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Providing accurate and complete project requirements</li>
                    <li>Timely feedback and approvals during development phases</li>
                    <li>Payment of invoices according to agreed terms</li>
                    <li>Providing necessary access to systems and resources</li>
                    <li>Compliance with applicable laws and regulations</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">4. Payment Terms</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Payment terms are established in individual project agreements. Generally:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Projects require an upfront payment before work begins</li>
                    <li>Milestone payments are due upon completion of agreed deliverables</li>
                    <li>Final payment is due upon project completion and delivery</li>
                    <li>Late payments may incur additional charges</li>
                    <li>Refunds are subject to the terms outlined in individual contracts</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">5. Intellectual Property</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Upon full payment, clients receive ownership of the custom code developed specifically for their project. FormiqStudio retains rights to general methodologies, techniques, and any pre-existing intellectual property. Third-party components and libraries remain subject to their respective licenses.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">6. Confidentiality</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    FormiqStudio maintains strict confidentiality regarding all client information, business processes, and proprietary data. We implement appropriate security measures to protect sensitive information and will not disclose client information to third parties without explicit consent.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">7. Limitation of Liability</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    FormiqStudio's liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages. Our services are provided "as is" and we make no warranties beyond those explicitly stated in individual project agreements.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">8. Termination</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Either party may terminate services with written notice. Upon termination, clients are responsible for payment of all work completed to date. FormiqStudio will provide deliverables for completed milestones upon receipt of payment.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">9. Governing Law</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    These terms are governed by the laws of India. Any disputes will be resolved through arbitration or in the courts of competent jurisdiction in India.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">10. Changes to Terms</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    FormiqStudio reserves the right to modify these terms at any time. Changes will be posted on our website and take effect immediately. Continued use of our services constitutes acceptance of modified terms.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these terms and conditions, please contact us.
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
