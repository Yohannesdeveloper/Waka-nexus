"use client";

import { useState } from "react";

export type Submission = {
  id: string;
  artistName: string;
  country: string;
  artworkTitle: string | null;
  imageUrls: string[];
};

export default function SubmittedArtworkCard({ submission, delay = 0 }: { submission: Submission; delay?: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = submission.imageUrls[0] || "";
  const title = submission.artworkTitle || submission.artistName;

  return (
    <div className="group block opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-[#c9a962]/30">
        <div className="aspect-[4/5] relative overflow-hidden">
          {!imgError ? (
            <img
              src={imageUrl}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/30 text-sm">Image unavailable</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[#c9a962] text-xs font-medium tracking-[0.3em] uppercase mb-2">
              {submission.country}
            </p>
            <h3 className="font-display text-2xl font-medium text-white">
              {title}
            </h3>
            <p className="text-white/60 text-sm mt-1">{submission.artistName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
