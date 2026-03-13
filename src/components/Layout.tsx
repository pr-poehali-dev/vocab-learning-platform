import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const navLinks = [
  { href: '/', label: 'Home', icon: 'Sparkles' },
  { href: '/dictionary', label: 'Dictionary', icon: 'BookOpen' },
  { href: '/dictionary/add', label: 'Add Word', icon: 'Plus' },
  { href: '/study', label: 'Study', icon: 'Brain' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="noise-bg min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Icon name="Zap" size={16} className="text-primary" />
            </div>
            <span className="font-display text-lg text-foreground/90 tracking-tight">LexiMind</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon name={link.icon} fallback="Circle" size={15} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={link.label}
                >
                  <Icon name={link.icon} fallback="Circle" size={18} />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-muted-foreground text-sm">
          LexiMind — learn smarter, remember longer
        </div>
      </footer>
    </div>
  );
}
