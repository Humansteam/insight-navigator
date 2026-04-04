import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth:', { email, password, mode: isSignUp ? 'signup' : 'login' });
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Auth Form */}
      <div className="w-full md:w-[45%] flex flex-col justify-center items-center px-8 lg:px-16 py-12 bg-background relative">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <motion.div
          className="w-full max-w-[420px] space-y-7 relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Get started with Strata in seconds' : 'Sign in to continue to Strata'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full h-12 justify-center gap-3 text-sm font-medium rounded-xl border-border/60 hover:bg-accent/50 transition-all"
              onClick={() => console.log('Google OAuth')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-center gap-3 text-sm font-medium rounded-xl border-border/60 hover:bg-accent/50 transition-all"
              onClick={() => console.log('GitHub OAuth')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground/60 tracking-wider text-[11px]">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 bg-accent/30 focus:bg-background transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-border/60 bg-accent/30 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-sm font-semibold rounded-xl mt-2">
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <p className="text-[11px] text-muted-foreground/40">© 2026 Strata · Privacy · Terms</p>
        </div>
      </div>

      {/* Right Panel — Visual / Brand */}
      <div className="hidden md:flex w-[55%] relative overflow-hidden">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-[hsl(230,45%,6%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(230,40%,10%)] via-[hsl(255,45%,12%)] to-[hsl(280,50%,8%)]" />
        
        {/* Large animated glow orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 60%)' }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '-10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(280 60% 40% / 0.12), transparent 60%)' }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ bottom: '-5%', right: '5%' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(200 80% 50% / 0.08), transparent 60%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '40%', right: '30%' }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10">
          {/* Strata branding */}
          <motion.div
            className="flex flex-col items-center gap-5 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-primary/70" />
              <span className="text-4xl font-bold text-white tracking-tight">Strata</span>
            </motion.div>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-medium">
                See What Others Miss
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </motion.div>

          {/* Chat input mock */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="relative group">
              {/* Glow behind input */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative flex items-center gap-3 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-2xl px-5 py-4 shadow-2xl shadow-black/20">
                <span className="flex-1 text-white/35 text-sm">
                  Ask Strata to analyze your documents...
                </span>
                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-primary/70" />
                </div>
              </div>
            </div>

            {/* Example chips */}
            <motion.div
              className="flex flex-wrap gap-2 mt-5 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {['Market analysis', 'Financial report', 'Competitive landscape', 'Risk assessment'].map((chip, i) => (
                <motion.span
                  key={chip}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/30 text-xs hover:bg-white/[0.08] hover:text-white/50 cursor-default transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(230,45%,4%)] to-transparent" />
      </div>
    </div>
  );
};

export default Login;
