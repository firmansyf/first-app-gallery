"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { useAuth } from "./AuthProvider";

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

export default function Feed() {
  const { user, loading: authLoading } = useAuth();
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

  function handleNewPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user && <CreatePost onPost={handleNewPost} />}

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No moments yet</p>
          <p className="text-sm mt-1">Check back later for new content!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isAdmin={!!user} onDelete={handleDelete} />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full py-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}
