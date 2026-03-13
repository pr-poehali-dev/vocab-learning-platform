import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

type Category = 'all' | 'nouns' | 'adjectives' | 'verbs' | 'adverbs' | 'animals' | 'other';

interface Word {
  id: number;
  word: string;
  transcription: string;
  translation: string;
  category: Category;
}

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'LayoutGrid' },
  { id: 'nouns', label: 'Nouns', icon: 'Box' },
  { id: 'adjectives', label: 'Adjectives', icon: 'Palette' },
  { id: 'verbs', label: 'Verbs', icon: 'Zap' },
  { id: 'adverbs', label: 'Adverbs', icon: 'Wind' },
  { id: 'animals', label: 'Animals', icon: 'PawPrint' },
  { id: 'other', label: 'Other', icon: 'Sparkles' },
];

const mockWords: Word[] = [
  { id: 1, word: 'Resilience', transcription: '/rɪˈzɪliəns/', translation: 'стойкость, устойчивость', category: 'nouns' },
  { id: 2, word: 'Ephemeral', transcription: '/ɪˈfem.ər.əl/', translation: 'мимолётный, преходящий', category: 'adjectives' },
  { id: 3, word: 'Serendipity', transcription: '/ˌser.ənˈdɪp.ɪ.ti/', translation: 'счастливая случайность', category: 'nouns' },
  { id: 4, word: 'Eloquent', transcription: '/ˈel.ə.kwənt/', translation: 'красноречивый, выразительный', category: 'adjectives' },
  { id: 5, word: 'Perseverance', transcription: '/ˌpɜː.sɪˈvɪər.əns/', translation: 'настойчивость, упорство', category: 'nouns' },
  { id: 6, word: 'Ambiguous', transcription: '/æmˈbɪɡ.ju.əs/', translation: 'неоднозначный, двусмысленный', category: 'adjectives' },
  { id: 7, word: 'Illuminate', transcription: '/ɪˈluː.mɪ.neɪt/', translation: 'освещать, просвещать', category: 'verbs' },
  { id: 8, word: 'Fervent', transcription: '/ˈfɜː.vənt/', translation: 'пылкий, страстный', category: 'adjectives' },
  { id: 9, word: 'Dolphin', transcription: '/ˈdɒl.fɪn/', translation: 'дельфин', category: 'animals' },
  { id: 10, word: 'Swiftly', transcription: '/ˈswɪft.li/', translation: 'быстро, стремительно', category: 'adverbs' },
];

const CATEGORY_COLORS: Record<Category, string> = {
  all: 'text-foreground bg-secondary border-border',
  nouns: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  adjectives: 'text-violet-400 bg-violet-400/10 border-violet-400/25',
  verbs: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  adverbs: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  animals: 'text-orange-400 bg-orange-400/10 border-orange-400/25',
  other: 'text-primary bg-primary/10 border-primary/25',
};

export default function Dictionary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [words] = useState<Word[]>(mockWords);

  const filtered = words.filter((w) => {
    const matchSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || w.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const countByCategory = (cat: Category) =>
    cat === 'all' ? words.length : words.filter((w) => w.category === cat).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
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

        {/* Search */}
        <div className="relative mb-4 animate-fade-in-up stagger-1">
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

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up stagger-2">
          {CATEGORIES.map((cat) => {
            const count = countByCategory(cat.id);
            if (count === 0 && cat.id !== 'all') return null;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  isActive
                    ? CATEGORY_COLORS[cat.id]
                    : 'text-muted-foreground bg-secondary/50 border-border hover:border-border/80 hover:text-foreground'
                }`}
              >
                <Icon name={cat.icon} fallback="Circle" size={12} />
                {cat.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isActive ? 'bg-white/15' : 'bg-muted/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Icon name="SearchX" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {search ? `No words found for "${search}"` : `No words in this category yet`}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              {search && (
                <button onClick={() => setSearch('')} className="text-primary text-sm hover:underline">
                  Clear search
                </button>
              )}
              {activeCategory !== 'all' && (
                <button onClick={() => setActiveCategory('all')} className="text-primary text-sm hover:underline">
                  Show all categories
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_100px_auto] gap-4 px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider animate-fade-in stagger-2">
              <span>Word</span>
              <span>Transcription</span>
              <span>Translation</span>
              <span>Category</span>
              <span></span>
            </div>

            <div className="space-y-2">
              {filtered.map((word, i) => {
                const catInfo = CATEGORIES.find((c) => c.id === word.category);
                return (
                  <div
                    key={word.id}
                    className={`group rounded-xl border border-border bg-card px-5 py-4 card-hover animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
                  >
                    {/* Desktop */}
                    <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_100px_auto] gap-4 items-center">
                      <span className="font-display text-lg text-foreground">{word.word}</span>
                      <span className="text-sm text-muted-foreground font-mono">{word.transcription}</span>
                      <span className="text-sm text-foreground/80">{word.translation}</span>
                      <span>
                        {catInfo && catInfo.id !== 'all' && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[word.category]}`}>
                            <Icon name={catInfo.icon} fallback="Circle" size={10} />
                            {catInfo.label}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Icon name="Pencil" size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-destructive/15 transition-colors" title="Delete">
                          <Icon name="Trash2" size={14} className="text-destructive/70" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-display text-xl text-foreground">{word.word}</p>
                          {catInfo && catInfo.id !== 'all' && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${CATEGORY_COLORS[word.category]}`}>
                              {catInfo.label}
                            </span>
                          )}
                        </div>
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
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in">
              Showing {filtered.length} of {words.length} words
              {activeCategory !== 'all' && (
                <span className="text-primary"> · {CATEGORIES.find((c) => c.id === activeCategory)?.label}</span>
              )}
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
