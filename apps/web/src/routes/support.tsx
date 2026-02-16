import { Header } from "@/components/header";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@autism-legacy-20260205/ui";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Book,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Video,
} from "lucide-react";

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
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mb-6 font-bold text-5xl text-gray-900">
            Support Center
          </h1>
          <p className="mb-8 text-gray-600 text-xl">
            Find answers, get help, and learn how to make the most of Autism
            Platform.
          </p>
          <div className="relative mx-auto max-w-xl">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="search"
              placeholder="Search for help..."
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-bold text-2xl text-gray-900">
            How can we help?
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer transition hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Documentation
                </h3>
                <p className="mb-4 text-gray-600 text-sm">
                  Browse our guides and tutorials
                </p>
                <Link to="/docs">
                  <Button variant="outline" size="sm" className="w-full">
                    View Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Video Tutorials
                </h3>
                <p className="mb-4 text-gray-600 text-sm">
                  Watch step-by-step guides
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Live Chat</h3>
                <p className="mb-4 text-gray-600 text-sm">
                  Chat with our support team
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Email Support
                </h3>
                <p className="mb-4 text-gray-600 text-sm">Send us a message</p>
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
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h3 className="mb-4 font-semibold text-gray-900 text-xl">
                  {category.title}
                </h3>
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
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-0 bg-blue-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="mb-4 font-bold text-3xl">Still Need Help?</h2>
                <p className="mb-6 text-blue-100 text-lg">
                  Our support team is available Monday-Friday, 9am-5pm EST
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link to="/contact">
                    <Button variant="secondary" size="lg">
                      <Mail className="mr-2 h-4 w-4" />
                      Send us an Email
                    </Button>
                  </Link>
                  <Button variant="secondary" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
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
