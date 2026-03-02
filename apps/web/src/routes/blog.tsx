import { Header } from "@/components/header";
import { blogPosts } from "@/lib/marketing-content";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | Autism Platform" },
      {
        name: "description",
        content:
          "Insights for autism clinics, therapists, and care teams on operations, family engagement, and outcomes.",
      },
      {
        property: "og:title",
        content: "Blog | Autism Platform",
      },
      {
        property: "og:description",
        content:
          "Read practical guides on autism care operations, analytics, and family collaboration.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 font-bold text-5xl text-gray-900">
            Autism Platform Blog
          </h1>
          <p className="text-gray-600 text-xl">
            Field-tested playbooks and product updates for clinical teams.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <p className="font-semibold text-blue-600 text-xs uppercase tracking-[0.12em]">
                  {post.category}
                </p>
                <h2 className="mt-2 font-bold text-2xl text-gray-900">
                  {post.title}
                </h2>
                <p className="mt-3 text-gray-600">{post.excerpt}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-gray-500 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingMinutes} min read
                  </span>
                </div>

                <div className="mt-6">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
