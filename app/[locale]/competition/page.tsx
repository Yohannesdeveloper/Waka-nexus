import Link from "next/link";
import { getUpcomingEvents } from "@/lib/submissions";
import { getTranslations } from "next-intl/server";

export default async function Competition() {
  const upcomingEvents = await getUpcomingEvents();
  const t = await getTranslations("competition");
  
  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            {t("participate")}
          </p>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 mb-6">{t("checkBack")}</p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
            >
              {t("submitArtwork")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group relative bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden hover:border-[#c9a962]/40 transition-all duration-500"
              >
                {event.imageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <span className="text-[#c9a962] text-sm font-medium tracking-widest uppercase">
                    {new Date(event.startDate).getFullYear()}
                  </span>
                  <h2 className="font-display text-2xl font-medium text-white mt-4 mb-3">
                    {event.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>
                  <p className="text-white/40 text-xs mb-2">
                    {t("location")}: {event.location}
                  </p>
                  <p className="text-white/40 text-xs mb-6">
                    {t("starts")}: {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 text-[#c9a962] font-medium tracking-widest uppercase text-sm hover:gap-4 transition-all duration-300"
                  >
                    {t("applyNow")}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
