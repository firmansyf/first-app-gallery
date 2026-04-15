"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Private Gallery</h1>
        <p className="text-gray-500 mb-6">
          Registration is not available. This is a private gallery.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Browse the gallery
        </Link>
      </div>
    </div>
  );
}
