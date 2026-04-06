import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Plus, User, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ── Data ──────────────────────────────────────────────

const TOPICS = [
  { label: 'AI / ML', emoji: '🤖' },
  { label: 'RAG & Search', emoji: '🔍' },
  { label: 'LLM Agents', emoji: '🧠' },
  { label: 'Startups', emoji: '🚀' },
  { label: 'VC & Fundraising', emoji: '💰' },
  { label: 'Product Management', emoji: '📦' },
  { label: 'Data Engineering', emoji: '⚙️' },
  { label: 'Deep Tech', emoji: '🔬' },
  { label: 'SaaS / B2B', emoji: '🏢' },
  { label: 'Fintech', emoji: '🏦' },
  { label: 'Healthcare', emoji: '🏥' },
  { label: 'Cybersecurity', emoji: '🔒' },
  { label: 'DevTools', emoji: '🛠' },
  { label: 'Open Source', emoji: '🌐' },
  { label: 'Robotics', emoji: '🦾' },
  { label: 'Climate Tech', emoji: '🌱' },
];

const AUTHORITIES = [
  { name: 'Andrej Karpathy', domain: 'AI' },
  { name: 'Paul Graham', domain: 'Startups' },
  { name: 'Andrew Huberman', domain: 'Science' },
  { name: 'Lenny Rachitsky', domain: 'Product' },
  { name: 'Lex Fridman', domain: 'Tech' },
  { name: 'Yann LeCun', domain: 'AI' },
  { name: 'Naval Ravikant', domain: 'Investing' },
  { name: 'Sam Altman', domain: 'AI / Startups' },
  { name: 'Balaji Srinivasan', domain: 'Tech / Crypto' },
  { name: 'Elad Gil', domain: 'Startups' },
  { name: 'Patrick Collison', domain: 'Tech' },
  { name: 'Demis Hassabis', domain: 'AI' },
];

// ── Types ─────────────────────────────────────────────

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  widget?: 'step1' | 'step2' | 'step3' | 'summary';
}

interface OnboardingData {
  context: string;
  topics: string[];
  authorities: string[];
}

// ── Typing indicator ──────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ── Summary card ──────────────────────────────────────

