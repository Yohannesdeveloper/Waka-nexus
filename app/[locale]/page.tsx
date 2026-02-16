import { getTranslations } from "next-intl/server";
import HomePageClient from "../components/home/HomePageClient";
import type { HomePageContent } from "../components/home/HomePageClient";

export default async function HomePage() {
  const t = await getTranslations("home");

  const content: HomePageContent = {
    hero: {
      subtitle: t("hero.subtitle"),
      title: t("hero.title"),
      tagline: t("hero.tagline"),
      ctaPrimary: t("hero.ctaPrimary"),
      ctaSecondary: t("hero.ctaSecondary"),
      ctaDownload: t("hero.ctaDownload"),
    },
    about: {
      subtitle: t("about.subtitle"),
      title: t("about.title"),
      description: t("about.description"),
    },
    whatWeDo: {
      subtitle: t("whatWeDo.subtitle"),
      title: t("whatWeDo.title"),
      exhibitions: {
        title: t("whatWeDo.exhibitions.title"),
        description: t("whatWeDo.exhibitions.description"),
      },
      competition: {
        title: t("whatWeDo.competition.title"),
        description: t("whatWeDo.competition.description"),
      },
      dialogue: {
        title: t("whatWeDo.dialogue.title"),
        description: t("whatWeDo.dialogue.description"),
      },
    },
    approach: {
      subtitle: t("approach.subtitle"),
      title: t("approach.title"),
      points: {
        governed: t("approach.points.governed"),
        inclusive: t("approach.points.inclusive"),
        scalable: t("approach.points.scalable"),
        collaboration: t("approach.points.collaboration"),
      },
    },
  };

  return <HomePageClient content={content} />;
}
