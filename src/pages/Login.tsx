import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

/* ── Animated strata layers (right panel) ── */
const StrataLayers = () => {
  const layers = [
    { color: 'hsl(200, 80%, 55%)', y: '62%', delay: 0, amplitude: 12 },
    { color: 'hsl(185, 70%, 45%)', y: '68%', delay: 0.5, amplitude: 18 },
    { color: 'hsl(220, 60%, 40%)', y: '74%', delay: 1, amplitude: 14 },
    { color: 'hsl(260, 50%, 35%)', y: '80%', delay: 1.5, amplitude: 20 },
    { color: 'hsl(280, 45%, 28%)', y: '86%', delay: 2, amplitude: 16 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
    >
      <defs>
        {layers.map((_, i) => (
          <linearGradient key={`grad-${i}`} id={`strata-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={layers[i].color} stopOpacity="0.7" />
            <stop offset="50%" stopColor={layers[i].color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={layers[i].color} stopOpacity="0.6" />
          </linearGradient>
        ))}
      </defs>

      {layers.map((layer, i) => {
        const yVal = parseFloat(layer.y) / 100 * 600;
        return (
          <motion.path
            key={i}
            d={`M0,${yVal} C200,${yVal - layer.amplitude} 400,${yVal + layer.amplitude} 600,${yVal - layer.amplitude / 2} L800,${yVal + 5} L800,600 L0,600 Z`}
            fill={`url(#strata-grad-${i})`}
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              d: [
                `M0,${yVal} C200,${yVal - layer.amplitude} 400,${yVal + layer.amplitude} 600,${yVal - layer.amplitude / 2} L800,${yVal + 5} L800,600 L0,600 Z`,
                `M0,${yVal + 8} C200,${yVal + layer.amplitude * 0.7} 400,${yVal - layer.amplitude * 0.8} 600,${yVal + layer.amplitude * 0.5} L800,${yVal - 3} L800,600 L0,600 Z`,
                `M0,${yVal} C200,${yVal - layer.amplitude} 400,${yVal + layer.amplitude} 600,${yVal - layer.amplitude / 2} L800,${yVal + 5} L800,600 L0,600 Z`,
              ],
            }}
            transition={{
              opacity: { duration: 0.8, delay: layer.delay * 0.3 },
              y: { duration: 0.8, delay: layer.delay * 0.3 },
              d: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: layer.delay },
            }}
          />
        );
      })}
    </svg>
  );
};

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
      {/* ── Left Panel ── */}
      <div className="w-full md:w-[45%] flex flex-col justify-center items-center px-8 lg:px-16 py-12 bg-background">
        <motion.div
          className="w-full max-w-[400px] space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Heading */}
          <div className="space-y-1.5 mb-2">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Start analyzing your documents with AI' : 'Sign in to continue'}
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-3 text-sm font-medium rounded-lg"
              onClick={() => console.log('Google OAuth')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-3 text-sm font-medium rounded-lg"
              onClick={() => console.log('GitHub OAuth')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-background px-3 text-muted-foreground/50 tracking-widest">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-sm font-semibold rounded-lg mt-1">
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
      </div>

      {/* ── Right Panel — Strata Layers ── */}
      <div className="hidden md:flex w-[55%] relative overflow-hidden">
        {/* Base dark sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,8%)] via-[hsl(230,40%,12%)] to-[hsl(240,35%,18%)]" />

        {/* Stars / dots */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(0 0% 100%) 0.5px, transparent 0.5px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Animated strata wave layers */}
        <StrataLayers />

        {/* Top ambient glow */}
        <motion.div
          className="absolute w-[500px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, hsl(200 80% 60% / 0.08), transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '5%', left: '20%' }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10">
          {/* Branding */}
          <motion.div
            className="flex flex-col items-center gap-3 mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="text-4xl font-bold text-white tracking-tight">Strata</span>
            <p className="text-white/35 text-xs tracking-[0.25em] uppercase">
              See What Others Miss
            </p>
          </motion.div>

          {/* Chat mock */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/30">
              <span className="flex-1 text-white/35 text-sm">
                Ask Strata to analyze your documents...
              </span>
              <div className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <ArrowUp className="w-4 h-4 text-white/40" />
              </div>
            </div>

            <motion.div
              className="flex flex-wrap gap-2 mt-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {['Market analysis', 'Financial report', 'Risk assessment'].map((chip, i) => (
                <motion.span
                  key={chip}
                  className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/30 text-xs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
