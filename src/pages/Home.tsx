import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'BookOpen',
    title: 'Personal Dictionary',
    desc: 'Save words with transcription and translation. Search and manage your vocabulary effortlessly.',
    href: '/dictionary',
    label: 'Open Dictionary',
    delay: 'stagger-1',
  },
  {
    icon: 'Brain',
    title: 'AI-Powered Study',
    desc: 'Generate contextual sentences with detailed grammar explanations using neural networks.',
    href: '/study',
    label: 'Start Studying',
    delay: 'stagger-2',
  },
  {
    icon: 'Plus',
    title: 'Add New Words',
    desc: 'Quickly add words with transcription and translation to build your personal vocabulary base.',
    href: '/dictionary/add',
    label: 'Add a Word',
    delay: 'stagger-3',
  },
];

export default function Home() {
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium mb-6 tracking-wide uppercase">
            <Icon name="Sparkles" size={12} />
            AI-Enhanced Vocabulary Learning
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Learn English{' '}
            <span className="text-gradient italic">Words</span>
            <br />
            the Smart Way
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Build your personal dictionary, then let AI generate real sentences with deep grammar explanations — so you understand, not just memorize.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/study"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 glow-emerald-sm hover:glow-emerald"
            >
              <Icon name="Brain" size={16} />
              Start Studying
            </Link>
            <Link
              to="/dictionary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold text-sm hover:bg-secondary transition-colors duration-200"
            >
              <Icon name="BookOpen" size={16} />
              My Dictionary
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.href}
              className={`group relative rounded-2xl border border-border bg-card p-6 card-hover animate-fade-in-up opacity-0 ${f.delay}`}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon name={f.icon} fallback="Circle" size={20} className="text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{f.desc}</p>
              <Link
                to={f.href}
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all duration-200"
              >
                {f.label}
                <Icon name="ArrowRight" size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border/60 bg-card/50 p-8 animate-fade-in-up opacity-0 stagger-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <h2 className="font-display text-2xl mb-2">How it works</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Add words to your dictionary → select a word on Study page → choose how many sentences to generate → AI creates contextual examples with full grammar breakdowns.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              {['Add', 'Select', 'Generate', 'Learn'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-semibold text-xs">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                  {i < 3 && <Icon name="ChevronRight" size={14} className="text-border mb-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
