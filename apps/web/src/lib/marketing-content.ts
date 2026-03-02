export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  featured?: boolean;
  ctaLabel: string;
  features: string[];
}

export interface BlogAuthor {
  name: string;
  role: string;
}

export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  author: BlogAuthor;
  coverImage: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  content: BlogContentBlock[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For solo families and first-time onboarding.",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaLabel: "Get Started Free",
    features: [
      "Up to 3 learners",
      "Basic schedules and communication tools",
      "Parent portal access",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For solo providers and small early-stage programs.",
    monthlyPrice: 29,
    annualPrice: 24,
    ctaLabel: "Start Starter",
    features: [
      "Up to 30 active learners",
      "Session notes and progress tracking",
      "Family communication portal",
      "Secure document storage",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing clinics that need deeper workflows.",
    monthlyPrice: 89,
    annualPrice: 74,
    featured: true,
    ctaLabel: "Start Professional",
    features: [
      "Unlimited learners",
      "Visual schedules and AAC workflows",
      "Advanced reports and outcome dashboards",
      "Team role permissions",
      "Priority support",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For multi-site networks and school districts.",
    monthlyPrice: 249,
    annualPrice: 209,
    ctaLabel: "Talk to Sales",
    features: [
      "Multi-site organization controls",
      "Custom onboarding and migration",
      "Dedicated success manager",
      "Security and compliance review",
      "Custom contract and SLA",
      "Private integration support",
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "autism-care-plan-templates-that-scale",
    title: "Autism Care Plan Templates That Scale Across Teams",
    excerpt:
      "How to standardize clinical quality while keeping each learner plan individualized.",
    category: "Clinical Operations",
    publishedAt: "2026-02-12",
    readingMinutes: 7,
    author: {
      name: "Jordan Lee",
      role: "Clinical Director",
    },
    coverImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
    tags: ["Care Plans", "Clinical Quality", "Operations"],
    seoTitle: "Autism Care Plan Templates for Multi-Disciplinary Teams",
    seoDescription:
      "Learn a practical framework for autism care plan templates that improve consistency, collaboration, and outcomes.",
    content: [
      {
        type: "paragraph",
        text: "When teams grow, quality can drift unless your process is codified. High-performing organizations use a clear baseline care plan structure and then personalize from there.",
      },
      {
        type: "heading",
        text: "Start with a standard structure",
      },
      {
        type: "list",
        items: [
          "Learner profile and communication preferences",
          "Current baseline and recent assessment summary",
          "Goal domains with measurable targets",
          "Intervention schedule and assigned roles",
          "Family collaboration plan and review cadence",
        ],
      },
      {
        type: "heading",
        text: "Make updates predictable",
      },
      {
        type: "paragraph",
        text: "Use weekly review notes and monthly plan checkpoints. This keeps everyone aligned and makes handoffs across providers much safer.",
      },
      {
        type: "quote",
        text: "Consistency is not rigidity. It is the system that allows personalization to work at scale.",
      },
    ],
  },
  {
    slug: "family-engagement-playbook-for-autism-programs",
    title: "Family Engagement Playbook for Autism Programs",
    excerpt:
      "A practical communication rhythm that improves adherence and trust with caregivers.",
    category: "Family Collaboration",
    publishedAt: "2026-01-30",
    readingMinutes: 6,
    author: {
      name: "Maya Patel",
      role: "Family Success Lead",
    },
    coverImage:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
    tags: ["Family Portal", "Engagement", "Communication"],
    seoTitle: "Family Engagement Strategies for Autism Care Teams",
    seoDescription:
      "Use this family engagement playbook to improve communication consistency, reduce churn, and strengthen outcomes.",
    content: [
      {
        type: "paragraph",
        text: "Families need clarity, not volume. The most effective programs send concise updates on a predictable cadence.",
      },
      {
        type: "heading",
        text: "Recommended weekly rhythm",
      },
      {
        type: "list",
        items: [
          "Monday: upcoming session priorities",
          "Midweek: quick progress signal",
          "Friday: summary + at-home reinforcement",
        ],
      },
      {
        type: "paragraph",
        text: "When this rhythm is followed, caregivers know when to expect communication and are more likely to reinforce goals consistently at home.",
      },
    ],
  },
  {
    slug: "outcomes-dashboard-metrics-every-clinic-should-track",
    title: "Outcomes Dashboard Metrics Every Clinic Should Track",
    excerpt:
      "The KPI set that connects clinical quality, utilization, and revenue health.",
    category: "Analytics",
    publishedAt: "2026-01-16",
    readingMinutes: 8,
    author: {
      name: "Product Analytics Team",
      role: "Analytics",
    },
    coverImage:
      "https://images.unsplash.com/photo-1551281044-8b5bdc9f4f10?auto=format&fit=crop&w=1600&q=80",
    tags: ["Analytics", "KPI", "Clinic Performance"],
    seoTitle: "Autism Clinic Dashboard Metrics and KPI Guide",
    seoDescription:
      "Track the core autism clinic dashboard metrics that indicate learner progress, team performance, and operational efficiency.",
    content: [
      {
        type: "paragraph",
        text: "Dashboards fail when they include too many vanity numbers. Keep your executive view focused on a handful of leading indicators.",
      },
      {
        type: "heading",
        text: "Core KPI groups",
      },
      {
        type: "list",
        items: [
          "Learner outcomes: goal attainment and trend velocity",
          "Operational delivery: completed vs scheduled sessions",
          "Family engagement: update open rates and response lag",
          "Financial health: authorization utilization and renewal risk",
        ],
      },
      {
        type: "paragraph",
        text: "Review the same KPI board weekly at both clinical and operations meetings so decisions stay connected.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
