/**
 * Family Outreach Route
 *
 * Family outreach and communication workflows.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, BarChart3, Users, Send, TrendingUp, Calendar, Plus, Eye, MousePointerClick } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  FormModal,
  FormField,
  Input,
  Textarea,
  Select,
} from "@autism-legacy-20260205/ui";
import { toast } from "sonner";

export const Route = createFileRoute("/app/marketing")({
  component: MarketingPage,
});

const initialCampaigns = [
  {
    id: 1,
    name: "Spring Caregiver Update",
    status: "active",
    recipients: 1250,
    opened: 892,
    clicked: 234,
    sent: "2024-01-10",
  },
  {
    id: 2,
    name: "New Family Onboarding",
    status: "active",
    recipients: 856,
    opened: 623,
    clicked: 145,
    sent: "2024-01-08",
  },
  {
    id: 3,
    name: "Year-End Resources",
    status: "completed",
    recipients: 2100,
    opened: 1680,
    clicked: 420,
    sent: "2023-12-15",
  },
];

function MarketingPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    content: "",
    recipients: "all",
  });

  const stats = [
    { label: "Total Updates", value: campaigns.length.toString(), icon: Mail, change: "+3 this month" },
    { label: "Active Updates", value: campaigns.filter((c) => c.status === "active").length.toString(), icon: Send, change: "2 scheduled" },
    {
      label: "Total Recipients",
      value: campaigns.reduce((sum, c) => sum + c.recipients, 0).toLocaleString(),
      icon: Users,
      change: "+12% vs last month",
    },
    {
      label: "Avg. Open Rate",
      value: `${Math.round((campaigns.reduce((sum, c) => sum + c.opened, 0) / campaigns.reduce((sum, c) => sum + c.recipients, 0)) * 100)}%`,
      icon: TrendingUp,
      change: "+5% improvement",
    },
  ];

  const handleCreateCampaign = () => {
    if (!newCampaign.name.trim()) {
      toast.error("Update name is required");
      return;
    }
    if (!newCampaign.subject.trim()) {
      toast.error("Message subject is required");
      return;
    }

    const campaign = {
      id: Date.now(),
      name: newCampaign.name,
      status: "draft" as const,
      recipients: 0,
      opened: 0,
      clicked: 0,
      sent: new Date().toISOString().split("T")[0],
    };

    setCampaigns([campaign, ...campaigns]);
    toast.success("Update created successfully");
    setIsModalOpen(false);
    setNewCampaign({ name: "", subject: "", content: "", recipients: "all" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Outreach</h1>
          <p className="text-gray-500">Manage caregiver updates and resources</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Create Update
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>View and manage caregiver communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <Badge
                      variant={campaign.status === "active" ? "default" : campaign.status === "draft" ? "outline" : "outline"}
                      className={campaign.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{campaign.recipients}</span> recipients
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{campaign.opened}</span> opened
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointerClick className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{campaign.clicked}</span> clicked
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {campaign.sent}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => toast.info("Message templates coming soon!")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Message Templates</h3>
                <p className="text-sm text-gray-600">Create and manage caregiver updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => toast.info("Analytics coming soon!")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">View engagement and outcomes metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => toast.info("Segments coming soon!")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Groups</h3>
                <p className="text-sm text-gray-600">Create targeted caregiver groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Update Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCampaign}
        title="Create Update"
        submitText="Create Update"
      >
        <div className="space-y-4">
          <FormField label="Update Name" required>
            <Input
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              placeholder="e.g., Therapy Program Update"
              required
            />
          </FormField>
          <FormField label="Message Subject" required>
            <Input
              value={newCampaign.subject}
              onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
              placeholder="e.g., New resources for home routines"
              required
            />
          </FormField>
          <FormField label="Recipients" required>
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newCampaign.recipients}
              onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
            >
              <option value="all">All Families</option>
              <option value="leads">Referrals Only</option>
              <option value="customers">Active Learners</option>
              <option value="inactive">Inactive Learners</option>
            </select>
          </FormField>
          <FormField label="Message Content" required>
            <Textarea
              value={newCampaign.content}
              onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
              placeholder="Write your caregiver update here..."
              rows={6}
              required
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}
