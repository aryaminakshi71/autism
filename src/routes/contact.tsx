import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-bold text-3xl tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">
          Reach the operations team at support@autismcare.app for onboarding,
          integrations, and production support.
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
