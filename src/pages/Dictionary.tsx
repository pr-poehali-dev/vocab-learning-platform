import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const mockWords = [
  { id: 1, word: 'Resilience', transcription: '/rɪˈzɪliəns/', translation: 'стойкость, устойчивость' },
  { id: 2, word: 'Ephemeral', transcription: '/ɪˈfem.ər.əl/', translation: 'мимолётный, преходящий' },
  { id: 3, word: 'Serendipity', transcription: '/ˌser.ənˈdɪp.ɪ.ti/', translation: 'счастливая случайность' },
  { id: 4, word: 'Eloquent', transcription: '/ˈel.ə.kwənt/', translation: 'красноречивый, выразительный' },
  { id: 5, word: 'Perseverance', transcription: '/ˌpɜː.sɪˈvɪər.əns/', translation: 'настойчивость, упорство' },
  { id: 6, word: 'Ambiguous', transcription: '/æmˈbɪɡ.ju.əs/', translation: 'неоднозначный, двусмысленный' },
];

export default function Dictionary() {
  const [search, setSearch] = useState('');
  const [words] = useState(mockWords);

  const filtered = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <p className="text-primary text-xs font-medium uppercase tracking-widest mb-1">My Vocabulary</p>
            <h1 className="font-display text-4xl">Dictionary</h1>
            <p className="text-muted-foreground text-sm mt-1">{words.length} words saved</p>
          </div>
          <Link
            to="/dictionary/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-emerald-sm shrink-0"
          >
            <Icon name="Plus" size={16} />
            Add Word
          </Link>
        </div>

        <div className="relative mb-6 animate-fade-in-up stagger-1">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search words or translations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
            >
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Icon name="SearchX" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No words found for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-primary text-sm hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider animate-fade-in stagger-1">
              <span>Word</span>
              <span>Transcription</span>
              <span>Translation</span>
              <span></span>
            </div>

            <div className="space-y-2">
              {filtered.map((word, i) => (
                <div
                  key={word.id}
                  className={`group rounded-xl border border-border bg-card px-5 py-4 card-hover animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
                >
                  <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                    <span className="font-display text-lg text-foreground">{word.word}</span>
                    <span className="text-sm text-muted-foreground font-mono">{word.transcription}</span>
                    <span className="text-sm text-foreground/80">{word.translation}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                        <Icon name="Pencil" size={14} className="text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/15 transition-colors" title="Delete">
                        <Icon name="Trash2" size={14} className="text-destructive/70" />
                      </button>
                    </div>
                  </div>

                  <div className="sm:hidden flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xl text-foreground">{word.word}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{word.transcription}</p>
                      <p className="text-sm text-foreground/80 mt-1">{word.translation}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Icon name="Pencil" size={14} className="text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/15 transition-colors">
                        <Icon name="Trash2" size={14} className="text-destructive/70" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 0 && (
              <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in">
                Showing {filtered.length} of {words.length} words
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
