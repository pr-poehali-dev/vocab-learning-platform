import { useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const mockWords = [
  { id: 1, word: 'Resilience', translation: 'стойкость' },
  { id: 2, word: 'Ephemeral', translation: 'мимолётный' },
  { id: 3, word: 'Serendipity', translation: 'счастливая случайность' },
  { id: 4, word: 'Eloquent', translation: 'красноречивый' },
  { id: 5, word: 'Perseverance', translation: 'настойчивость' },
  { id: 6, word: 'Ambiguous', translation: 'неоднозначный' },
];

const countOptions = [3, 5, 10];

interface SentenceCard {
  sentence: string;
  translation: string;
  explanation: string;
}

const mockGenerate = (word: string, count: number): SentenceCard[] => {
  const examples: Record<string, SentenceCard[]> = {
    Resilience: [
      {
        sentence: `Her resilience in the face of adversity inspired everyone around her.`,
        translation: `Её стойкость перед лицом невзгод вдохновила всех вокруг.`,
        explanation: `"Her" — притяжательное местоимение, указывает на владельца качества. "Resilience" — подлежащее предложения, существительное. "In the face of" — устойчивое предложное словосочетание, означающее "перед лицом чего-либо". "Inspired" — глагол в прошедшем времени (Past Simple), действие завершено. "Everyone around her" — неопределённое местоимение с уточнением.`,
      },
      {
        sentence: `Resilience is not about avoiding failure, but learning how to bounce back.`,
        translation: `Стойкость — это не избегание неудач, а умение восстанавливаться.`,
        explanation: `Предложение построено по структуре "X is not A, but B" — риторическая конструкция противопоставления. "Not about avoiding" — герундий после предлога "about". "But learning how to" — параллельная конструкция. "Bounce back" — фразовый глагол, означающий "восстанавливаться после трудностей".`,
      },
      {
        sentence: `Studies show that resilience can be developed through consistent practice.`,
        translation: `Исследования показывают, что стойкость можно развить через постоянную практику.`,
        explanation: `"Studies show that" — вводная конструкция для ссылки на источник. "Can be developed" — модальный глагол + пассивный залог (Modal Passive). "Through consistent practice" — предложное дополнение, отвечает на вопрос "как?".`,
      },
    ],
    Serendipity: [
      {
        sentence: `It was pure serendipity that they met at the same coffee shop.`,
        translation: `Это была чистая случайность, что они встретились в одном кафе.`,
        explanation: `"It was pure" — вводная конструкция с усилительным прилагательным "pure". "Serendipity" — подлежащее именной части сказуемого. "That they met" — придаточное предложение-подлежащее, объясняющее суть случайности. Past Simple использован для завершённого события.`,
      },
      {
        sentence: `Many great scientific discoveries happened through serendipity rather than design.`,
        translation: `Многие великие научные открытия произошли благодаря случайности, а не замыслу.`,
        explanation: `"Many great scientific discoveries" — распространённое подлежащее с несколькими определениями. "Happened through" — предлог "through" указывает на средство или путь. "Rather than design" — конструкция сравнения-противопоставления, "rather than" = "а не".`,
      },
      {
        sentence: `She found her dream job through serendipity — a chance encounter at a bookstore.`,
        translation: `Она нашла работу мечты благодаря случайности — случайной встрече в книжном магазине.`,
        explanation: `"Found her dream job" — Past Simple, завершённое действие. "Through serendipity" — предложное дополнение способа. Тире вводит пояснение (апозиция). "A chance encounter" — существительное с определением, уточняет суть случайности.`,
      },
    ],
  };

  const fallback: SentenceCard[] = Array.from({ length: count }, (_, i) => ({
    sentence: `The concept of ${word.toLowerCase()} is central to understanding modern psychology and human behavior.`,
    translation: `Концепция "${word.toLowerCase()}" является центральной для понимания современной психологии и поведения человека.`,
    explanation: `"The concept of" — устойчивая конструкция введения темы. "${word}" — именная группа как объект изучения. "Is central to" — предикативное прилагательное с предлогом. "Understanding" — герундий после предлога "to". "Modern psychology and human behavior" — параллельное перечисление двух сфер. (Пример ${i + 1})`,
  }));

  const data = examples[word] || fallback;
  return data.slice(0, count).concat(
    count > data.length ? fallback.slice(0, count - data.length) : []
  );
};

function highlightWord(sentence: string, word: string) {
  const regex = new RegExp(`(${word})`, 'gi');
  const parts = sentence.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="word-highlight">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Study() {
  const [selectedWord, setSelectedWord] = useState('');
  const [count, setCount] = useState(3);
  const [cards, setCards] = useState<SentenceCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const handleGenerate = () => {
    if (!selectedWord) return;
    setLoading(true);
    setCards([]);
    setExpanded({});
    setTimeout(() => {
      setCards(mockGenerate(selectedWord, count));
      setLoading(false);
    }, 1200);
  };

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const currentWord = mockWords.find((w) => w.word === selectedWord);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-primary text-xs font-medium uppercase tracking-widest mb-1">AI Practice</p>
          <h1 className="font-display text-4xl">Study Words</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate contextual sentences with grammar explanations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-8 animate-fade-in-up stagger-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                <Icon name="BookMarked" size={13} className="text-primary" />
                Choose a word
              </label>
              <div className="relative">
                <select
                  value={selectedWord}
                  onChange={(e) => setSelectedWord(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-secondary border border-border text-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a word...</option>
                  {mockWords.map((w) => (
                    <option key={w.id} value={w.word}>
                      {w.word} — {w.translation}
                    </option>
                  ))}
                </select>
                <Icon name="ChevronDown" size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

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
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      count === n
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedWord && currentWord && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/50 border border-primary/15 mb-5 animate-fade-in">
              <Icon name="Info" size={14} className="text-accent-foreground shrink-0" />
              <p className="text-xs text-accent-foreground">
                Generating <strong>{count} sentences</strong> for <strong className="font-display text-sm">{selectedWord}</strong> — {currentWord.translation}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!selectedWord || loading}
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
              </>
            )}
          </button>
        </div>

        {loading && (
          <div className="space-y-4 animate-fade-in">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border h-32 animate-shimmer" />
            ))}
          </div>
        )}

        {!loading && cards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{cards.length} sentences</span> generated for{' '}
                <span className="text-primary font-display">{selectedWord}</span>
              </p>
              <button
                onClick={() => setExpanded(Object.fromEntries(cards.map((_, i) => [i, true])))}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
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
                      title={expanded[i] ? 'Hide explanation' : 'Show explanation'}
                    >
                      <Icon
                        name={expanded[i] ? 'ChevronUp' : 'ChevronDown'}
                        size={15}
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>

                  <p className="text-base text-foreground leading-relaxed mb-2">
                    {highlightWord(card.sentence, selectedWord)}
                  </p>

                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {card.translation}
                  </p>
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

        {!loading && cards.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Icon name="Wand2" size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Select a word and press <span className="text-primary font-medium">Generate with AI</span></p>
            <p className="text-muted-foreground/60 text-xs mt-1">Sentences will appear here with grammar explanations</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
