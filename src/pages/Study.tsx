import { useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const AI_SENTENCES_URL = 'https://functions.poehali.dev/c666ce34-6731-452e-a725-366677eda139';

const mockWords = [
  { id: 1, word: 'Resilience', translation: 'стойкость' },
  { id: 2, word: 'Ephemeral', translation: 'мимолётный' },
  { id: 3, word: 'Serendipity', translation: 'счастливая случайность' },
  { id: 4, word: 'Eloquent', translation: 'красноречивый' },
  { id: 5, word: 'Perseverance', translation: 'настойчивость' },
  { id: 6, word: 'Ambiguous', translation: 'неоднозначный' },
  { id: 7, word: 'Illuminate', translation: 'освещать' },
  { id: 8, word: 'Fervent', translation: 'пылкий' },
];

const countOptions = [3, 5, 10];

interface SentenceCard {
  sentence: string;
  translation: string;
  explanation: string;
}

function highlightWords(sentence: string, words: string[]) {
  if (!words.length) return <span>{sentence}</span>;

  const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = sentence.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="word-highlight">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function Study() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [count, setCount] = useState(3);
  const [cards, setCards] = useState<SentenceCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const clearWords = () => setSelectedWords([]);

  const handleGenerate = async () => {
    if (!selectedWords.length) return;
    setLoading(true);
    setCards([]);
    setExpanded({});
    setError('');

    try {
      const res = await fetch(AI_SENTENCES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: selectedWords, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');
      setCards(data.sentences || []);
    } catch {
      setError('Не удалось сгенерировать предложения. Проверь подключение и повтори.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const expandAll = () => {
    setExpanded(Object.fromEntries(cards.map((_, i) => [i, true])));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-primary text-xs font-medium uppercase tracking-widest mb-1">AI Practice</p>
          <h1 className="font-display text-4xl">Study Words</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate contextual sentences with grammar explanations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-8 animate-fade-in-up stagger-1 space-y-5">
          {/* Word multi-select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                <Icon name="BookMarked" size={13} className="text-primary" />
                Choose words
                <span className="text-muted-foreground font-normal text-xs">(select one or more)</span>
              </label>
              {selectedWords.length > 0 && (
                <button
                  onClick={clearWords}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Icon name="X" size={11} />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {mockWords.map((w) => {
                const isSelected = selectedWords.includes(w.word);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWord(w.word)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all duration-150 ${
                      isSelected
                        ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                        : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                    }`}
                  >
                    {isSelected && <Icon name="Check" size={12} />}
                    <span className="font-display">{w.word}</span>
                    <span className="text-xs opacity-60">— {w.translation}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
              <Icon name="Hash" size={13} className="text-primary" />
              Number of sentences
            </label>
            <div className="flex gap-2">
              {countOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    count === n
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Selected words summary */}
          {selectedWords.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/50 border border-primary/15 animate-fade-in">
              <Icon name="Info" size={14} className="text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                Generating <strong>{count} sentences</strong> using{' '}
                {selectedWords.length === 1 ? (
                  <strong className="font-display">{selectedWords[0]}</strong>
                ) : (
                  <>
                    <strong>{selectedWords.length} words</strong>:{' '}
                    {selectedWords.map((w, i) => (
                      <span key={w}>
                        <strong className="font-display">{w}</strong>
                        {i < selectedWords.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedWords.length || loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-emerald-sm hover:glow-emerald"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Generating sentences...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={16} />
                Generate with AI
                {selectedWords.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-foreground/15 text-xs">
                    {selectedWords.length} {selectedWords.length === 1 ? 'word' : 'words'}
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/30 bg-destructive/8 mb-6 animate-fade-in">
            <Icon name="AlertCircle" size={16} className="text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Shimmer skeleton */}
        {loading && (
          <div className="space-y-4 animate-fade-in">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border h-32 animate-shimmer" />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && cards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{cards.length} sentences</span> generated for{' '}
                {selectedWords.map((w, i) => (
                  <span key={w}>
                    <span className="text-primary font-display">{w}</span>
                    {i < selectedWords.length - 1 ? <span className="text-muted-foreground">, </span> : ''}
                  </span>
                ))}
              </p>
              <button onClick={expandAll} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Expand all
              </button>
            </div>

            {cards.map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-border bg-card overflow-hidden card-hover animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-semibold">{i + 1}</span>
                    </div>
                    <button
                      onClick={() => toggleExpanded(i)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
                    >
                      <Icon
                        name={expanded[i] ? 'ChevronUp' : 'ChevronDown'}
                        size={15}
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>

                  <p className="text-base text-foreground leading-relaxed mb-2">
                    {highlightWords(card.sentence, selectedWords)}
                  </p>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">{card.translation}</p>
                </div>

                {expanded[i] && (
                  <div className="border-t border-border/60 bg-secondary/30 px-5 py-4 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="GraduationCap" size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Grammar Explanation</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{card.explanation}</p>
                  </div>
                )}

                {!expanded[i] && (
                  <button
                    onClick={() => toggleExpanded(i)}
                    className="w-full px-5 py-2.5 border-t border-border/40 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-accent/30 transition-all"
                  >
                    <Icon name="GraduationCap" size={12} />
                    Show grammar explanation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && cards.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Icon name="Wand2" size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Select one or more words, then press{' '}
              <span className="text-primary font-medium">Generate with AI</span>
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              You can combine multiple words in one set of sentences
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