function SummaryCard({ icon: Icon, title, items }: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [data, setData] = useState<OnboardingData>({ context: '', topics: [], authorities: [] });

  // Step inputs
  const [contextInput, setContextInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, step]);

  // Initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your Strata analyst. Let's set things up so I can find what matters to you.\n\nWhat do you do? Describe in a couple of sentences.",
        widget: 'step1',
      }]);
      setIsTyping(false);
      setStep(1);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const addAssistantMessage = useCallback((content: string, widget?: Message['widget']) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        widget,
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, []);

  // ── Handlers ──

  const handleStep1Submit = () => {
    if (!contextInput.trim()) return;
    const text = contextInput.trim();
    setData((d) => ({ ...d, context: text }));
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setStep(2);
    addAssistantMessage(
      "Got it! Now let's pick topics you want to track. I've highlighted a few that might be relevant based on what you said.",
      'step2'
    );
  };

  const handleStep2Submit = () => {
    if (selectedTopics.length < 2) return;
    const topicsList = selectedTopics.join(', ');
    setData((d) => ({ ...d, topics: selectedTopics }));
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: topicsList }]);
    setStep(3);
    addAssistantMessage(
      "Great choices! Last step — whose thinking do you trust? This helps me prioritize sources. You can skip this if you'd like.",
      'step3'
    );
  };

  const handleStep3Submit = (skip = false) => {
    const authorities = skip ? [] : selectedAuthorities;
    setData((d) => ({ ...d, authorities }));
    if (!skip && authorities.length > 0) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: authorities.join(', '),
      }]);
    } else {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: 'Skipped',
      }]);
    }
    setStep(4);
    addAssistantMessage("All set! Here's your profile summary:", 'summary');
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const t = customTopic.trim();
    if (t && !selectedTopics.includes(t)) {
      setSelectedTopics((prev) => [...prev, t]);
      setCustomTopic('');
    }
  };

  const toggleAuthority = (name: string) => {
    setSelectedAuthorities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Suggested topics based on context (mock)
  const suggestedTopics = (() => {
    const lower = data.context.toLowerCase();
    const suggestions: string[] = [];
    if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine')) suggestions.push('AI / ML', 'LLM Agents');
    if (lower.includes('vc') || lower.includes('fund') || lower.includes('invest')) suggestions.push('VC & Fundraising', 'Startups');
    if (lower.includes('product')) suggestions.push('Product Management', 'SaaS / B2B');
    if (lower.includes('data')) suggestions.push('Data Engineering');
    if (lower.includes('deep') || lower.includes('tech')) suggestions.push('Deep Tech');
    return suggestions.length > 0 ? suggestions : ['AI / ML', 'Startups', 'Product Management'];
  })();

  // ── Render ──

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header with gradient orb */}
      <div className="relative w-full flex flex-col items-center pt-12 pb-6">
        {/* Gradient orb */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20 -top-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            S
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Strata</h1>
          <p className="text-muted-foreground text-sm">Your personal analyst. Let's set things up.</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                step >= s ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 w-full max-w-lg px-4 pb-8 overflow-y-auto space-y-4"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' ? (
                <div className="max-w-[90%] space-y-3">
                  {/* AI bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>

                  {/* Widgets */}
                  {msg.widget === 'step1' && step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="ml-9 space-y-3"
                    >
                      <Textarea
                        placeholder='Example: "Building an AI product for analysts" or "Working at a VC fund, looking at deeptech"'
                        value={contextInput}
                        onChange={(e) => setContextInput(e.target.value)}
                        className="min-h-[80px] text-sm bg-background resize-none"
                        rows={3}
                      />
                      <Button
                        onClick={handleStep1Submit}
                        disabled={!contextInput.trim()}
                        className="gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  {msg.widget === 'step2' && step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="ml-9 space-y-3"
                    >
                      {/* Suggested hint */}
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Suggested based on your profile
                      </p>

                      {/* Topic chips */}
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((topic) => {
                          const isSuggested = suggestedTopics.includes(topic.label);
                          const isSelected = selectedTopics.includes(topic.label);
                          return (
                            <button
                              key={topic.label}
                              onClick={() => toggleTopic(topic.label)}
                              className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : isSuggested
                                    ? 'bg-primary/5 text-primary border-primary/30 border-dashed'
                                    : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                              )}
                            >
                              {topic.emoji} {topic.label}
                            </button>
                          );
                        })}

                        {/* Custom topics */}
                        {selectedTopics.filter((t) => !TOPICS.find((tt) => tt.label === t)).map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleTopic(t)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground border border-primary"
                          >
                            ✦ {t}
                          </button>
                        ))}
                      </div>

                      {/* Custom topic input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add your own topic..."
                          value={customTopic}
                          onChange={(e) => setCustomTopic(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
                          className="text-sm h-9 bg-background"
                        />
                        <Button size="sm" variant="outline" onClick={addCustomTopic} disabled={!customTopic.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={handleStep2Submit}
                        disabled={selectedTopics.length < 2}
                        className="gap-2"
                      >
                        Continue ({selectedTopics.length} selected) <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  {msg.widget === 'step3' && step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="ml-9 space-y-3"
                    >
                      <div className="flex flex-wrap gap-2">
                        {AUTHORITIES.map((auth) => {
                          const isSelected = selectedAuthorities.includes(auth.name);
                          return (
                            <button
                              key={auth.name}
                              onClick={() => toggleAuthority(auth.name)}
                              className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border flex items-center gap-1.5',
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                              )}
                            >
                              {auth.name}
                              <span className={cn(
                                'text-[10px]',
                                isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
                              )}>
                                · {auth.domain}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleStep3Submit(false)} disabled={selectedAuthorities.length === 0} className="gap-2">
                          Complete setup <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => handleStep3Submit(true)} className="text-muted-foreground">
                          Skip this step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {msg.widget === 'summary' && step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="ml-9 space-y-3"
                    >
                      <SummaryCard icon={User} title="You" items={[data.context]} />
                      <SummaryCard icon={BookOpen} title="Tracking" items={data.topics} />
                      {data.authorities.length > 0 && (
                        <SummaryCard icon={Users} title="Voices" items={data.authorities} />
                      )}

                      <Button onClick={() => navigate('/')} className="gap-2 w-full mt-2">
                        Go to your feed <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2.5"
          >
            <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-3 py-2">
              <TypingDots />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
