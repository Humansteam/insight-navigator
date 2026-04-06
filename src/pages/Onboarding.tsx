import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ── Data ──────────────────────────────────────────────

interface TopicCard {
  id: string;
  title: string;
  category: string;
  emoji: string;
  topics: string[];
  size: 'sm' | 'md' | 'lg' | 'xl';
}

const TOPIC_CARDS: TopicCard[] = [
  { id: '1', title: 'AI Is Eating Strategy', category: 'AI / ML', emoji: '🤖', topics: ['AI', 'ML', 'LLM', 'Agents'], size: 'lg' },
  { id: '2', title: 'The Search Revolution', category: 'RAG & Search', emoji: '🔍', topics: ['RAG', 'Search', 'Embeddings'], size: 'md' },
  { id: '3', title: 'Agents Are the New Apps', category: 'LLM Agents', emoji: '🧠', topics: ['Agents', 'Autonomy', 'Tool Use'], size: 'xl' },
  { id: '4', title: 'Zero to One, Again', category: 'Startups', emoji: '🚀', topics: ['Startups', 'Growth', 'PMF'], size: 'sm' },
  { id: '5', title: 'Follow the Money', category: 'VC & Fundraising', emoji: '💰', topics: ['VC', 'Fundraising', 'Valuations'], size: 'md' },
  { id: '6', title: 'Product-Led Everything', category: 'Product', emoji: '📦', topics: ['Product', 'UX', 'Metrics'], size: 'lg' },
  { id: '7', title: 'Pipelines at Scale', category: 'Data Engineering', emoji: '⚙️', topics: ['Data', 'ETL', 'Infrastructure'], size: 'sm' },
  { id: '8', title: 'Beyond the Horizon', category: 'Deep Tech', emoji: '🔬', topics: ['Deep Tech', 'Research', 'Quantum'], size: 'md' },
  { id: '9', title: 'SaaS Is Not Dead', category: 'SaaS / B2B', emoji: '🏢', topics: ['SaaS', 'B2B', 'Enterprise'], size: 'xl' },
  { id: '10', title: 'Code Your Own Tools', category: 'DevTools', emoji: '🛠', topics: ['DevTools', 'DX', 'Open Source'], size: 'md' },
  { id: '11', title: 'Money Reimagined', category: 'Fintech', emoji: '🏦', topics: ['Fintech', 'Payments', 'Crypto'], size: 'lg' },
  { id: '12', title: 'Health Is Wealth', category: 'Healthcare', emoji: '🏥', topics: ['Healthcare', 'Biotech', 'Medicine'], size: 'sm' },
  { id: '13', title: 'Hack-Proof World', category: 'Cybersecurity', emoji: '🔒', topics: ['Security', 'Privacy', 'Compliance'], size: 'md' },
  { id: '14', title: 'Open by Default', category: 'Open Source', emoji: '🌐', topics: ['Open Source', 'Community', 'Licensing'], size: 'sm' },
  { id: '15', title: 'Machines That Move', category: 'Robotics', emoji: '🦾', topics: ['Robotics', 'Automation', 'Hardware'], size: 'lg' },
  { id: '16', title: 'Building for Tomorrow', category: 'Climate Tech', emoji: '🌱', topics: ['Climate', 'Energy', 'Sustainability'], size: 'md' },
];

interface Person {
  id: string;
  name: string;
  role: string;
  categories: string[];
}

const PEOPLE: Person[] = [
  { id: 'karpathy', name: 'Andrej Karpathy', role: 'AI / Tesla', categories: ['AI / ML', 'Deep Tech'] },
  { id: 'pg', name: 'Paul Graham', role: 'Y Combinator', categories: ['Startups'] },
  { id: 'huberman', name: 'Andrew Huberman', role: 'Neuroscience', categories: ['Healthcare'] },
  { id: 'lenny', name: 'Lenny Rachitsky', role: 'Product', categories: ['Product'] },
  { id: 'lex', name: 'Lex Fridman', role: 'Podcast host', categories: ['AI / ML', 'Deep Tech'] },
  { id: 'lecun', name: 'Yann LeCun', role: 'Meta AI', categories: ['AI / ML'] },
  { id: 'naval', name: 'Naval Ravikant', role: 'AngelList', categories: ['VC & Fundraising', 'Startups'] },
  { id: 'altman', name: 'Sam Altman', role: 'OpenAI', categories: ['AI / ML', 'Startups'] },
  { id: 'balaji', name: 'Balaji Srinivasan', role: 'Tech / Crypto', categories: ['Fintech', 'Deep Tech'] },
  { id: 'elad', name: 'Elad Gil', role: 'Investor', categories: ['Startups', 'VC & Fundraising'] },
  { id: 'collison', name: 'Patrick Collison', role: 'Stripe', categories: ['Fintech', 'Startups'] },
  { id: 'demis', name: 'Demis Hassabis', role: 'DeepMind', categories: ['AI / ML', 'Deep Tech'] },
  { id: 'karpathy2', name: 'Jim Keller', role: 'Chips / HW', categories: ['Deep Tech', 'Robotics'] },
  { id: 'guillermo', name: 'Guillermo Rauch', role: 'Vercel', categories: ['DevTools'] },
  { id: 'nat', name: 'Nat Friedman', role: 'GitHub', categories: ['Open Source', 'DevTools'] },
  { id: 'tobi', name: 'Tobi Lütke', role: 'Shopify', categories: ['SaaS / B2B', 'Startups'] },
];

