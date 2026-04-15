"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Post = {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
};

export default function Gallery() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (cursorParam?: string) => {
    const url = cursorParam ? `/api/posts?cursor=${cursorParam}` : "/api/posts";
    try {
      const res = await fetch(url);
      if (!res.ok) return { posts: [], nextCursor: null };
      return await res.json();
    } catch {
      return { posts: [], nextCursor: null };
    }
  }, []);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data.posts);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setLoading(false);
    });
  }, [fetchPosts]);

  async function loadMore() {
    if (!cursor) return;
    const data = await fetchPosts(cursor);
    setPosts((prev) => [...prev, ...data.posts]);
    setCursor(data.nextCursor);
    setHasMore(!!data.nextCursor);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No moments yet</p>
        <p className="text-sm mt-1">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="relative aspect-square bg-gray-100 overflow-hidden group"
          >
            {post.mediaUrl ? (
              post.mediaType === "video" ? (
                <>
                  <video
                    src={post.mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              ) : (
                <img
                  src={post.mediaUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600">
                <p className="text-white text-xs text-center line-clamp-4 font-medium">
                  {post.content}
                </p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-4 text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
        >
          Load more
        </button>
      )}
    </div>
  );
}
