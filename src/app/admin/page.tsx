"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ViewRecord = {
  id: string;
  postId: string;
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  viewedAt: string;
};

type PostSummary = {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  _count: { views: number };
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

function parseOS(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [views, setViews] = useState<ViewRecord[]>([]);
  const [viewsTotal, setViewsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewsLoading, setViewsLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("/api/views").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ])
      .then(([viewsData, msgData]) => {
        setPosts(viewsData.posts || []);
        setTotalViews(viewsData.totalViews || 0);
        setUnreadMessages(msgData.unreadCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, authLoading, router]);

  async function loadPostViews(postId: string) {
    setSelectedPost(postId);
    setViewsLoading(true);
    try {
      const res = await fetch(`/api/views?postId=${postId}`);
      const data = await res.json();
      setViews(data.views || []);
      setViewsTotal(data.total || 0);
    } catch {
      setViews([]);
    }
    setViewsLoading(false);
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">Visitor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">See who viewed your gallery</p>
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm hover:border-blue-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">{user.name[0].toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-blue-600">Edit Profile</p>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-500">Total Views</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalViews}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-500">Total Posts</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{posts.length}</p>
        </div>
        <Link href="/admin/messages" className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-500">Messages</p>
            {unreadMessages > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">{unreadMessages}</p>
          <p className="text-xs text-gray-400 mt-0.5">unread</p>
        </Link>
      </div>

      {/* Posts list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Posts & Views</h2>
        </div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No posts yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => loadPostViews(post.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedPost === post.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">
                      {post.content || (post.mediaUrl ? `[${post.mediaType || "media"}]` : "Empty post")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-1.5 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{post._count.views}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View details */}
      {selectedPost && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Viewer Details
              <span className="text-sm font-normal text-gray-400 ml-2">({viewsTotal} total)</span>
            </h2>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          {viewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : views.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No views yet</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {views.map((view) => (
                <div key={view.id} className="px-3 sm:px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm">
                        <span className="font-mono text-gray-700 text-xs sm:text-sm">{view.ipAddress || "Unknown IP"}</span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span className="text-gray-500 text-xs sm:text-sm">{parseBrowser(view.userAgent)}</span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span className="text-gray-500 text-xs sm:text-sm">{parseOS(view.userAgent)}</span>
                      </div>
                      {(view.city || view.country) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[view.city, view.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 sm:ml-4">{timeAgo(view.viewedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
