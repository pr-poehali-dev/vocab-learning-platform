import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const AI_WORD_LOOKUP_URL = 'https://functions.poehali.dev/5c439dc4-74e9-4087-997a-053dc6bbad2c';

export default function AddWord() {
  const [form, setForm] = useState({ word: '', transcription: '', translation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAiLookup = async () => {
    const word = form.word.trim();
    if (!word) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch(AI_WORD_LOOKUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');
      setForm((prev) => ({
        ...prev,
        transcription: data.transcription || prev.transcription,
        translation: data.translation || prev.translation,
      }));
    } catch {
      setAiError('Не удалось получить данные. Заполните вручную.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.translation.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setForm({ word: '', transcription: '', translation: '' });
    setSubmitted(false);
    setAiError('');
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 animate-fade-in-up">
          <Link
            to="/dictionary"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <Icon name="ArrowLeft" size={14} />
            Back to Dictionary
          </Link>
          <p className="text-primary text-xs font-medium uppercase tracking-widest mb-1">Vocabulary</p>
          <h1 className="font-display text-4xl">Add New Word</h1>
          <p className="text-muted-foreground text-sm mt-1">Expand your personal dictionary</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/8 p-8 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-4 glow-emerald-sm">
              <Icon name="CheckCircle2" size={28} className="text-primary" />
            </div>
            <h2 className="font-display text-2xl mb-2">Word Added!</h2>
            <p className="text-muted-foreground text-sm mb-1">
              <span className="text-foreground font-semibold">"{form.word}"</span> has been saved to your dictionary.
            </p>
            <p className="text-muted-foreground text-xs mb-6">{form.transcription} · {form.translation}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                <Icon name="Plus" size={15} />
                Add Another
              </button>
              <Link
                to="/dictionary"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
              >
                <Icon name="BookOpen" size={15} />
                View Dictionary
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up stagger-1">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              {/* Word field + AI button */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                  <Icon name="Type" size={13} className="text-primary" />
                  English Word
                  <span className="text-destructive ml-0.5">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="word"
                    value={form.word}
                    onChange={handleChange}
                    placeholder="e.g. Serendipity"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all font-display text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAiLookup}
                    disabled={!form.word.trim() || aiLoading}
                    title="Автозаполнить транскрипцию и перевод через AI"
                    className="shrink-0 px-4 py-3 rounded-xl bg-primary/15 border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    {aiLoading ? (
                      <Icon name="Loader2" size={15} className="animate-spin" />
                    ) : (
                      <Icon name="Sparkles" size={15} />
                    )}
                    <span className="hidden sm:inline">{aiLoading ? 'Searching...' : 'AI Fill'}</span>
                  </button>
                </div>

                {/* AI hint */}
                {!aiError && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Sparkles" size={11} className="text-primary" />
                    Type a word and press <span className="text-primary font-medium">AI Fill</span> — transcription and translation will be filled automatically
                  </p>
                )}
                {aiError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <Icon name="AlertCircle" size={11} />
                    {aiError}
                  </p>
                )}
              </div>

              {/* Transcription */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                  <Icon name="AudioLines" size={13} className="text-primary" />
                  Transcription
                  <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="transcription"
                    value={form.transcription}
                    onChange={handleChange}
                    placeholder="e.g. /ˌser.ənˈdɪp.ɪ.ti/"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all font-mono"
                  />
                  {aiLoading && (
                    <div className="absolute inset-0 rounded-xl animate-shimmer pointer-events-none opacity-60" />
                  )}
                </div>
              </div>

              {/* Translation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                  <Icon name="Languages" size={13} className="text-primary" />
                  Translation
                  <span className="text-destructive ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="translation"
                    value={form.translation}
                    onChange={handleChange}
                    placeholder="e.g. счастливая случайность"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                  {aiLoading && (
                    <div className="absolute inset-0 rounded-xl animate-shimmer pointer-events-none opacity-60" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !form.word.trim() || !form.translation.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-emerald-sm hover:glow-emerald"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={16} />
                  Add to Dictionary
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are required
            </p>
          </form>
        )}
      </div>
    </Layout>
  );
}