const EXAMPLES = [
  'Building an AI product for analysts',
  'VC fund partner, looking at deeptech',
  'Product lead at a B2B SaaS startup',
  'ML engineer working on search & RAG',
  'Data analyst in fintech',
  'Founder, pre-seed stage',
];

const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f97316', '#ec4899'];
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const STEPS_META = [
  { num: 1, title: 'WHAT DO YOU DO?', sub: "Tell us in a sentence or two — we'll tailor everything to you." },
  { num: 2, title: 'PICK WHAT GRABS YOU', sub: 'Tap cards that interest you. We\'ll track these areas for you.' },
  { num: 3, title: 'WHOSE THINKING MATTERS?', sub: 'Optional — helps us prioritize the right sources.' },
];

// ── Masonry layout helper ──────────────────────────────

function useMasonryColumns(cards: TopicCard[], colCount: number) {
  return useMemo(() => {
    const columns: TopicCard[][] = Array.from({ length: colCount }, () => []);
    const colH = new Array(colCount).fill(0);
    const sH: Record<string, number> = { sm: 120, md: 150, lg: 180, xl: 210 };
    
    for (const card of cards) {
      const shortest = colH.indexOf(Math.min(...colH));
      columns[shortest].push(card);
      colH[shortest] += sH[card.size] + 8;
    }
    return columns;
  }, [cards, colCount]);
}

