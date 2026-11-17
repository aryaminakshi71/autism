/**
 * Internal Blog Route
 *
 * Company news, updates, and announcements.
 */

import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  Badge,
  Button,
  Card,
  CardContent,
  FormField,
  FormModal,
  Input,
  Textarea,
} from "@autism-legacy-20260205/ui";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/blog")({
  component: BlogPage,
});

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Q1 Clinical Kickoff: Goals and Care Standards",
    excerpt:
      "A recap of our Q1 clinical kickoff covering assessment flow updates, care standards, and family engagement goals.",
    author: {
      name: "Jordan Lee",
      role: "Clinical Director",
      avatar: "JL",
    },
    date: "Jan 15, 2024",
    likes: 24,
    comments: 5,
    tag: "Clinical Update",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "New SpectrumOS Features Released",
    excerpt:
      "We've shipped new care plan templates, faster learner search, and better session note workflows for clinical teams.",
    author: {
      name: "Product Team",
      role: "Product",
      avatar: "PT",
    },
    date: "Jan 12, 2024",
    likes: 45,
    comments: 12,
    tag: "Product Update",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "Staff Spotlight: Maya Patel",
    excerpt:
      "Meet Maya, our BCBA team lead. Learn how she structures therapy programs and supports families.",
    author: {
      name: "People Ops",
      role: "Culture",
      avatar: "PO",
    },
    date: "Jan 08, 2024",
    likes: 56,
    comments: 23,
    tag: "Culture",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
];

const TAGS = [
  "Clinical Update",
  "Product Update",
  "Culture",
  "Operations",
  "Family Support",
  "Training",
];

function BlogPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    tag: "Company News",
    content: "",
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!newPost.excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      excerpt: newPost.excerpt,
      author: {
        name: "You",
        role: "Author",
        avatar: "YO",
      },
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      likes: 0,
      comments: 0,
      tag: newPost.tag,
      image: "",
    };

    setPosts([post, ...posts]);
    toast.success("Post created successfully");
    setIsModalOpen(false);
    setNewPost({ title: "", excerpt: "", tag: "Company News", content: "" });
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
    toast.success("Post liked!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Company Blog</h1>
          <p className="text-gray-500">News, updates, and announcements</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Post
        </Button>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
              {post.image ? (
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={192}
                  className="h-full w-full object-cover"
                  quality={85}
                  format="webp"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                  <ImageIcon className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                  {post.tag}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {post.author.name}
                  </p>
                  <p className="text-gray-500 text-xs">{post.author.role}</p>
                </div>
                <div className="ml-auto flex items-center text-gray-500 text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  {post.date}
                </div>
              </div>

              <h2 className="mb-2 cursor-pointer font-bold text-gray-900 text-xl transition-colors hover:text-blue-600">
                {post.title}
              </h2>
              <p className="mb-6 text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-gray-100 border-t pt-4">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {post.likes} Likes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => toast.info("Comments panel opened.")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.comments} Comments
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.info("Post actions opened.")}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Post Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        title="Create Post"
        submitText="Publish Post"
      >
        <div className="space-y-4">
          <FormField label="Title" required>
            <Input
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Enter post title"
              required
            />
          </FormField>
          <FormField label="Category" required>
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newPost.tag}
              onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
            >
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Excerpt" required>
            <Textarea
              value={newPost.excerpt}
              onChange={(e) =>
                setNewPost({ ...newPost, excerpt: e.target.value })
              }
              placeholder="Brief summary of your post..."
              rows={2}
              required
            />
          </FormField>
          <FormField label="Content" required>
            <Textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              placeholder="Write your post content here..."
              rows={8}
              required
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}
