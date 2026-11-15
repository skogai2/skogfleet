import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { CrewMember } from '../types/fleet';

interface LogsJournalsViewProps {
  crew: CrewMember[];
  voyageDay: number;
  onAddJournal: (memberId: string, title: string, content: string) => void;
  onInspectOfficer: (id: string) => void;
}

export const LogsJournalsView: React.FC<LogsJournalsViewProps> = ({
  crew,
  voyageDay,
  onAddJournal,
  onInspectOfficer,
}) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [newAuthorId, setNewAuthorId] = useState(crew[0]?.id || 'sophie-marlowe');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const allEntries = useMemo(() => {
    const list = crew.flatMap((member) =>
      member.journals.map((entry) => ({
        ...entry,
        member,
      }))
    );
    return list.sort((a, b) => b.day - a.day);
  }, [crew]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((item) => {
      if (selectedAuthor !== 'all' && item.member.id !== selectedAuthor) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.member.name.toLowerCase().includes(q)
      );
    });
  }, [allEntries, selectedAuthor, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddJournal(newAuthorId, newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
  };

  return (
    <section aria-labelledby="logs-journals-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="logs-journals-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Logs & Journals
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Chronological squadron logbook across all 18 officers, captains, marines, and Kronsch.
          </p>
        </div>
        <div className="font-mono-num text-xs px-3 py-1.5 rounded border" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)', color: 'var(--ink)' }}>
          {allEntries.length} Total Entries · Day {voyageDay}
        </div>
      </div>

      {/* Compose Entry */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded border space-y-3"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
          Record Shipboard Log Entry
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={newAuthorId}
            onChange={(e) => setNewAuthorId(e.target.value)}
            aria-label="Log author"
            className="h-9 px-3 rounded border text-xs cursor-pointer"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          >
            {crew.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.role})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Entry heading..."
            className="md:col-span-2 h-9 px-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write observation in plain, verifiable language..."
            className="flex-1 p-2.5 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded text-xs font-semibold inline-flex items-center justify-center gap-1.5 self-end sm:self-stretch cursor-pointer"
            style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
          >
            <Plus className="w-4 h-4" /> Log Entry
          </button>
        </div>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          aria-label="Filter logs by officer"
          className="h-9 px-3 rounded border text-xs cursor-pointer"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
            color: 'var(--ink)',
          }}
        >
          <option value="all">All Officers ({allEntries.length} entries)</option>
          {crew.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.role}
            </option>
          ))}
        </select>

        <div className="relative sm:w-64">
          <Search
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-3)' }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search log text..."
            className="w-full h-9 pl-8 pr-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      {/* Entries Feed */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="p-4 rounded border flex flex-col sm:flex-row gap-4"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <button
              type="button"
              onClick={() => onInspectOfficer(item.member.id)}
              className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:w-40 shrink-0 text-left cursor-pointer group"
            >
              <img
                src={item.member.portrait}
                alt={item.member.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded object-cover object-top border"
                style={{ borderColor: 'var(--brass)' }}
              />
              <div>
                <div className="font-display font-semibold text-sm group-hover:underline" style={{ color: 'var(--ink)' }}>
                  {item.member.name}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                  {item.member.role}
                </div>
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num" style={{ color: 'var(--ink-3)' }}>
                <span>{item.timestamp}</span>
                <span>Day {item.day}</span>
              </div>
              <h2 className="font-display text-base font-semibold mt-1" style={{ color: 'var(--ink)' }}>
                {item.title}
              </h2>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {item.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
