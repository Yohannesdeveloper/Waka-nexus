import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SubmittedArtworkGrid from "@/app/components/SubmittedArtworkGrid";
import { getApprovedSubmissions } from "@/lib/submissions";
import { Submission } from "@/app/components/SubmittedArtworkCard";

export default async function Exhibitions() {
    // Use a dual-layered safety net
    let submissions: Submission[] = [];
    let errorState = false;

    try {
        const data = await getApprovedSubmissions();
        submissions = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Critical DB Failure:", error);
        errorState = true;
    }

    // Fallback translations mechanism to prevent 500s if i18n context is missing
    let t;
    try {
        t = await getTranslations("exhibitions");
    } catch (e) {
        t = (key: string) => key === "title" ? "Exhibitions" : "";
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c9a962]/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5A2EFF]/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20 text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] text-[10px]">
                            Curated Global Art
                        </p>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-tight">
                        {t("title")}
                    </h1>

                    <div className="w-20 h-[1px] bg-[#c9a962] mb-8 mx-auto md:mx-0" />

                    <p className="text-white/50 max-w-2xl text-lg leading-relaxed font-light">
                        {t("description") || "A cinematic journey through contemporary visual narratives, connecting artists across borders."}
                    </p>
                </div>

                {submissions.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <SubmittedArtworkGrid submissions={submissions} />
                    </div>
                ) : (
                    <div className="py-32 text-center rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-white/40 text-xl font-light tracking-wide">
                            {errorState ? "Our gallery is currently updating." : "No approved submissions yet."}
                        </p>
                        <p className="text-white/20 text-sm mt-2">Check back soon for new additions</p>
                    </div>
                )}

                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center">
                    <Link
                        href="/apply"
                        className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-xs overflow-hidden transition-all duration-500 hover:pr-12"
                    >
                        <span className="relative z-10">Submit your work</span>
                        <svg className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="absolute inset-0 bg-[#c9a962] translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
