import type { ReactNode } from "react";

interface InfoCardProps {
  step?: string;
  title: string;
  body: ReactNode;
}

export function InfoCard({ step, title, body }: InfoCardProps) {
  return (
    <article className="group relative rounded-2xl border border-line bg-white p-6 sm:p-7 shadow-soft transition-all duration-300 ease-soft hover:shadow-card hover:-translate-y-0.5">
      {step && (
        <div className="text-[11px] uppercase tracking-label text-ink-muted mb-4 tabular-nums">
          {step}
        </div>
      )}
      <h3 className="text-[17px] font-medium text-ink mb-2.5 tracking-tight">{title}</h3>
      <p className="text-[14px] sm:text-[15px] text-ink-soft leading-relaxed">{body}</p>
    </article>
  );
}
