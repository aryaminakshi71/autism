import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-bold text-3xl tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-muted-foreground">
          Use of this platform is subject to your organization agreement and
          applicable healthcare/privacy regulation.
        </p>
        <div className="mt-8">
          <Link to="/" className="font-medium text-primary no-underline">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
