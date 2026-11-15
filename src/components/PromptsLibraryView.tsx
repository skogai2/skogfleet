import React, { useMemo, useState } from 'react';
import { ScrollText, Copy, Check, Search } from 'lucide-react';
import { CrewMember, CrewTier } from '../types/fleet';

interface PromptsLibraryViewProps {
  crew: CrewMember[];
  onInspectOfficer: (id: string) => void;
}

export const PromptsLibraryView: React.FC<PromptsLibraryViewProps> = ({
  crew,
  onInspectOfficer,
}) => {
  const [tier, setTier] = useState<'All' | CrewTier>('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return crew
      .filter((c) => (tier === 'All' ? true : c.tier === tier))
      .flatMap((member) =>
        member.prompts.map((prompt) => ({
          member,
          prompt,
        }))
      )
      .filter(({ member, prompt }) => {
        if (!q) return true;
        return (
          prompt.title.toLowerCase().includes(q) ||
          prompt.template.toLowerCase().includes(q) ||
          member.name.toLowerCase().includes(q) ||
          member.doctrine.toLowerCase().includes(q)
        );
      });
  }, [crew, tier, search]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <section aria-labelledby="prompts-library-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <ScrollText className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="prompts-library-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Doctrine & Prompts Library
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Every Nelson Fleet officer’s mental model distilled into structured decision checklists and copyable prompts.
          </p>
        </div>
        <div className="font-mono-num text-xs px-3 py-1.5 rounded border" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)', color: 'var(--ink)' }}>
          {items.length} Operational Templates
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Command', 'Operations', 'Support', 'Special'] as const).map((t) => {
            const active = tier === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className="px-3 py-1.5 rounded border text-xs font-medium cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--navy)' : 'var(--parchment-raised)',
                  color: active ? '#FAF5EA' : 'var(--ink-2)',
                  borderColor: active ? 'var(--brass)' : 'var(--rule)',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-3)' }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctrines or prompts..."
            className="w-full h-9 pl-8 pr-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map(({ member, prompt }) => (
          <article
            key={prompt.id}
            className="p-4 rounded border flex flex-col justify-between gap-3"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onInspectOfficer(member.id)}
                  className="flex items-center gap-2.5 text-left cursor-pointer group"
                >
                  <img
                    src={member.portrait}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded object-cover object-top border shrink-0"
                    style={{ borderColor: 'var(--brass)' }}
                  />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                      {member.name} · {member.role}
                    </div>
                    <h2 className="font-display text-lg font-semibold group-hover:underline" style={{ color: 'var(--ink)' }}>
                      {prompt.title}
                    </h2>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(prompt.id, prompt.template)}
                  className="px-3 py-1.5 rounded border text-xs font-medium inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  style={{
                    borderColor: 'var(--rule)',
                    backgroundColor: 'var(--parchment)',
                    color: copiedId === prompt.id ? 'var(--ready)' : 'var(--ink)',
                  }}
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs italic" style={{ color: 'var(--ink-2)' }}>
                Thinks like: “{member.doctrine}”
              </p>

              <pre
                className="p-3 rounded border text-xs font-mono whitespace-pre-wrap leading-relaxed"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                {prompt.template}
              </pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
