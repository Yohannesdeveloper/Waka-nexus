"use client";

import { useState } from "react";
import Link from "next/link";
import EventManager from "./EventManager";
import NewsManager from "./NewsManager";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  imageUrl: string | null;
  status: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
}

interface CMSDashboardProps {
  events: Event[];
  news: NewsItem[];
}

export default function CMSDashboard({ events, news }: CMSDashboardProps) {
  const [activeTab, setActiveTab] = useState<"events" | "news">("events");

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">Content Management</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              CMS Dashboard
            </h1>
            <p className="text-white/60 max-w-2xl">
              Manage events and news updates for your website.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "events"
                ? "bg-[#c9a962] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === "news"
                ? "bg-[#c9a962] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            News ({news.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "events" ? <EventManager initialEvents={events} /> : <NewsManager initialNews={news} />}
      </div>
    </main>
  );
}
