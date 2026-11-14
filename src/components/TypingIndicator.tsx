import Image from "next/image";

export default function TypingIndicator() {
  return (
    <div className="flex animate-fade-up items-end gap-2" role="status" aria-label="FAEBOT está digitando">
      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-900 ring-2 ring-white">
        <Image src="/images/faebot.png" alt="" width={64} height={64} className="size-full object-cover" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-brand-600/10 bg-white px-4 py-3.5 shadow-bubble">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-typing rounded-full bg-brand-500"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
