import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4 text-sm">
          {t("subtitle")}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
          {t("title")}
        </h1>
        <p className="text-white/60 mb-16 leading-relaxed">
          {t("description")}
        </p>

        {/* Vision Section */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-light text-white mb-8 text-center">
            {t("visionTitle")}
          </h2>
          <div className="bg-white/[0.03] rounded-xl p-8 border border-white/10">
            <p className="text-white/80 leading-relaxed text-lg">
              {t("vision")}
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div>
          <h2 className="font-display text-2xl font-light text-white mb-12 text-center">
            {t("missionTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.raw("mission").map((item: string, index: number) => (
              <div 
                key={index} 
                className="bg-white/[0.03] rounded-lg p-6 border border-white/10 hover:border-[#c9a962]/40 transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center">
                      <span className="text-[#0a0c12] text-sm font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-white/80 font-medium">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}