import { getUpcomingEvents, getPublishedNews } from "@/lib/submissions";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

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

export default async function NewsEventsPage() {
  const t = await getTranslations("newsEvents");
  const [events, news] = await Promise.all([
    getUpcomingEvents() as Promise<Event[]>,
    getPublishedNews() as Promise<NewsItem[]>
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("stayUpdated")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            {t("discover")}
          </p>
        </div>

        {/* Events Section */}
        <section className="mb-20">
          <h2 className="font-display text-3xl font-medium text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-[#c9a962] rounded-full"></span>
            {t("upcomingEvents")}
          </h2>
          
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60">{t("noEvents")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#c9a962]/30 transition-all group"
                >
                  {event.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : event.status === "ongoing"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-[#c9a962] text-sm mb-3">{event.location}</p>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.startDate)}</span>
                      {event.endDate && (
                        <span>- {formatDate(event.endDate)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* News Section */}
        <section>
          <h2 className="font-display text-3xl font-medium text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-[#c9a962] rounded-full"></span>
            {t("latestNews")}
          </h2>
          
          {news.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60">{t("noNews")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#c9a962]/30 transition-all group"
                >
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                        Published
                      </span>
                      <span className="text-white/40 text-sm">{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#c9a962] transition-colors">
                      {item.title}
                    </h3>
                    {item.excerpt ? (
                      <p className="text-white/60 line-clamp-3">{item.excerpt}</p>
                    ) : (
                      <p className="text-white/60 line-clamp-3">{item.content}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-white/60 mb-4">{t("cta.title")}</p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 text-[#c9a962] font-medium tracking-widest uppercase text-sm hover:gap-4 transition-all duration-300"
          >
            {t("cta.button")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
