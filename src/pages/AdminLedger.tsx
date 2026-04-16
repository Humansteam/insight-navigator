import { useState } from 'react';
import { 
  Home, MousePointer2, FolderOpen, FileText, BarChart3, Settings2,
  Search, Share2, Star, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Area, AreaChart, Cell
} from 'recharts';

// ── Mock data ──
const incomeData = [
  { month: 'Jan', income: 45000, profit: 20000, cogs: 15000, expenses: 10000, line1: 30000, line2: 25000 },
  { month: 'Feb', income: 52000, profit: 28000, cogs: 14000, expenses: 10000, line1: 40000, line2: 32000 },
  { month: 'Mar', income: 78000, profit: 42000, cogs: 20000, expenses: 16000, line1: 55000, line2: 45000 },
  { month: 'Apr', income: 95000, profit: 55000, cogs: 22000, expenses: 18000, line1: 72000, line2: 58000 },
  { month: 'May', income: 88000, profit: 48000, cogs: 23000, expenses: 17000, line1: 78000, line2: 65000 },
  { month: 'Jun', income: 105000, profit: 62000, cogs: 24000, expenses: 19000, line1: 90000, line2: 75000 },
  { month: 'Jul', income: 110000, profit: 68000, cogs: 23000, expenses: 19000, line1: 98000, line2: 82000 },
  { month: 'Aug', income: 115000, profit: 72000, cogs: 24000, expenses: 19000, line1: 108000, line2: 90000 },
  { month: 'Sep', income: 120000, profit: 78000, cogs: 23000, expenses: 19000, line1: 115000, line2: 95000 },
];

const salesForecastData = [
  { month: 'W1', sales: 25, forecast: 30 },
  { month: 'W2', sales: 38, forecast: 35 },
  { month: 'W3', sales: 42, forecast: 40 },
  { month: 'W4', sales: 35, forecast: 38 },
  { month: 'W5', sales: 55, forecast: 50 },
  { month: 'W6', sales: 48, forecast: 52 },
  { month: 'W7', sales: 60, forecast: 55 },
  { month: 'W8', sales: 52, forecast: 58 },
  { month: 'W9', sales: 65, forecast: 60 },
  { month: 'W10', sales: 70, forecast: 65 },
  { month: 'W11', sales: 58, forecast: 62 },
  { month: 'W12', sales: 75, forecast: 70 },
];

const budgetData = [
  { month: 'Jan', sales: 60, forecast: 55 },
  { month: 'Feb', sales: 65, forecast: 62 },
  { month: 'Mar', sales: 72, forecast: 68 },
  { month: 'Apr', sales: 78, forecast: 75 },
  { month: 'May', sales: 82, forecast: 80 },
  { month: 'Jun', sales: 88, forecast: 85 },
  { month: 'Jul', sales: 92, forecast: 90 },
];

const NAV_ICONS = [
  { icon: Home, id: 'home' },
  { icon: MousePointer2, id: 'cursor' },
  { icon: FolderOpen, id: 'folder' },
  { icon: FileText, id: 'file' },
  { icon: BarChart3, id: 'chart' },
  { icon: Settings2, id: 'settings' },
];

