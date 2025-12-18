import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Paperclip, Palette, MessageSquare, AudioLines, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ProjectsSection } from '@/components/ProjectsSection';

const Home = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/research');
    }
  };

  const isDisabled = !input.trim();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-auto">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 relative z-10">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-medium text-foreground">Strata 1.5</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border">
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

      {/* Main Content - centered vertically */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Promotional Banner */}
        <div className="mb-6">
          <Link 
            to="/gift" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-accent transition-colors"
          >
            <span className="text-lg">🎁</span>
            <span className="text-sm text-foreground">Buy a Strata gift card</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-8">
          Ready to build, User?
        </h1>

        {/* Chat Input Container - wider */}
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col rounded-2xl transition-all relative bg-card py-3 w-full shadow-lg border border-border">
              {/* Textarea */}
              <div className="px-5 pb-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Strata to create a research report..."
                  rows={1}
                  className="flex rounded-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden flex-1 bg-transparent p-0 border-0 focus-visible:ring-0 w-full placeholder:text-muted-foreground text-base shadow-none resize-none leading-[24px] min-h-[24px] text-foreground"
                />
              </div>

              {/* Bottom Controls */}
              <div className="px-4 flex gap-2 items-center justify-between">
                {/* Left buttons */}
                <div className="flex gap-2 items-center">
                  {/* Plus button */}
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  {/* Attach button */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground text-sm"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>Attach</span>
                  </button>

                  {/* Theme button */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground text-sm"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Theme</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Right buttons */}
                <div className="flex gap-2 items-center">
                  {/* Chat button */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>

                  {/* Audio button */}
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <AudioLines className="w-5 h-5" />
                  </button>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 16 16" 
                      fill="none"
                    >
                      <path 
                        d="M7.91699 15.0642C7.53125 15.0642 7.22119 14.9397 6.98682 14.6907C6.75244 14.4465 6.63525 14.1218 6.63525 13.7166V6.39966L6.77441 3.34546L7.48486 3.89478L5.62451 6.12134L3.99121 7.76196C3.87402 7.87915 3.73975 7.97681 3.58838 8.05493C3.44189 8.13306 3.271 8.17212 3.07568 8.17212C2.73389 8.17212 2.4458 8.05981 2.21143 7.83521C1.98193 7.60571 1.86719 7.3103 1.86719 6.94897C1.86719 6.60229 1.99902 6.29712 2.2627 6.03345L6.97949 1.30933C7.0918 1.19214 7.2334 1.10181 7.4043 1.03833C7.5752 0.969971 7.74609 0.935791 7.91699 0.935791C8.08789 0.935791 8.25879 0.969971 8.42969 1.03833C8.60059 1.10181 8.74463 1.19214 8.86182 1.30933L13.5786 6.03345C13.8423 6.29712 13.9741 6.60229 13.9741 6.94897C13.9741 7.3103 13.8569 7.60571 13.6226 7.83521C13.3931 8.05981 13.1074 8.17212 12.7656 8.17212C12.5703 8.17212 12.397 8.13306 12.2456 8.05493C12.0991 7.97681 11.9673 7.87915 11.8501 7.76196L10.2095 6.12134L8.34912 3.89478L9.05957 3.34546L9.19141 6.39966V13.7166C9.19141 14.1218 9.07422 14.4465 8.83984 14.6907C8.60547 14.9397 8.29785 15.0642 7.91699 15.0642Z" 
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Projects Section - at the bottom */}
      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto">
          <ProjectsSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
