import { pricingPlans } from "@/lib/marketing-content";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@autism-legacy-20260205/ui";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CreditCard, Download, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

type BillingInterval = "monthly" | "annual";

const defaultInvoices = [
  {
    id: "INV-2026-021",
    amount: 89,
    date: "2026-02-01",
    status: "paid",
  },
  {
    id: "INV-2026-020",
    amount: 89,
    date: "2026-01-01",
    status: "paid",
  },
  {
    id: "INV-2025-219",
    amount: 89,
    date: "2025-12-01",
    status: "paid",
  },
];

function BillingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState("professional");
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardholderName: "Jordan Lee",
    cardLast4: "4242",
    billingEmail: "billing@autism.app",
  });

  const selectedPlan = useMemo(
    () =>
      pricingPlans.find((plan) => plan.id === selectedPlanId) ||
      pricingPlans[0],
    [selectedPlanId],
  );

  const amount =
    interval === "monthly"
      ? selectedPlan.monthlyPrice
      : selectedPlan.annualPrice;

  const handleSavePaymentMethod = async () => {
    if (!paymentForm.cardholderName.trim()) {
      toast.error("Cardholder name is required");
      return;
    }
    if (!paymentForm.billingEmail.trim()) {
      toast.error("Billing email is required");
      return;
    }

    setIsSavingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSavingPayment(false);
    toast.success("Payment method updated");
  };

  const handlePlanChange = () => {
    toast.success(
      `Plan switched to ${selectedPlan.name} (${interval === "monthly" ? "monthly" : "annual"} billing)`,
    );
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const payload = [
      `Invoice: ${invoiceId}`,
      `Plan: ${selectedPlan.name}`,
      `Generated At: ${new Date().toISOString()}`,
    ].join("\n");

    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Billing</h1>
        <p className="text-gray-500">
          Manage subscription plans, payment methods, and invoices.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              Current Subscription
            </CardTitle>
            <CardDescription>
              Your organization is currently on the {selectedPlan.name} plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  {selectedPlan.name}
                </p>
                <Badge variant="outline">
                  {interval === "monthly" ? "Monthly" : "Annual"}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">
                ${amount}/month per organization
              </p>
              <p className="mt-1 text-gray-500 text-xs">
                Renews on March 30, 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-gray-500">Active Seats</p>
                <p className="font-semibold text-gray-900">22 users</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-gray-500">Next Invoice</p>
                <p className="font-semibold text-gray-900">${amount}.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Billing Cycle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant={interval === "monthly" ? "primary" : "outline"}
              className="w-full"
              onClick={() => setInterval("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={interval === "annual" ? "primary" : "outline"}
              className="w-full"
              onClick={() => setInterval("annual")}
            >
              Annual (save)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Plan</CardTitle>
          <CardDescription>
            Upgrade or downgrade your subscription at any time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {pricingPlans.map((plan) => {
              const planAmount =
                interval === "monthly" ? plan.monthlyPrice : plan.annualPrice;
              const selected = selectedPlanId === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="mt-1 text-gray-600 text-sm">
                    ${planAmount}/month
                  </p>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <Button onClick={handlePlanChange}>Apply Plan Change</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Cardholder Name
              </label>
              <Input
                value={paymentForm.cardholderName}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    cardholderName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Card Last 4
              </label>
              <Input
                value={paymentForm.cardLast4}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    cardLast4: e.target.value,
                  }))
                }
                maxLength={4}
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Billing Email
              </label>
              <Input
                type="email"
                value={paymentForm.billingEmail}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    billingEmail: e.target.value,
                  }))
                }
              />
            </div>
            <Button onClick={handleSavePaymentMethod} loading={isSavingPayment}>
              Save Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Download past invoices for accounting and reconciliation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaultInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-gray-500 text-sm">
                      ${invoice.amount}.00 on{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