// ── Main ──────────────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [contextInput, setContextInput] = useState('');
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());

  const columns = useMasonryColumns(TOPIC_CARDS, 4);

  // Derive selected categories for filtering people
  const selectedCategories = useMemo(() => {
    const cats = new Set<string>();
    TOPIC_CARDS.filter(c => selectedCards.has(c.id)).forEach(c => cats.add(c.category));
    return [...cats];
  }, [selectedCards]);

  const filteredPeople = useMemo(() => {
    if (selectedCategories.length === 0) return PEOPLE;
    return PEOPLE.filter(p => p.categories.some(c => selectedCategories.includes(c)));
  }, [selectedCategories]);

  useEffect(() => {
    const t = setTimeout(() => { setIsTransitioning(false); setStep(1); }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step === 1 && textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [step]);

  const goTo = useCallback((n: number) => {
    setIsTransitioning(true);
    setTimeout(() => { setIsTransitioning(false); setStep(n); }, 400);
  }, []);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const toggleCard = (id: string) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePerson = (id: string) => {
    setSelectedPeople(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit1 = () => { if (!contextInput.trim()) return; goTo(2); };
  const submit2 = () => { if (selectedCards.size < 2) return; goTo(3); };
  const submit3 = (skip = false) => { goTo(4); };

  const meta = step >= 1 && step <= 3 ? STEPS_META[step - 1] : null;
  const allTopics = useMemo(() => {
    return [...new Set(TOPIC_CARDS.filter(c => selectedCards.has(c.id)).flatMap(c => c.topics))];
  }, [selectedCards]);

  const sH: Record<string, number> = { sm: 120, md: 150, lg: 180, xl: 210 };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative overflow-hidden">
      {/* Progress dots */}
      {step >= 1 && step <= 3 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              step >= s ? 'bg-foreground w-8' : 'bg-muted w-1.5'
            )} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-muted-foreground text-sm py-20 mt-40"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
          </motion.div>
        ) : step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl flex flex-col items-center justify-center min-h-screen px-4 space-y-8"
          >
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight uppercase">
                {meta?.title}
              </h1>
              <p className="text-base text-muted-foreground max-w-md mx-auto">{meta?.sub}</p>
            </div>

            {/* Example chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLES.map((ex, i) => (
                <motion.button
                  key={ex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  onClick={() => setContextInput(ex)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border',
                    contextInput === ex
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                  )}
                >
                  {ex}
                </motion.button>
              ))}
            </div>

            {/* Input card */}
            <div className="w-full rounded-2xl border border-border bg-card/60 overflow-hidden">
              <div className="p-5">
                <textarea
                  ref={textareaRef}
                  value={contextInput}
                  onChange={handleTextarea}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit1(); } }}
                  placeholder="Describe what you do…"
                  className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-h-[56px] leading-relaxed"
                  rows={2}
                />
              </div>
              <div className="px-5 py-3 flex items-center justify-end border-t border-border/40">
                <button
                  onClick={submit1}
                  disabled={!contextInput.trim()}
                  className={cn(
                    'h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                    contextInput.trim()
                      ? 'bg-foreground text-background hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                  )}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col min-h-screen"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/30">
              <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground uppercase tracking-wide">{meta?.title}</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedCards.size === 0 ? 'Tap cards you find interesting' : `${selectedCards.size} selected`}
                  </p>
                </div>
                <button
                  onClick={submit2}
                  disabled={selectedCards.size < 2}
                  className={cn(
                    'px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                    selectedCards.size >= 2
                      ? 'bg-foreground text-background hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                  )}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Masonry grid */}
            <div className="max-w-4xl mx-auto px-3 pt-4 pb-20 w-full">
              <div className="flex gap-2.5">
                {columns.map((col, ci) => (
                  <div key={ci} className="flex-1 flex flex-col gap-2.5 min-w-0">
                    {col.map((card, cardIdx) => {
                      const isSel = selectedCards.has(card.id);
                      const isExpanded = expandedCard === card.id;
                      return (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ci * 0.05 + cardIdx * 0.03 }}
                        >
                          <button
                            onClick={() => toggleCard(card.id)}
                            onDoubleClick={() => setExpandedCard(isExpanded ? null : card.id)}
                            className={cn(
                              'relative w-full rounded-2xl overflow-hidden transition-all duration-200 text-left group',
                              isSel ? 'ring-2 ring-primary scale-[0.97]' : 'ring-1 ring-border hover:ring-foreground/20'
                            )}
                            style={{ height: isExpanded ? sH[card.size] + 80 : sH[card.size] }}
                          >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-card" />
                            <div className={cn(
                              'absolute inset-0 transition-opacity duration-300',
                              isSel ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                            )} style={{
                              backgroundImage: `radial-gradient(ellipse at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`
                            }} />

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-between p-3.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">
                                  {card.emoji} {card.category}
                                </span>
                                {isSel && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                  >
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                  </motion.div>
                                )}
                              </div>

                              <div>
                                <h2 className={cn(
                                  'font-semibold leading-tight transition-colors',
                                  card.size === 'sm' ? 'text-[13px]' : card.size === 'md' ? 'text-[15px]' : 'text-lg',
                                  isSel ? 'text-foreground' : 'text-foreground/80'
                                )}>
                                  {card.title}
                                </h2>

                                {/* Sub-topics shown when expanded or selected */}
                                <AnimatePresence>
                                  {(isExpanded || isSel) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="flex flex-wrap gap-1 mt-2"
                                    >
                                      {card.topics.map(t => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                          {t}
                                        </span>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : step === 3 ? (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col min-h-screen"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/30">
              <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground uppercase tracking-wide">{meta?.title}</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedPeople.size === 0 ? "We'll track their content" : `${selectedPeople.size} following`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => submit3(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Skip →
                  </button>
                  <button
                    onClick={() => submit3(false)}
                    className={cn(
                      'px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200',
                      selectedPeople.size > 0
                        ? 'bg-foreground text-background hover:opacity-90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                    )}
                    disabled={selectedPeople.size === 0}
                  >
                    Done <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* People grid */}
            <div className="max-w-3xl mx-auto px-4 pt-6 pb-20 w-full">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredPeople.map((person, i) => {
                  const isSel = selectedPeople.has(person.id);
                  return (
                    <motion.button
                      key={person.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => togglePerson(person.id)}
                      className={cn(
                        'flex flex-col items-center py-5 px-2 rounded-2xl transition-all duration-200 border',
                        isSel
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-card/40 border-border hover:border-foreground/20'
                      )}
                    >
                      <div className="relative">
                        <div
                          className={cn(
                            'w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-all',
                            isSel && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                          )}
                          style={{ backgroundColor: getAvatarColor(person.name) }}
                        >
                          {getInitials(person.name)}
                        </div>
                        {isSel && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background"
                          >
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                      <span className={cn(
                        'text-[11px] font-medium text-center leading-tight mt-2.5 transition-colors',
                        isSel ? 'text-primary' : 'text-foreground/70'
                      )}>
                        {person.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground/50 text-center mt-0.5">
                        {person.role}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : step === 4 ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm flex flex-col items-center justify-center min-h-screen px-4 space-y-8"
          >
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-primary to-accent"
              >
                <Check className="w-9 h-9 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground">You're in</h1>
              <p className="text-sm text-muted-foreground">Your feed is being built right now.</p>
            </div>

            {allTopics.length > 0 && (
              <div className="w-full rounded-2xl border border-border bg-card/60 p-5">
                <p className="text-[10px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">Tracking</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTopics.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedPeople.size > 0 && (
              <div className="w-full rounded-2xl border border-border bg-card/60 p-5">
                <p className="text-[10px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">Following</p>
                <p className="text-[13px] text-foreground/70">
                  {PEOPLE.filter(p => selectedPeople.has(p.id)).map(p => p.name).join(', ')}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-2xl bg-foreground text-background text-[15px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Open my feed <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-[11px] text-muted-foreground/40">Change anytime in settings</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
