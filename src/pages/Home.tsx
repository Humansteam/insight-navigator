import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings2, Mic, ArrowUp, FileText, LayoutGrid, Smartphone, Bell, X, ChevronDown } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const Home = () => {
  const [input, setInput] = useState('');
  const [showIntegrations, setShowIntegrations] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Navigate to research page or handle query
      console.log('Query:', input);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Strata 1.5</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
            <span className="text-sm font-medium text-foreground">✦ 1,091</span>
          </div>
          <ThemeSwitcher />
          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=strata"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-10">
          Let's dive into your knowledge
        </h1>

        {/* Search Input */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Input Field */}
              <input
                type="text"
                placeholder="Assign a task or ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />

              {/* Bottom Row with Icons */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Integrations Bar */}
          {showIntegrations && (
            <div className="mt-2 flex items-center justify-between px-4 py-2 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Settings2 className="w-4 h-4" />
                <span className="text-sm">Connect your tools to Strata</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Integration Icons */}
                <div className="flex items-center gap-1">
                  {['🌐', '📧', '📊', '🎨', '🔗', '🐙', '📱'].map((icon, i) => (
                    <span key={i} className="text-sm">{icon}</span>
                  ))}
                </div>
                <button
                  onClick={() => setShowIntegrations(false)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/documents"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-accent transition-colors"
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Documents</span>
            </Link>
            <Link
              to="/research"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-accent transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Research</span>
            </Link>
            <Link
              to="/agent"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-accent transition-colors"
            >
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Agent Mode</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
