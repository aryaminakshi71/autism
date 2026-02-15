/**
 * Knowledge Base Route
 *
 * Internal knowledge base for the organization.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Book, Search, Plus, FileText, Folder, ChevronRight, Star, Clock, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
  FormModal,
  FormField,
  Textarea,
  Select,
} from "@autism-legacy-20260205/ui";
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
    excerpt: "A step-by-step checklist for initial assessments and information gathering.",
    author: "Clinical Team",
    views: 234,
    lastUpdated: "2024-01-15",
    starred: true,
  },
  {
    id: "2",
    title: "Care Plan Structure Overview",
    category: "careplans",
    excerpt: "Guidance on goals, targets, and measurable outcomes for each learner.",
    author: "Program Director",
    views: 456,
    lastUpdated: "2024-01-12",
    starred: false,
  },
  {
    id: "3",
    title: "New Staff Onboarding Checklist",
    category: "onboarding",
    excerpt: "Step-by-step checklist for onboarding new clinical and admin team members.",
    author: "People Ops",
    views: 189,
    lastUpdated: "2024-01-10",
    starred: true,
  },
  {
    id: "4",
    title: "Family Communication Guide",
    category: "templates",
    excerpt: "Templates and guidance for parent updates, session summaries, and goal reviews.",
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
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
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
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">Access clinical resources, templates, and documentation</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          New Article
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition ${
                    !selectedCategory ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>All Articles</span>
                  </div>
                  <Badge variant="outline">{ARTICLES.length}</Badge>
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition ${
                      selectedCategory === category.id ? "bg-blue-50 text-blue-600" : "text-gray-700"
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
                  <span className="font-semibold">{ARTICLES.filter((a) => a.starred).length}</span>
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
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Starred Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ARTICLES.filter((a) => a.starred).map((article) => (
                  <div
                    key={article.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
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
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Articles"
                  : "All Articles"}
              </CardTitle>
              <CardDescription>
                {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No articles found</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          {article.starred && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{article.author}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              placeholder="Enter article title"
              required
            />
          </FormField>
          <FormField label="Category" required>
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newArticle.category}
              onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
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
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
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
