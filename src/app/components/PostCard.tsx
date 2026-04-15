"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  createdAt: string;
  user: { id: string; username: string; name: string; avatar: string | null };
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({
  post,
  isAdmin,
  onDelete,
}: {
  post: Post;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete?.(post.id);
    }
    setDeleting(false);
    setConfirming(false);
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0 overflow-hidden">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              post.user.name[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{post.user.name}</span>
              <span className="text-gray-400 text-xs sm:text-sm">@{post.user.username}</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-xs sm:text-sm">{timeAgo(post.createdAt)}</span>
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{post.location}</span>
              </div>
            )}
          </div>

          {/* Delete button — admin only */}
          {isAdmin && (
            <div className="shrink-0">
              {confirming ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-xs text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(true)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {post.content && (
          <p className="mt-3 text-gray-900 whitespace-pre-wrap break-words">{post.content}</p>
        )}
      </div>

      {post.mediaUrl && (
        <div className="border-t border-gray-100">
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} controls className="w-full max-h-[500px] object-contain bg-black" />
          ) : (
            <img src={post.mediaUrl} alt="" className="w-full max-h-[500px] object-contain bg-gray-50" />
          )}
        </div>
      )}
    </article>
  );
}
