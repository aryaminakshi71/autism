import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, MessageSquare, Book, Video, Search, Mail, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@autism-legacy-20260205/ui";
import { Header } from "@/components/header";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Get Started' button on our homepage, fill in your details, and verify your email address. You'll be up and running in minutes!",
      },
      {
        q: "Is there a free trial?",
        a: "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
      },
      {
        q: "Can I import my existing contacts?",
        a: "Absolutely! You can import learner profiles via CSV or Excel and map fields to assessments, goals, and care team assignments.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express) and ACH transfers for annual plans.",
      },
      {
        q: "Can I change my plan later?",
        a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.",
      },
    ],
  },
  {
    title: "Features & Usage",
    questions: [
      {
        q: "How many contacts can I store?",
        a: "This depends on your plan. Starter plans include 100 learners, while growth plans support larger caseloads and multi-site teams.",
      },
      {
        q: "Can I customize care pathways?",
        a: "Yes! You can create custom pathway stages, add plan fields, and set up automation workflows to match your clinical process.",
      },
      {
        q: "Is there a mobile app?",
        a: "Our platform is fully responsive and works great on mobile browsers. Native iOS and Android apps are coming soon!",
      },
    ],
  },
];

function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Support Center</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers, get help, and learn how to make the most of Autism Platform.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How can we help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Book className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-sm text-gray-600 mb-4">Browse our guides and tutorials</p>
                <Link to="/docs">
                  <Button variant="outline" size="sm" className="w-full">
                    View Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-4">Watch step-by-step guides</p>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
                <Button variant="outline" size="sm" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Send us a message</p>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-blue-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Our support team is available Monday-Friday, 9am-5pm EST
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button variant="secondary" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Send us an Email
                    </Button>
                  </Link>
                  <Button variant="secondary" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us: (555) 123-4567
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
