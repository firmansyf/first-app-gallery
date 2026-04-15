"use client";

import { useState, useRef } from "react";
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

export default function CreatePost({ onPost }: { onPost: (post: Post) => void }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    if (res.ok) {
      setMediaUrl(data.url);
      setMediaType(data.mediaType);
    }
    setUploading(false);
  }

  function handleGetLocation() {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setLocation(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
        setGettingLocation(false);
      },
      () => setGettingLocation(false)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setPosting(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, mediaUrl, mediaType, latitude, longitude, location }),
    });

    if (res.ok) {
      const data = await res.json();
      onPost(data.post);
      setContent("");
      setMediaUrl(null);
      setMediaType(null);
      setLocation(null);
      setLatitude(null);
      setLongitude(null);
      if (fileRef.current) fileRef.current.value = "";
    }
    setPosting(false);
  }

  function removeMedia() {
    setMediaUrl(null);
    setMediaType(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeLocation() {
    setLocation(null);
    setLatitude(null);
    setLongitude(null);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
      <div className="flex gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user.name[0].toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base min-h-[80px]"
          />

          {mediaUrl && (
            <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
              {mediaType === "video" ? (
                <video src={mediaUrl} controls className="w-full max-h-64 object-contain bg-black" />
              ) : (
                <img src={mediaUrl} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/80"
              >
                x
              </button>
            </div>
          )}

          {location && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate flex-1">{location}</span>
              <button type="button" onClick={removeLocation} className="text-gray-400 hover:text-gray-600">x</button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex gap-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Upload photo or video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Add location"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={posting || uploading || (!content.trim() && !mediaUrl)}
              className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Uploading..." : posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
