import {
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-time Availability",
    description:
      "See which spots are free instantly with live updates from sensors.",
  },
  {
    icon: Smartphone,
    title: "Easy Mobile Booking",
    description:
      "Reserve your spot in seconds from your phone, anywhere, anytime.",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description: "Pay securely with Apple Pay, Google Pay, or any credit card.",
  },
  {
    icon: Clock,
    title: "Flexible Duration",
    description:
      "Book for an hour or a full day. Extend your time right from the app.",
  },
  {
    icon: Shield,
    title: "Secure & Insured",
    description:
      "All parking locations are monitored 24/7 with full insurance coverage.",
  },
  {
    icon: Zap,
    title: "EV Charging",
    description:
      "Find spots with charging stations and power up while you park.",
  },
];

export function Features() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            Parking made simple
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Everything you need for stress-free parking, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground text-lg">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
