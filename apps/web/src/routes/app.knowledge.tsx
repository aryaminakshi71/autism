/**
 * Knowledge Base Route
 *
 * Internal knowledge base for the organization.
 */

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  FormModal,
  Input,
  Textarea,
} from "@autism-legacy-20260205/ui";
import { createFileRoute } from "@tanstack/react-router";
import {
  Book,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Folder,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgeBasePage,
});

// Mock data for the knowledge base
const CATEGORIES = [
  { id: "clinical", name: "Clinical Playbooks", icon: "🧠", count: 12 },
  { id: "careplans", name: "Care Plans", icon: "📝", count: 8 },
  { id: "onboarding", name: "Staff Onboarding", icon: "🚀", count: 5 },
  { id: "compliance", name: "Compliance & Policies", icon: "✅", count: 7 },
  { id: "templates", name: "Family Templates", icon: "📄", count: 15 },
  { id: "training", name: "Training Library", icon: "🎓", count: 10 },
];

const ARTICLES = [
  {
    id: "1",
    title: "Intake Assessment Checklist",
    category: "clinical",
    excerpt:
      "A step-by-step checklist for initial assessments and information gathering.",
    author: "Clinical Team",
    views: 234,
    lastUpdated: "2024-01-15",
    starred: true,
  },
  {
    id: "2",
    title: "Care Plan Structure Overview",
    category: "careplans",
    excerpt:
      "Guidance on goals, targets, and measurable outcomes for each learner.",
    author: "Program Director",
    views: 456,
    lastUpdated: "2024-01-12",
    starred: false,
  },
  {
    id: "3",
    title: "New Staff Onboarding Checklist",
    category: "onboarding",
    excerpt:
      "Step-by-step checklist for onboarding new clinical and admin team members.",
    author: "People Ops",
    views: 189,
    lastUpdated: "2024-01-10",
    starred: true,
  },
  {
    id: "4",
    title: "Family Communication Guide",
    category: "templates",
    excerpt:
      "Templates and guidance for parent updates, session summaries, and goal reviews.",
    author: "Family Support",
    views: 567,
    lastUpdated: "2024-01-08",
    starred: false,
  },
  {
    id: "5",
    title: "HIPAA Documentation Practices",
    category: "compliance",
    excerpt: "Documentation standards, audit tips, and privacy best practices.",
    author: "Compliance",
    views: 789,
    lastUpdated: "2024-01-05",
    starred: true,
  },
];

function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "clinical",
    content: "",
  });

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateArticle = () => {
    if (!newArticle.title.trim()) {
      toast.error("Title is required");
      return;
    }
    toast.success("Article created successfully");
    setIsModalOpen(false);
    setNewArticle({ title: "", category: "clinical", content: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">
            Access clinical resources, templates, and documentation
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex w-full items-center justify-between p-3 transition hover:bg-gray-50 ${
                    !selectedCategory
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>All Articles</span>
                  </div>
                  <Badge variant="outline">{ARTICLES.length}</Badge>
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex w-full items-center justify-between p-3 transition hover:bg-gray-50 ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <Badge variant="outline">{category.count}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Articles</span>
                  <span className="font-semibold">{ARTICLES.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Categories</span>
                  <span className="font-semibold">{CATEGORIES.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Starred</span>
                  <span className="font-semibold">
                    {ARTICLES.filter((a) => a.starred).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3">
          {/* Featured Articles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                Starred Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {ARTICLES.filter((a) => a.starred).map((article) => (
                  <div
                    key={article.id}
                    className="cursor-pointer rounded-lg border border-gray-200 p-3 transition hover:border-blue-500 hover:shadow-md"
                  >
                    <h4 className="mb-1 font-medium text-gray-900">
                      {article.title}
                    </h4>
                    <p className="line-clamp-1 text-gray-500 text-sm">
                      {article.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedCategory
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
                    "Articles"
                  : "All Articles"}
              </CardTitle>
              <CardDescription>
                {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <Book className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p>No articles found</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-blue-500 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">
                            {article.title}
                          </h4>
                          {article.starred && (
                            <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                          )}
                        </div>
                        <p className="mb-2 line-clamp-2 text-gray-500 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-gray-400 text-xs">
                          <span>{article.author}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Article Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateArticle}
        title="New Article"
        submitText="Create Article"
      >
        <div className="space-y-4">
          <FormField label="Title" required>
            <Input
              value={newArticle.title}
              onChange={(e) =>
                setNewArticle({ ...newArticle, title: e.target.value })
              }
              placeholder="Enter article title"
              required
            />
          </FormField>
          <FormField label="Category" required>
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newArticle.category}
              onChange={(e) =>
                setNewArticle({ ...newArticle, category: e.target.value })
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Content" required>
            <Textarea
              value={newArticle.content}
              onChange={(e) =>
                setNewArticle({ ...newArticle, content: e.target.value })
              }
              placeholder="Write your article content here..."
              rows={8}
              required
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}
