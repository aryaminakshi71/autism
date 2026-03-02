import { Header } from "@/components/header";
import { getBlogPostBySlug } from "@/lib/marketing-content";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        meta: [
          { title: "Article Not Found | Autism Platform" },
          {
            name: "description",
            content: "The requested article could not be found.",
          },
        ],
      };
    }

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.seoDescription,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
      image: post.coverImage,
    };

    return {
      meta: [
        { title: `${post.seoTitle} | Autism Platform` },
        { name: "description", content: post.seoDescription },
        { property: "og:title", content: post.seoTitle },
        { property: "og:description", content: post.seoDescription },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(articleSchema),
        },
      ],
    };
  },
  component: BlogArticlePage,
});

function BlogArticlePage() {
  const { slug } = Route.useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-bold text-4xl text-gray-900">
            Article not found
          </h1>
          <p className="mt-3 text-gray-600">
            This article may have been removed or renamed.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-blue-600 text-sm hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <p className="mt-6 font-semibold text-blue-600 text-xs uppercase tracking-[0.12em]">
          {post.category}
        </p>
        <h1 className="mt-3 font-bold text-4xl text-gray-900">{post.title}</h1>
        <p className="mt-4 text-gray-600 text-lg">{post.excerpt}</p>

        <div className="mt-5 flex flex-wrap gap-4 text-gray-500 text-sm">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingMinutes} min read
          </span>
          <span>
            By {post.author.name}, {post.author.role}
          </span>
        </div>

        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 h-72 w-full rounded-xl object-cover"
        />

        <article className="prose prose-gray mt-10 max-w-none">
          {post.content.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={`${block.type}-${index}`}
                  className="mt-8 font-bold text-2xl text-gray-900"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p
                  key={`${block.type}-${index}`}
                  className="mt-4 text-gray-700 leading-7"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  key={`${block.type}-${index}`}
                  className="mt-6 border-blue-600 border-l-4 bg-blue-50 p-4 font-medium text-gray-700"
                >
                  {block.text}
                </blockquote>
              );
            }

            return (
              <ul
                key={`${block.type}-${index}`}
                className="mt-4 list-disc space-y-2 pl-6 text-gray-700"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })}
        </article>
      </main>
    </div>
  );
}
