import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Header } from "@/components/header";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-2">Last Updated: January 16, 2024</p>
          <p className="text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                1. Information We Collect
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Contact and customer data you upload to our platform</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication data when you contact our support team</li>
                </ul>
                <p>
                  We also automatically collect certain information when you use our services, such as IP address,
                  browser type, device information, and usage patterns.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                2. How We Use Your Information
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                3. Data Security
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data centers with physical and digital safeguards</li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is 100% secure.
                  While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <div className="text-gray-700 space-y-3">
                <p>We do not sell your personal information. We may share your information only:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or respond to legal requests</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <div className="text-gray-700 space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at <a href="mailto:privacy@autism.app" className="text-blue-600 hover:underline">privacy@autism.app</a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and hold certain information.
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect
                  personal information from children. If you believe we have collected information from a child,
                  please contact us immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                  the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review
                  this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Autism Platform Privacy Team</p>
                  <p>Email: <a href="mailto:privacy@autism.app" className="text-blue-600 hover:underline">privacy@autism.app</a></p>
                  <p>Address: 123 Business Street, San Francisco, CA 94105, United States</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
