import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Cable, Mic, X, FileText, LayoutGrid, Smartphone, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ProjectsSection } from '@/components/ProjectsSection';

const Home = () => {
  const [input, setInput] = useState('');
  const [showIntegrations, setShowIntegrations] = useState(true);
  const navigate = useNavigate();

  const isTyping = input.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/research');
    }
  };

  const isDisabled = !input.trim();

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-medium text-foreground">Strata 1.5</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-black/8 dark:border-white/10">
            <span className="text-sm font-medium text-foreground">✦ 1,091</span>
          </div>
          <ThemeSwitcher />
          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden cursor-pointer">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=strata"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 min-h-[calc(100vh-56px)]">
        <motion.div 
          className="flex-1 flex flex-col items-center"
          animate={{
            justifyContent: isTyping ? 'flex-start' : 'center',
            paddingTop: isTyping ? '2rem' : '0'
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Title - fades out when typing */}
          <AnimatePresence>
            {!isTyping && (
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-800 dark:text-foreground text-center mb-8 tracking-[-0.02em]"
              >
                Let's dive into your knowledge
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Article Area - appears when typing */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-3xl mb-6"
              >
                <div className="bg-white dark:bg-card rounded-2xl border border-black/8 dark:border-border p-6 shadow-sm">
                  <div className="space-y-4">
                    {/* Article Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Searching...</h3>
                        <p className="text-sm text-muted-foreground">Looking through your knowledge base</p>
                      </div>
                    </div>
                    
                    {/* Loading skeleton */}
                    <div className="space-y-3">
                      <motion.div 
                        className="h-4 bg-muted rounded-md"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: '90%' }}
                      />
                      <motion.div 
                        className="h-4 bg-muted rounded-md"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        style={{ width: '75%' }}
                      />
                      <motion.div 
                        className="h-4 bg-muted rounded-md"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        style={{ width: '85%' }}
                      />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 pt-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">AI Analysis</span>
                      <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">Knowledge Base</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input Container */}
          <motion.div 
            className="w-full max-w-3xl flex flex-col isolate items-center"
            layout
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Main Input Box */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-3 rounded-2xl transition-all relative bg-white dark:bg-card py-4 w-full z-[2] shadow-lg border border-black/8 dark:border-border">
                {/* Textarea */}
                <div className="overflow-y-auto px-5">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Assign a task or ask anything"
                    rows={1}
                    className="flex rounded-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden flex-1 bg-transparent p-0 border-0 focus-visible:ring-0 w-full placeholder:text-slate-400 dark:placeholder:text-muted-foreground text-base shadow-none resize-none leading-[24px] min-h-[28px] text-slate-800 dark:text-foreground"
                  />
                </div>

                {/* Bottom Controls */}
                <div className="px-3 flex gap-2 items-center">
                  {/* Left buttons */}
                  <div className="flex gap-2 items-center flex-shrink-0">
                    {/* Plus button */}
                    <button
                      type="button"
                      className="rounded-full border border-black/10 dark:border-border inline-flex items-center justify-center gap-1 cursor-pointer text-xs text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 w-8 h-8 p-0 shrink-0 transition-colors"
                    >
                      <Plus className="w-[18px] h-[18px]" strokeWidth={2} />
                    </button>

                    {/* Cable/Connector button */}
                    <button
                      type="button"
                      className="flex items-center gap-1 p-2 pl-2 cursor-pointer rounded-full border border-black/10 dark:border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Cable className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Right buttons */}
                  <div className="min-w-0 flex gap-2 ml-auto flex-shrink items-center">
                    <div className="flex items-center gap-2">
                      {/* Mic button */}
                      <button
                        type="button"
                        className="flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 w-8 h-8 flex-shrink-0 rounded-full transition-colors"
                      >
                        <Mic className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isDisabled}
                        className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors bg-foreground text-background gap-[6px] text-sm rounded-full p-0 w-8 h-8 min-w-0 disabled:bg-black/5 dark:disabled:bg-white/5 disabled:cursor-not-allowed"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="15" 
                          height="15" 
                          viewBox="0 0 16 16" 
                          fill="none"
                        >
                          <path 
                            d="M7.91699 15.0642C7.53125 15.0642 7.22119 14.9397 6.98682 14.6907C6.75244 14.4465 6.63525 14.1218 6.63525 13.7166V6.39966L6.77441 3.34546L7.48486 3.89478L5.62451 6.12134L3.99121 7.76196C3.87402 7.87915 3.73975 7.97681 3.58838 8.05493C3.44189 8.13306 3.271 8.17212 3.07568 8.17212C2.73389 8.17212 2.4458 8.05981 2.21143 7.83521C1.98193 7.60571 1.86719 7.3103 1.86719 6.94897C1.86719 6.60229 1.99902 6.29712 2.2627 6.03345L6.97949 1.30933C7.0918 1.19214 7.2334 1.10181 7.4043 1.03833C7.5752 0.969971 7.74609 0.935791 7.91699 0.935791C8.08789 0.935791 8.25879 0.969971 8.42969 1.03833C8.60059 1.10181 8.74463 1.19214 8.86182 1.30933L13.5786 6.03345C13.8423 6.29712 13.9741 6.60229 13.9741 6.94897C13.9741 7.3103 13.8569 7.60571 13.6226 7.83521C13.3931 8.05981 13.1074 8.17212 12.7656 8.17212C12.5703 8.17212 12.397 8.13306 12.2456 8.05493C12.0991 7.97681 11.9673 7.87915 11.8501 7.76196L10.2095 6.12134L8.34912 3.89478L9.05957 3.34546L9.19141 6.39966V13.7166C9.19141 14.1218 9.07422 14.4465 8.83984 14.6907C8.60547 14.9397 8.29785 15.0642 7.91699 15.0642Z" 
                            fill={isDisabled ? "currentColor" : "currentColor"}
                            className={isDisabled ? "text-muted-foreground" : "text-background"}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Integrations Bar - hidden when typing */}
            <AnimatePresence>
              {showIntegrations && !isTyping && (
                <motion.div 
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[rgba(55,53,47,0.02)] dark:bg-white/[0.02] hover:bg-[rgba(240,239,237,1)] dark:hover:bg-white/[0.02] border-x border-b border-black/5 dark:border-border rounded-b-[22px] flex items-center gap-2 pb-[7px] ps-5 pe-3 pt-[29px] -mt-[22px] transition-colors cursor-pointer w-full z-[1]"
                >
                  <div className="flex items-center gap-[6px]">
                    <Cable className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  </div>
                  <span className="text-[13px] leading-[18px] text-muted-foreground tracking-[-0.091px]">
                    Connect your tools to Strata
                  </span>
                  <div className="flex-1 flex items-center justify-end gap-3">
                    {/* Integration icons placeholder */}
                    <div className="flex items-center gap-1 opacity-60">
                      <span className="text-xs">🌐</span>
                      <span className="text-xs">📧</span>
                      <span className="text-xs">📊</span>
                      <span className="text-xs">🎨</span>
                      <span className="text-xs">🔗</span>
                      <span className="text-xs">🐙</span>
                      <span className="text-xs">📱</span>
                    </div>
                    <button
                      onClick={() => setShowIntegrations(false)}
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons - hidden when typing */}
            <AnimatePresence>
              {!isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 flex items-center justify-center gap-3"
                >
                  <Link
                    to="/documents"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 dark:border-border bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-accent transition-colors"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Documents</span>
                  </Link>
                  <Link
                    to="/research"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 dark:border-border bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-accent transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Research</span>
                  </Link>
                  <Link
                    to="/agent"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 dark:border-border bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-accent transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Agent Mode</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

      </main>

      {/* Projects Section - fixed dock at bottom */}
      <AnimatePresence>
        {!isTyping && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 px-4 md:px-8 lg:px-16 pb-4"
          >
            <div className="mx-auto max-w-7xl pointer-events-auto">
              <div className="max-h-[38vh]">
                <ProjectsSection variant="dock" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
