import SubmittedArtworkCard, { type Submission } from "./SubmittedArtworkCard";

export default function SubmittedArtworkGrid({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {submissions.map((s, i) => (
        <SubmittedArtworkCard key={s.id} submission={s} delay={i * 80} />
      ))}
    </div>
  );
}