// Period tab component
function PeriodTabs({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {['Week', 'Month', 'Quarter', 'Year'].map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'px-3 py-1 rounded-lg transition-all text-sm',
            active === p ? 'font-bold text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// Custom tooltip for main chart
function MainChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const income = payload.find((p: any) => p.dataKey === 'income');
  if (!income) return null;
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 min-w-[200px]">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-black font-['Urbanist']">${Math.round(income.value / 1000)}k</span>
        <span className="text-xs font-medium bg-[#75FB90] text-black px-2 py-0.5 rounded-full">+32%</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">income growth to end the half-year</div>
    </div>
  );
}

// Gauge / semi-circle component
function SemiCircleGauge({ value, max, label1, label2 }: { value: number; max: number; label1: string; label2: string }) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 180;
  
  return (
    <div className="relative w-full flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[180px]">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E5E7"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#000000"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${angle * 2.79} 999`}
        />
      </svg>
      <div className="flex items-center justify-between w-full mt-1 px-2">
        <span className="text-lg font-bold text-black font-['Urbanist']">{label1}</span>
        <span className="text-lg font-bold text-gray-300 font-['Urbanist']">{label2}</span>
      </div>
    </div>
  );
}

export default function AdminLedger() {
  const [activeNav, setActiveNav] = useState('home');
  const [period, setPeriod] = useState('Month');

  return (
    <div className="h-screen flex flex-col bg-[#F5F4F6] font-['Urbanist'] overflow-hidden">
      {/* ═══ TOP BAR ═══ */}
      <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#E5E5E7]">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16L16 4M16 4H8M16 4V12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-base font-bold tracking-tight text-black">Ledgerix</span>
          </div>
        </div>

        {/* Center: Icon nav */}
        <div className="flex items-center gap-0.5 bg-[#F5F4F6] rounded-2xl p-1">
          {NAV_ICONS.map(({ icon: Icon, id }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                activeNav === id ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </div>

        {/* Right: Search, user, share */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Search className="w-4 h-4" />
            <span className="text-sm">Type Client Name or ID...</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/40?img=12" className="w-9 h-9 rounded-full border-2 border-white" alt="" />
              <div className="text-right">
                <div className="text-sm font-semibold text-black leading-tight">Stewart Menzies</div>
                <div className="text-[11px] text-gray-400">Manager</div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              {[3, 5, 8].map(n => (
                <img key={n} src={`https://i.pravatar.cc/32?img=${n}`} className="w-7 h-7 rounded-full" alt="" />
              ))}
            </button>
            <button className="h-9 px-4 bg-black text-white rounded-xl text-sm font-medium flex items-center gap-1.5">
              Share
            </button>
          </div>
          <div className="flex items-center gap-1">
            {[Star, Star].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-xl border border-[#E5E5E7] flex items-center justify-center text-gray-400 hover:text-gray-600">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          
          {/* ── Header row ── */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">Accounting</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Workspaces</span>
                <span>/</span>
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Sales</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-black tracking-tighter font-['Urbanist']" style={{ fontSize: '72px', lineHeight: 1 }}>
                $1,651,045,139
              </div>
              <div className="text-sm text-gray-400 mt-1">Income</div>
            </div>
          </div>

          {/* ── Period tabs ── */}
          <div className="flex justify-end mb-4">
            <PeriodTabs active={period} onChange={setPeriod} />
          </div>

          {/* ── Main chart: Half-year income statement ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Half-Year Income Statement</div>
                <div className="flex items-center gap-5 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-black" /> Income</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-gray-400" /> New Profit</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-gray-300" /> COGS</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-gray-200" /> Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[280px] bg-white rounded-2xl border border-[#E5E5E7] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={incomeData} barCategoryGap="20%">
                  <CartesianGrid stroke="#F0F0F0" strokeDasharray="none" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 12, fontFamily: 'Urbanist' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 11, fontFamily: 'Urbanist' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                  <Tooltip content={<MainChartTooltip />} cursor={false} />
                  <Bar dataKey="income" radius={[2, 2, 0, 0]} maxBarSize={8}>
                    {incomeData.map((_, i) => (
                      <Cell key={i} fill={i < 5 ? '#D4D4D4' : '#1A1A1A'} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="line1" stroke="#000000" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="line2" stroke="#A0A0A0" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Bottom cards row ── */}
          <div className="grid grid-cols-4 gap-5">
            
            {/* Card 1: Sales Forecast */}
            <div className="bg-white rounded-2xl border border-[#E5E5E7] p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Sales Forecast</div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Sales</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black" /> Forecast</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-black tracking-tight">$141,7k</div>
              <div className="text-xs text-gray-400 mb-3">Sales</div>
              <PeriodTabs active={period} onChange={setPeriod} />
              <div className="h-[100px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesForecastData} barCategoryGap="15%">
                    <Bar dataKey="sales" radius={[2, 2, 0, 0]} maxBarSize={6}>
                      {salesForecastData.map((_, i) => (
                        <Cell key={i} fill={i % 2 === 0 ? '#D4D4D4' : '#1A1A1A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Monthly Expenses */}
            <div className="bg-white rounded-2xl border border-[#E5E5E7] p-5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Monthly Expenses</div>
              <div className="text-3xl font-bold text-black tracking-tight">$17,2k</div>
              <div className="text-xs text-gray-400 mb-4">Expenses</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-black" /> Meals</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#75FB90]" /> Rent & Mortgage</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400" /> Automotive</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-200" /> Others</span>
              </div>
              {/* Simple bar visualization */}
              <div className="flex gap-1 mt-4">
                {[40, 25, 20, 15].map((w, i) => (
                  <div key={i} className="h-3 rounded-full" style={{ width: `${w}%`, backgroundColor: ['#1A1A1A', '#75FB90', '#A0A0A0', '#E0E0E0'][i] }} />
                ))}
              </div>
            </div>

            {/* Card 3: Project Budget Forecast */}
            <div className="bg-white rounded-2xl border border-[#E5E5E7] p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Project Budget Forecast</div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Sales</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-black" /> Forecast</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-black tracking-tight">$92,1k</div>
              <div className="text-xs text-gray-400 mb-3">Budged forecast</div>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetData}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E0E0E0" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#E0E0E0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="sales" stroke="#A0A0A0" strokeWidth={1.5} fill="url(#salesGrad)" dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#000000" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 4: Insight */}
            <div className="bg-white rounded-2xl border border-[#E5E5E7] p-5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Insight</div>
              <p className="text-sm text-black leading-relaxed">
                The new feedback form <strong className="font-bold">boosted</strong> requests and sales
              </p>
              <div className="mt-4">
                <SemiCircleGauge value={62} max={100} label1="$57,6k" label2="$93,5k" />
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-1">Website update boosted sales</div>
            </div>
          </div>

          {/* ── Floating search bar ── */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-[#2A2A2A] rounded-2xl flex items-center gap-2 px-3 py-2 shadow-2xl min-w-[600px]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#75FB90] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="4" height="4" rx="1" fill="black"/><rect x="9" y="3" width="4" height="4" rx="1" fill="black"/><rect x="3" y="9" width="4" height="4" rx="1" fill="black"/><rect x="9" y="9" width="4" height="4" rx="1" fill="black"/></svg>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-[#3A3A3A] rounded-lg px-3 py-1.5 border border-gray-600/30">What is our gross margin %?</span>
                  <span className="text-xs text-gray-400 bg-[#3A3A3A] rounded-lg px-3 py-1.5 border border-gray-600/30">Why did gross margin change during the period?</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Ask anything or search" 
                  className="bg-transparent text-white text-sm placeholder:text-gray-500 outline-none w-48"
                />
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg bg-[#3A3A3A] flex items-center justify-center text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="8" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
