"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setPost(data.post);
          // Track view
          fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
          }).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Post not found</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block">
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 sm:mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to gallery
      </Link>

      <article className="bg-white sm:rounded-xl sm:border border-gray-200 shadow-sm overflow-hidden -mx-3 sm:mx-0">
        {/* Media */}
        {post.mediaUrl && (
          <div className="bg-black">
            {post.mediaType === "video" ? (
              <video
                src={post.mediaUrl}
                controls
                className="w-full max-h-[400px] sm:max-h-[600px] object-contain"
              />
            ) : (
              <img
                src={post.mediaUrl}
                alt=""
                className="w-full max-h-[400px] sm:max-h-[600px] object-contain"
              />
            )}
          </div>
        )}

        <div className="p-3 sm:p-4">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
              {post.user.avatar ? (
                <img src={post.user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                post.user.name[0].toUpperCase()
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm font-serif">{post.user.name}</span>
              <span className="text-gray-400 text-sm ml-1.5">@{post.user.username}</span>
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <p className="mt-3 text-gray-900 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {post.content}
            </p>
          )}

          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{post.location}</span>
            </div>
          )}

          {/* Date */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              {formatTime(post.createdAt)} · {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
