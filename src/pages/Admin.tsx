import { useState, createContext, useContext } from 'react';
import { useTheme } from 'next-themes';
import { 
  BarChart3, Layers, FolderTree, Radio, User, Quote, Users, 
  Activity, Settings, ChevronLeft, ChevronRight, Search, ExternalLink,
  Check, X, ChevronDown, ChevronUp, CreditCard, Bell, Truck, BarChart2, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  mockFeedCards, mockClusters, mockRSSSources, mockPersons, mockQuotes, 
  mockUsers, mockPipelineRuns, mockUserEvents, mockCategories, mockSettings,
  type FeedCard, type EventCluster, type RSSSource, type Person, type Quote as QuoteType,
  type UserProfile, type PipelineRun, type UserEvent, type CategoryTree
} from '@/components/admin/mockData';

// ── Types ──
type SystemSection = 'categories' | 'sources' | 'persons' | 'quotes' | 'clusters' | 'runs' | 'settings' | 'users';
type UserTab = 'profile' | 'subscriptions' | 'feed' | 'events' | 'stats' | 'delivery';
type ActiveView = 
  | { kind: 'dashboard' }
  | { kind: 'system'; section: SystemSection }
  | { kind: 'user'; userId: string; tab: UserTab };

const SYSTEM_ITEMS: { id: SystemSection; label: string; icon: React.ElementType }[] = [
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'sources', label: 'RSS Sources', icon: Radio },
  { id: 'persons', label: 'Persons', icon: User },
  { id: 'quotes', label: 'Quotes', icon: Quote },
  { id: 'clusters', label: 'Event Clusters', icon: Layers },
  { id: 'runs', label: 'Pipeline Runs', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'users', label: 'Users', icon: Users },
];

const USER_TABS: { id: UserTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'subscriptions', label: 'Subscriptions', icon: Check },
  { id: 'feed', label: 'Feed', icon: CreditCard },
  { id: 'events', label: 'Events', icon: Bell },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
  { id: 'delivery', label: 'Delivery', icon: Truck },
];

// ── Design tokens (dark) ──
const glassDark = {
  card: 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl',
  cardHover: 'hover:bg-white/[0.07] transition-all duration-200',
  panel: 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl',
  surface: 'bg-white/[0.02]',
  tableHeader: 'bg-white/[0.04]',
  tableRow: 'border-b border-white/[0.04] hover:bg-white/[0.06] transition-colors duration-150',
  separator: 'border-white/[0.06]',
  input: 'bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/30 focus:border-white/[0.2] focus:ring-0',
  button: 'bg-white/[0.06] border-white/[0.1] text-white/70 hover:bg-white/[0.1] hover:text-white',
  buttonActive: 'bg-white/[0.15] border-white/[0.2] text-white',
};
const textDark = {
  primary: 'text-white',
  secondary: 'text-[#94A3B8]',
  muted: 'text-white/40',
  heading: 'text-white font-semibold tracking-tight',
};

// ── Design tokens (ledger) ──
const glassLight = {
  card: 'bg-white border border-[#D3D2D4] rounded-2xl',
  cardHover: 'hover:bg-gray-50 transition-all duration-200',
  panel: 'bg-white border border-[#D3D2D4] rounded-2xl',
  surface: 'bg-[#F0EFF2]',
  tableHeader: 'bg-[#F7F7F8]',
  tableRow: 'border-b border-[#E5E5E7] hover:bg-[#FAFAFA] transition-colors duration-150',
  separator: 'border-[#D3D2D4]',
  input: 'bg-white border-[#D3D2D4] text-black placeholder:text-gray-400 focus:border-[#75FB90] focus:ring-0',
  button: 'bg-[#F0EFF2] border-[#D3D2D4] text-gray-600 hover:bg-[#E5E5E7] hover:text-black',
  buttonActive: 'bg-[#75FB90]/20 border-[#75FB90]/40 text-black font-medium',
};
const textLight = {
  primary: 'text-black',
  secondary: 'text-gray-500',
  muted: 'text-gray-400',
  heading: 'text-black font-semibold tracking-tight',
};

// ── Badge colors (dark) ──
const slotColorDark: Record<string, string> = { now: 'bg-cyan-800/50 text-cyan-300 border-cyan-600/30', deep: 'bg-violet-800/50 text-violet-300 border-violet-600/30', bridge: 'bg-amber-800/50 text-amber-300 border-amber-600/30', challenge: 'bg-rose-800/50 text-rose-300 border-rose-600/30' };
const tierColorDark: Record<number, string> = { 1: 'bg-amber-900/40 text-amber-300 border-amber-600/30', 2: 'bg-slate-700/40 text-slate-300 border-slate-500/30', 3: 'bg-orange-900/40 text-orange-300 border-orange-600/30' };
const statusColorDark: Record<string, string> = { success: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30', partial: 'bg-amber-900/40 text-amber-300 border-amber-600/30', failed: 'bg-rose-900/40 text-rose-300 border-rose-600/30', running: 'bg-cyan-900/40 text-cyan-300 border-cyan-600/30', open: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30', archived: 'bg-white/[0.06] text-white/40 border-white/[0.08]', active: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30', stale: 'bg-rose-900/40 text-rose-300 border-rose-600/30' };
const actionColorDark: Record<string, string> = { read: 'bg-cyan-900/40 text-cyan-300 border-cyan-600/30', save: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30', skip: 'bg-white/[0.06] text-white/40 border-white/[0.08]', deep_dive: 'bg-violet-900/40 text-violet-300 border-violet-600/30', dismiss: 'bg-rose-900/40 text-rose-300 border-rose-600/30' };
const groupColorDark: Record<string, string> = { research: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/20', tech: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/20', news: 'bg-amber-500/20 text-amber-300 border-amber-400/20', blogs: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/20', business: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20' };

// ── Badge colors (ledger) ──
const slotColorLight: Record<string, string> = { now: 'bg-cyan-50 text-cyan-700 border-cyan-200', deep: 'bg-violet-50 text-violet-700 border-violet-200', bridge: 'bg-amber-50 text-amber-700 border-amber-200', challenge: 'bg-rose-50 text-rose-700 border-rose-200' };
const tierColorLight: Record<number, string> = { 1: 'bg-amber-50 text-amber-700 border-amber-200', 2: 'bg-slate-100 text-slate-600 border-slate-200', 3: 'bg-orange-50 text-orange-700 border-orange-200' };
const statusColorLight: Record<string, string> = { success: 'bg-emerald-50 text-emerald-700 border-emerald-200', partial: 'bg-amber-50 text-amber-700 border-amber-200', failed: 'bg-rose-50 text-rose-700 border-rose-200', running: 'bg-cyan-50 text-cyan-700 border-cyan-200', open: 'bg-emerald-50 text-emerald-700 border-emerald-200', archived: 'bg-gray-100 text-gray-500 border-gray-200', active: 'bg-emerald-50 text-emerald-700 border-emerald-200', stale: 'bg-rose-50 text-rose-700 border-rose-200' };
const actionColorLight: Record<string, string> = { read: 'bg-cyan-50 text-cyan-700 border-cyan-200', save: 'bg-emerald-50 text-emerald-700 border-emerald-200', skip: 'bg-gray-100 text-gray-500 border-gray-200', deep_dive: 'bg-violet-50 text-violet-700 border-violet-200', dismiss: 'bg-rose-50 text-rose-700 border-rose-200' };
const groupColorLight: Record<string, string> = { research: 'bg-indigo-50 text-indigo-700 border-indigo-200', tech: 'bg-cyan-50 text-cyan-700 border-cyan-200', news: 'bg-amber-50 text-amber-700 border-amber-200', blogs: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', business: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

// ── Token context ──
type TokenSet = {
  isLedger: boolean;
  glass: typeof glassDark;
  text: typeof textDark;
  slotColor: Record<string, string>;
  tierColor: Record<number, string>;
  statusColor: Record<string, string>;
  actionColor: Record<string, string>;
  groupColor: Record<string, string>;
};

const TokensCtx = createContext<TokenSet>({
  isLedger: false, glass: glassDark, text: textDark,
  slotColor: slotColorDark, tierColor: tierColorDark, statusColor: statusColorDark,
  actionColor: actionColorDark, groupColor: groupColorDark,
});
const useT = () => useContext(TokensCtx);

// ── Helpers ──
function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

// ── Shared ──
function DetailPanel({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  const { glass, text, isLedger } = useT();
  return (
    <div className={cn('w-[420px] flex flex-col shrink-0 border-l', glass.separator)} style={{ background: isLedger ? '#FFFFFF' : 'rgba(15, 23, 42, 0.95)', backdropFilter: isLedger ? undefined : 'blur(20px)' }}>
      <div className={cn('h-14 flex items-center justify-between px-5 border-b', glass.separator)}>
        <span className={cn('text-sm font-medium', text.primary)}>{title}</span>
        <button className={cn('h-7 w-7 rounded-lg flex items-center justify-center transition-colors', isLedger ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/[0.06] hover:bg-white/[0.1]')} onClick={onClose}><X className={cn('h-4 w-4', isLedger ? 'text-gray-500' : 'text-white/60')} /></button>
      </div>
      <ScrollArea className="flex-1"><div className="p-5 space-y-5 text-sm">{children}</div></ScrollArea>
    </div>
  );
}

function KPICard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  const { glass, text } = useT();
  return (
    <div className={cn(glass.card, 'p-5')}>
      <div className={cn('text-xs uppercase tracking-wider mb-2', text.muted)}>{label}</div>
      <div className={cn('text-3xl font-bold tracking-tight', text.primary)}>{value}</div>
      {sub && <div className={cn('text-xs mt-2', text.secondary)}>{sub}</div>}
    </div>
  );
}

function GlassTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  const { glass, text } = useT();
  return (
    <div className={cn(glass.panel, 'overflow-hidden')}>
      <table className="w-full text-sm">
        <thead>
          <tr className={glass.tableHeader}>
            {headers.map(h => (
              <th key={h} className={cn('text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider', text.muted)}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function DashboardSection() {
  const { glass, text, slotColor, statusColor } = useT();
  const cardsToday = mockFeedCards.filter(c => Date.now() - new Date(c.created_at).getTime() < 86400000).length;
  const activeClusters = mockClusters.filter(c => c.status === 'open').length;
  const activeRSS = mockRSSSources.filter(s => s.status === 'active').length;
  const lastRun = mockPipelineRuns[0];
  const quoteHitRate = lastRun ? Math.round((lastRun.metrics.quotes_attached / lastRun.metrics.cards_saved) * 100) : 0;

  return (
    <div className="space-y-8">
      <h2 className={cn('text-xl', text.heading)}>Dashboard</h2>
      <div className="grid grid-cols-4 gap-5">
        <KPICard label="Cards Today" value={cardsToday} sub="last 24h" />
        <KPICard label="Active Clusters" value={activeClusters} />
        <KPICard label="RSS Health" value={`${activeRSS}/${mockRSSSources.length}`} sub="active feeds" />
        <KPICard label="Quote Hit Rate" value={`${quoteHitRate}%`} sub="last pipeline run" />
      </div>
      <div>
        <h3 className={cn('text-sm font-medium mb-4', text.secondary)}>Latest Cards</h3>
        <GlassTable headers={['Slot', 'Signal', 'Sources', 'Created']}>
          {mockFeedCards.slice(0, 5).map(card => (
            <tr key={card.id} className={glass.tableRow}>
              <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', slotColor[card.slot])}>{card.slot}</Badge></td>
              <td className={cn('px-4 py-3 max-w-[300px] truncate', text.primary)}>{card.signal_text.slice(0, 80)}</td>
              <td className={cn('px-4 py-3', text.secondary)}>{card.sources.length}</td>
              <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(card.created_at)}</td>
            </tr>
          ))}
        </GlassTable>
      </div>
      <div>
        <h3 className={cn('text-sm font-medium mb-4', text.secondary)}>Recent Pipeline Runs</h3>
        <GlassTable headers={['Batch', 'Status', 'Duration', 'Ingested', 'Cards']}>
          {mockPipelineRuns.slice(0, 3).map(run => (
            <tr key={run.id} className={glass.tableRow}>
              <td className={cn('px-4 py-3 font-mono text-xs', text.primary)}>{run.batch_id}</td>
              <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[run.status])}>{run.status}</Badge></td>
              <td className={cn('px-4 py-3 text-xs', text.secondary)}>{formatDuration(run.duration_seconds)}</td>
              <td className={cn('px-4 py-3', text.secondary)}>{run.metrics.ingested}</td>
              <td className={cn('px-4 py-3', text.secondary)}>{run.metrics.cards_saved}</td>
            </tr>
          ))}
        </GlassTable>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SYSTEM SECTIONS
// ══════════════════════════════════════════
function CategoriesSection() {
  const { glass, text } = useT();
  const [selectedMC, setSelectedMC] = useState<CategoryTree | null>(mockCategories[0]);
  const [selectedL2, setSelectedL2] = useState<CategoryTree | null>(null);
  return (
    <div className="space-y-5">
      <h2 className={cn('text-xl', text.heading)}>Categories</h2>
      <div className="grid grid-cols-3 gap-5">
        {[
          { title: `Meta-Categories (${mockCategories.length})`, items: mockCategories, selected: selectedMC?.id, onSelect: (mc: CategoryTree) => { setSelectedMC(mc); setSelectedL2(null); } },
        ].map(col => (
          <div key={col.title} className={cn(glass.panel, 'overflow-hidden')}>
            <div className={cn('px-4 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>{col.title}</div>
            <div className={cn('divide-y', glass.separator)}>
              {col.items.map(mc => (
                <div key={mc.id} className={cn('px-4 py-3 text-sm cursor-pointer transition-all duration-150 flex items-center justify-between', col.selected === mc.id ? cn(glass.tableHeader, text.primary) : cn(text.secondary, glass.cardHover))} onClick={() => col.onSelect(mc)}>
                  <span>{mc.name}</span>
                  <span className={text.muted}>({mc.sources_count})</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={cn(glass.panel, 'overflow-hidden')}>
          <div className={cn('px-4 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>L2 Topics</div>
          <div className={cn('divide-y', glass.separator)}>
            {selectedMC?.children?.map(t => (
              <div key={t.id} className={cn('px-4 py-3 text-sm cursor-pointer transition-all duration-150 flex items-center justify-between', selectedL2?.id === t.id ? cn(glass.tableHeader, text.primary) : cn(text.secondary, glass.cardHover))} onClick={() => setSelectedL2(t)}>
                <span>{t.name}</span>
                <span className={text.muted}>({t.sources_count})</span>
              </div>
            )) || <div className={cn('px-4 py-4 text-xs', text.muted)}>Select a meta-category</div>}
          </div>
        </div>
        <div className={cn(glass.panel, 'overflow-hidden')}>
          <div className={cn('px-4 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>L3 Topics</div>
          <div className={cn('divide-y', glass.separator)}>
            {selectedL2?.children?.map(t => (
              <div key={t.id} className={cn('px-4 py-3 text-sm transition-colors flex items-center justify-between', text.secondary, glass.cardHover)}>
                <span>{t.name}</span>
                <span className={text.muted}>({t.sources_count})</span>
              </div>
            )) || <div className={cn('px-4 py-4 text-xs', text.muted)}>{selectedL2 ? 'No L3 topics' : 'Select an L2 topic'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourcesSection({ onSelect }: { onSelect: (s: RSSSource) => void }) {
  const { glass, text, groupColor, tierColor, statusColor } = useT();
  const [tierFilter, setTierFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = mockRSSSources.filter(s => {
    if (tierFilter !== 'all' && s.tier !== Number(tierFilter)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl', text.heading)}>RSS Sources</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." className={cn('h-8 w-40 text-xs rounded-xl', glass.input)} value={search} onChange={e => setSearch(e.target.value)} />
          {['all', '1', '2', '3'].map(t => (
            <button key={t} className={cn('h-8 px-3 rounded-xl text-xs font-medium border transition-all duration-150', tierFilter === t ? glass.buttonActive : glass.button)} onClick={() => setTierFilter(t)}>
              {t === 'all' ? 'All' : `T${t}`}
            </button>
          ))}
        </div>
      </div>
      <GlassTable headers={['Name', 'Group', 'Tier', 'Topics', '48h Arts', 'Fetched', 'Status']}>
        {filtered.map(s => (
          <tr key={s.id} className={cn(glass.tableRow, 'cursor-pointer')} onClick={() => onSelect(s)}>
            <td className={cn('px-4 py-3', text.primary)}>{s.name}</td>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', groupColor[s.feed_group] || 'bg-gray-100 text-gray-500 border-gray-200')}>{s.feed_group}</Badge></td>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', tierColor[s.tier])}>T{s.tier}</Badge></td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{s.topics_covered}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{s.articles_48h}</td>
            <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(s.fetched_at)}</td>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[s.status])}>{s.status}</Badge></td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function PersonsSection({ onSelect }: { onSelect: (p: Person) => void }) {
  const { glass, text, isLedger } = useT();
  return (
    <div className="space-y-5">
      <h2 className={cn('text-xl', text.heading)}>Persons</h2>
      <GlassTable headers={['Name', 'Quotes', 'Speaks On', 'Publishes In', 'Subscribed']}>
        {mockPersons.map(p => (
          <tr key={p.id} className={cn(glass.tableRow, 'cursor-pointer')} onClick={() => onSelect(p)}>
            <td className={cn('px-4 py-3 font-medium', text.primary)}>{p.name}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{p.quotes_count}</td>
            <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{p.speaks_on.slice(0, 3).map(t => <Badge key={t} variant="outline" className={cn('text-[9px] rounded-full', isLedger ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white/[0.06] text-white/60 border-white/[0.1]')}>{t}</Badge>)}</div></td>
            <td className={cn('px-4 py-3 text-xs', isLedger ? 'text-emerald-600' : 'text-cyan-400')}>{p.publishes_in}</td>
            <td className={cn('px-4 py-3 text-xs', text.secondary)}>{p.subscribed_by.join(', ') || '—'}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function QuotesSection() {
  const { glass, text, isLedger } = useT();
  const [search, setSearch] = useState('');
  const filtered = search ? mockQuotes.filter(q => q.text.toLowerCase().includes(search.toLowerCase()) || q.person_name.toLowerCase().includes(search.toLowerCase())) : mockQuotes;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl', text.heading)}>Quotes ({mockQuotes.length})</h2>
        <Input placeholder="Search quotes..." className={cn('h-8 w-60 text-xs rounded-xl', glass.input)} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <GlassTable headers={['Person', 'Quote', 'Source', 'Year', 'Used']}>
        {filtered.map(q => (
          <tr key={q.id} className={glass.tableRow}>
            <td className={cn('px-4 py-3 font-medium', text.primary)}>{q.person_name}</td>
            <td className={cn('px-4 py-3 italic truncate max-w-[400px]', isLedger ? 'text-gray-500' : 'text-white/60')}>«{q.text}»</td>
            <td className={cn('px-4 py-3 text-xs truncate', text.muted)}>{q.source_article}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{q.year}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{q.used_in_cards}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function ClustersSection({ onSelect }: { onSelect: (c: EventCluster) => void }) {
  const { glass, text, statusColor } = useT();
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? mockClusters : mockClusters.filter(c => c.status === statusFilter);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl', text.heading)}>Event Clusters</h2>
        <div className="flex items-center gap-2">
          {['all', 'open', 'archived'].map(s => (
            <button key={s} className={cn('h-8 px-3 rounded-xl text-xs font-medium border transition-all duration-150', statusFilter === s ? glass.buttonActive : glass.button)} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
      </div>
      <GlassTable headers={['Topic', 'Articles', 'Status', 'Sources', 'Last Seen']}>
        {filtered.map(cl => (
          <tr key={cl.id} className={cn(glass.tableRow, 'cursor-pointer')} onClick={() => onSelect(cl)}>
            <td className={cn('px-4 py-3 truncate max-w-[250px]', text.primary)}>{cl.topic_text}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{cl.n_articles}</td>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[cl.status])}>{cl.status}</Badge></td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{cl.feed_groups.length}</td>
            <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(cl.last_seen_at)}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function PipelineRunsSection({ onSelect }: { onSelect: (r: PipelineRun) => void }) {
  const { glass, text, statusColor } = useT();
  return (
    <div className="space-y-5">
      <h2 className={cn('text-xl', text.heading)}>Pipeline Runs</h2>
      <GlassTable headers={['Batch ID', 'Status', 'Duration', 'Ingested', 'Cards', 'Quotes', 'Started']}>
        {mockPipelineRuns.map(run => (
          <tr key={run.id} className={cn(glass.tableRow, 'cursor-pointer')} onClick={() => onSelect(run)}>
            <td className={cn('px-4 py-3 font-mono text-xs', text.primary)}>{run.batch_id}</td>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[run.status])}>{run.status}</Badge></td>
            <td className={cn('px-4 py-3 text-xs', text.secondary)}>{formatDuration(run.duration_seconds)}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{run.metrics.ingested}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{run.metrics.cards_saved}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{run.metrics.quotes_attached}</td>
            <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(run.started_at)}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function SettingsSection() {
  const { glass, text, isLedger } = useT();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl', text.heading)}>Settings</h2>
        <button className={cn('h-8 px-3 rounded-xl text-xs font-medium border flex items-center gap-1.5', glass.button)}>
          <ExternalLink className="h-3 w-3" /> Edit on server
        </button>
      </div>
      <div className={cn(glass.panel, 'overflow-hidden')}>
        <pre className={cn('p-5 text-xs font-mono overflow-auto max-h-[600px]', isLedger ? 'text-gray-600' : 'text-white/60')}>{JSON.stringify(mockSettings, null, 2)}</pre>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// USER DETAIL TABS
// ══════════════════════════════════════════

function UserProfileTab({ user }: { user: UserProfile }) {
  const { glass, text, isLedger } = useT();
  const [editingSoul, setEditingSoul] = useState(false);
  const [editingTaste, setEditingTaste] = useState(false);
  const [soulDraft, setSoulDraft] = useState(user.soul_md);
  const [tasteDraft, setTasteDraft] = useState(user.taste_md);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={cn('h-14 w-14 rounded-2xl border flex items-center justify-center text-xl font-bold', isLedger ? 'bg-[#75FB90]/20 border-[#75FB90]/30 text-black' : 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border-white/[0.1] text-white')}>{user.name[0]}</div>
        <div>
          <div className={cn('text-lg font-semibold', text.primary)}>{user.name}</div>
          <div className={cn('text-xs font-mono', isLedger ? 'text-gray-400' : 'text-white/30')}>{user.id}</div>
          <div className={cn('text-xs mt-0.5', text.secondary)}>{user.language} · {user.timezone} · Last active {relativeTime(user.last_active)}</div>
        </div>
      </div>

      {[
        { title: 'SOUL.md', editing: editingSoul, setEditing: setEditingSoul, draft: soulDraft, setDraft: setSoulDraft, content: user.soul_md },
        { title: 'TASTE.md', editing: editingTaste, setEditing: setEditingTaste, draft: tasteDraft, setDraft: setTasteDraft, content: user.taste_md },
      ].map(doc => (
        <div key={doc.title} className={cn(glass.panel, 'overflow-hidden')}>
          <div className={cn('px-5 py-3 border-b flex items-center justify-between', glass.separator)}>
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', text.muted)}>{doc.title}</span>
            <button className={cn('text-xs px-2 py-1 rounded-lg', glass.button)} onClick={() => doc.setEditing(!doc.editing)}>
              {doc.editing ? 'Preview' : 'Edit'}
            </button>
          </div>
          <div className="p-5">
            {doc.editing ? (
              <Textarea className={cn('min-h-[200px] text-xs font-mono rounded-xl', glass.input)} value={doc.draft} onChange={e => doc.setDraft(e.target.value)} />
            ) : (
              <div className={cn('text-sm whitespace-pre-wrap leading-relaxed', isLedger ? 'text-gray-600' : 'text-white/60')}>{doc.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserSubscriptionsTab({ user }: { user: UserProfile }) {
  const { glass, text, isLedger } = useT();
  const allTopics = mockCategories.flatMap(mc => {
    const topics = mc.children?.flatMap(l2 => {
      const l3 = l2.children?.map(t => t.name) || [];
      return l3.length > 0 ? l3 : [l2.name];
    }) || [];
    return [{ mc: mc.name, topics }];
  });
  const subscribedTopics = new Set(user.topic_subscriptions.flatMap(g => g.topics));

  return (
    <div className="space-y-6">
      <h3 className={cn('text-sm font-medium', text.secondary)}>Topic Subscriptions · {subscribedTopics.size} topics</h3>
      {allTopics.map(group => {
        const subCount = group.topics.filter(t => subscribedTopics.has(t)).length;
        return (
          <div key={group.mc} className={cn(glass.panel, 'overflow-hidden')}>
            <div className={cn('px-5 py-3 border-b flex items-center justify-between', glass.separator)}>
              <span className={cn('text-xs font-medium', text.primary)}>{group.mc}</span>
              <span className={text.muted}>{subCount}/{group.topics.length}</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {group.topics.map(topic => {
                const isSubscribed = subscribedTopics.has(topic);
                return (
                  <button key={topic} className={cn('px-3 py-1.5 rounded-xl text-xs border transition-all duration-150', isSubscribed ? (isLedger ? 'bg-[#75FB90]/15 text-emerald-700 border-[#75FB90]/30' : 'bg-cyan-500/15 text-cyan-300 border-cyan-400/20') : cn(isLedger ? 'border-[#D3D2D4] hover:border-gray-400' : 'border-white/[0.08] hover:border-white/[0.15]', text.muted, isLedger ? 'hover:text-gray-600' : 'hover:text-white/60'))}>
                    {isSubscribed && <Check className="h-3 w-3 inline mr-1" />}
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className={cn('border-t pt-6', glass.separator)} />
      <h3 className={cn('text-sm font-medium', text.secondary)}>Person Subscriptions · {user.person_subscriptions.length} persons</h3>
      <div className="flex flex-wrap gap-2">
        {mockPersons.map(p => {
          const isSubscribed = user.person_subscriptions.includes(p.name);
          return (
            <button key={p.id} className={cn('px-3 py-1.5 rounded-xl text-xs border transition-all duration-150', isSubscribed ? (isLedger ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-violet-500/15 text-violet-300 border-violet-400/20') : cn(isLedger ? 'border-[#D3D2D4] hover:border-gray-400' : 'border-white/[0.08] hover:border-white/[0.15]', text.muted, isLedger ? 'hover:text-gray-600' : 'hover:text-white/60'))}>
              {isSubscribed && <Check className="h-3 w-3 inline mr-1" />}
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UserFeedTab({ user }: { user: UserProfile }) {
  const { glass, text, slotColor } = useT();
  const userCards = mockFeedCards.filter(c => c.user_id === user.id);
  const [slotFilter, setSlotFilter] = useState('all');
  const filtered = slotFilter === 'all' ? userCards : userCards.filter(c => c.slot === slotFilter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className={cn('text-sm font-medium', text.secondary)}>Feed Cards · {userCards.length}</h3>
        <div className="flex items-center gap-2">
          {['all', 'now', 'deep', 'bridge', 'challenge'].map(s => (
            <button key={s} className={cn('h-8 px-3 rounded-xl text-xs font-medium border transition-all duration-150', slotFilter === s ? glass.buttonActive : glass.button)} onClick={() => setSlotFilter(s)}>{s}</button>
          ))}
        </div>
      </div>
      <GlassTable headers={['Slot', 'Signal', 'Sources', 'Words', 'Quote', 'Created', 'Read']}>
        {filtered.map(card => (
          <tr key={card.id} className={glass.tableRow}>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', slotColor[card.slot])}>{card.slot}</Badge></td>
            <td className={cn('px-4 py-3 truncate max-w-[350px]', text.primary)}>{card.signal_text.slice(0, 100)}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{card.sources.length}</td>
            <td className={cn('px-4 py-3 text-center', text.secondary)}>{card.word_count}</td>
            <td className="px-4 py-3 text-center">{card.quote ? <Check className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <span className={text.muted}>—</span>}</td>
            <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(card.created_at)}</td>
            <td className="px-4 py-3 text-center">{card.read_at ? <Check className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <span className={text.muted}>—</span>}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function UserEventsTab({ user }: { user: UserProfile }) {
  const { glass, text, actionColor, isLedger } = useT();
  const userEvents = mockUserEvents.filter(e => e.user_id === user.id);
  const [actionFilter, setActionFilter] = useState('all');
  const filtered = actionFilter === 'all' ? userEvents : userEvents.filter(e => e.action === actionFilter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className={cn('text-sm font-medium', text.secondary)}>Events · {userEvents.length}</h3>
        <div className="flex items-center gap-2">
          {['all', 'read', 'save', 'skip', 'deep_dive', 'dismiss'].map(a => (
            <button key={a} className={cn('h-8 px-3 rounded-xl text-xs font-medium border transition-all duration-150', actionFilter === a ? glass.buttonActive : glass.button)} onClick={() => setActionFilter(a)}>{a}</button>
          ))}
        </div>
      </div>
      <GlassTable headers={['Action', 'Card Signal', 'Cluster', 'Time']}>
        {filtered.map(ev => (
          <tr key={ev.id} className={glass.tableRow}>
            <td className="px-4 py-3"><Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', actionColor[ev.action])}>{ev.action}</Badge></td>
            <td className={cn('px-4 py-3 truncate max-w-[300px]', text.primary)}>{ev.card_signal.slice(0, 80)}</td>
            <td className={cn('px-4 py-3 text-xs truncate', isLedger ? 'text-emerald-600' : 'text-cyan-400')}>{ev.cluster_topic}</td>
            <td className={cn('px-4 py-3 text-xs', text.muted)}>{relativeTime(ev.created_at)}</td>
          </tr>
        ))}
      </GlassTable>
    </div>
  );
}

function UserStatsTab({ user }: { user: UserProfile }) {
  const { glass, text, slotColor, actionColor, isLedger } = useT();
  const readRate = user.cards_total > 0 ? Math.round((user.cards_read / user.cards_total) * 100) : 0;
  const userCards = mockFeedCards.filter(c => c.user_id === user.id);
  const avgWords = userCards.length > 0 ? Math.round(userCards.reduce((a, c) => a + c.word_count, 0) / userCards.length) : 0;
  const quoteRate = userCards.length > 0 ? Math.round((userCards.filter(c => c.quote).length / userCards.length) * 100) : 0;

  const topicCounts: Record<string, number> = {};
  userCards.forEach(c => { topicCounts[c.cluster_topic] = (topicCounts[c.cluster_topic] || 0) + 1; });
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  const days = [3, 5, 4, 6, 2, 5, 4];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-5">
        <KPICard label="Read Rate" value={`${readRate}%`} sub={`${user.cards_read} of ${user.cards_total}`} />
        <KPICard label="Avg Words" value={avgWords} sub="per card" />
        <KPICard label="Quote Rate" value={`${quoteRate}%`} sub="cards with quotes" />
        <KPICard label="Events 7d" value={user.events_7d} />
      </div>

      <div className={cn(glass.panel, 'overflow-hidden p-5')}>
        <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-4', text.muted)}>Cards per Day (7d)</div>
        <div className="flex items-end gap-2 h-20">
          {days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={cn('w-full rounded-lg transition-all', isLedger ? 'bg-[#75FB90]/60' : 'bg-cyan-500/60')} style={{ height: `${(d / 7) * 100}%` }} />
              <span className={cn('text-[9px]', isLedger ? 'text-gray-400' : 'text-white/30')}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(glass.panel, 'overflow-hidden')}>
        <div className={cn('px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>Top Topics</div>
        <div className={cn('divide-y', glass.separator)}>
          {topTopics.slice(0, 5).map(([topic, count]) => (
            <div key={topic} className="px-5 py-3 flex items-center justify-between">
              <span className={cn('text-sm', text.primary)}>{topic}</span>
              <span className={cn('text-xs font-mono', text.secondary)}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className={cn(glass.panel, 'overflow-hidden')}>
          <div className={cn('px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>Slot Distribution</div>
          <div className="p-5 space-y-3">
            {(['now', 'deep', 'bridge', 'challenge'] as const).map(slot => {
              const count = userCards.filter(c => c.slot === slot).length;
              const pct = userCards.length > 0 ? (count / userCards.length) * 100 : 0;
              return (
                <div key={slot} className="flex items-center gap-3">
                  <Badge variant="outline" className={cn('text-[10px] w-16 justify-center rounded-full', slotColor[slot])}>{slot}</Badge>
                  <div className={cn('flex-1 h-2 rounded-full overflow-hidden', isLedger ? 'bg-gray-100' : 'bg-white/[0.06]')}>
                    <div className={cn('h-full rounded-full', isLedger ? 'bg-gray-300' : 'bg-white/20')} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={cn('text-xs font-mono w-8 text-right', text.secondary)}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cn(glass.panel, 'overflow-hidden')}>
          <div className={cn('px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-wider', glass.separator, text.muted)}>Action Breakdown</div>
          <div className="p-5 space-y-3">
            {(['read', 'save', 'skip', 'deep_dive', 'dismiss'] as const).map(action => {
              const events = mockUserEvents.filter(e => e.user_id === user.id && e.action === action);
              return (
                <div key={action} className="flex items-center justify-between">
                  <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', actionColor[action])}>{action}</Badge>
                  <span className={cn('text-xs font-mono', text.secondary)}>{events.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDeliveryTab({ user }: { user: UserProfile }) {
  const { glass, text, slotColor, isLedger } = useT();
  return (
    <div className="space-y-6">
      <h3 className={cn('text-sm font-medium', text.secondary)}>Delivery Settings</h3>

      <div className="grid grid-cols-2 gap-5">
        <div className={cn(glass.card, 'p-5 space-y-2')}>
          <div className={cn('text-[10px] uppercase tracking-wider', text.muted)}>Max Cards per Batch</div>
          <div className={cn('text-3xl font-bold', text.primary)}>{user.max_cards}</div>
        </div>
        <div className={cn(glass.card, 'p-5 space-y-3')}>
          <div className={cn('text-[10px] uppercase tracking-wider', text.muted)}>Delivery Times (UTC)</div>
          <div className="flex gap-2">
            {user.cron.map(t => (
              <Badge key={t} variant="outline" className={cn('text-xs rounded-full', isLedger ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white/[0.06] text-white/70 border-white/[0.1]')}>{t}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(glass.card, 'p-5')}>
        <div className={cn('text-[10px] uppercase tracking-wider mb-4', text.muted)}>Slot Budget</div>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(user.slots).map(([slot, count]) => (
            <div key={slot} className="text-center">
              <Badge variant="outline" className={cn('text-[10px] mb-2 rounded-full px-2.5', slotColor[slot])}>{slot}</Badge>
              <div className={cn('text-2xl font-bold', text.primary)}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(glass.card, 'p-5')}>
        <div className={cn('text-[10px] uppercase tracking-wider mb-4', text.muted)}>Preferences</div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('text-xs mr-1', isLedger ? 'text-emerald-600' : 'text-emerald-400')}>Likes:</span>
            {user.likes.map(l => <Badge key={l} variant="outline" className={cn('text-[10px] rounded-full', isLedger ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20')}>{l}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('text-xs mr-1', isLedger ? 'text-rose-600' : 'text-rose-400')}>Dislikes:</span>
            {user.dislikes.map(d => <Badge key={d} variant="outline" className={cn('text-[10px] rounded-full', isLedger ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/15 text-rose-400 border-rose-500/20')}>{d}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('text-xs mr-1', isLedger ? 'text-orange-600' : 'text-orange-400')}>Anti-topics:</span>
            {user.anti_topics.map(a => <Badge key={a} variant="outline" className={cn('text-[10px] rounded-full', isLedger ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-orange-500/15 text-orange-400 border-orange-500/20')}>{a}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// USER DETAIL PAGE (tabbed)
// ══════════════════════════════════════════
function UserDetailPage({ user, activeTab, onTabChange }: { user: UserProfile; activeTab: UserTab; onTabChange: (tab: UserTab) => void }) {
  const { glass, isLedger } = useT();
  return (
    <div className="space-y-0">
      <div className={cn('border-b px-1 flex gap-0', glass.separator)}>
        {USER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-5 py-3.5 text-sm flex items-center gap-2 border-b-2 transition-all duration-200 -mb-px',
              activeTab === tab.id
                ? (isLedger ? 'border-[#75FB90] text-black' : 'border-cyan-400 text-cyan-400')
                : (isLedger ? 'border-transparent text-gray-400 hover:text-gray-600' : 'border-transparent text-white/40 hover:text-white/70')
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-7">
        {activeTab === 'profile' && <UserProfileTab user={user} />}
        {activeTab === 'subscriptions' && <UserSubscriptionsTab user={user} />}
        {activeTab === 'feed' && <UserFeedTab user={user} />}
        {activeTab === 'events' && <UserEventsTab user={user} />}
        {activeTab === 'stats' && <UserStatsTab user={user} />}
        {activeTab === 'delivery' && <UserDeliveryTab user={user} />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// DETAIL PANELS for system sections
// ══════════════════════════════════════════
function ClusterDetail({ cluster }: { cluster: EventCluster }) {
  const { glass, text, statusColor, groupColor, tierColor, isLedger } = useT();
  return (
    <>
      <div className={cn('font-medium', text.primary)}>{cluster.topic_text}</div>
      <div className="flex gap-2 mt-2">
        <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[cluster.status])}>{cluster.status}</Badge>
        <span className={cn('text-xs', text.secondary)}>{cluster.n_articles} articles</span>
      </div>
      <div className={cn('border-t pt-4 mt-4', glass.separator)} />
      <div>
        <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-3', text.muted)}>Member Articles ({cluster.n_articles})</div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {cluster.articles.slice(0, 15).map((a, i) => (
            <div key={i} className={cn('flex items-center justify-between text-xs py-2 border-b', glass.separator)}>
              <span className={cn('truncate max-w-[200px]', isLedger ? 'text-gray-500' : 'text-white/60')}>{a.title}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={cn('text-[9px] rounded-full', groupColor[a.feed_group] || 'bg-gray-100 text-gray-500 border-gray-200')}>{a.feed_group}</Badge>
                <Badge variant="outline" className={cn('text-[9px] rounded-full', tierColor[a.tier])}>T{a.tier}</Badge>
              </div>
            </div>
          ))}
          {cluster.articles.length > 15 && <div className={cn('text-xs pt-2', text.muted)}>+{cluster.articles.length - 15} more...</div>}
        </div>
      </div>
    </>
  );
}

function PersonDetail({ person }: { person: Person }) {
  const { glass, text, isLedger } = useT();
  const personQuotes = mockQuotes.filter(q => q.person_id === person.id);
  return (
    <>
      <div className={cn('font-medium text-base', text.primary)}>{person.name}</div>
      <div className={cn('text-xs', text.secondary)}>Quotes: {person.quotes_count} · {person.publishes_in}</div>
      <div className={cn('border-t pt-4 mt-4', glass.separator)} />
      <div>
        <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-3', text.muted)}>Speaks On</div>
        <div className="flex flex-wrap gap-1">{person.speaks_on.map(t => <Badge key={t} variant="outline" className={cn('text-xs rounded-full', isLedger ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white/[0.06] text-white/60 border-white/[0.1]')}>{t}</Badge>)}</div>
      </div>
      <div>
        <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-3', text.muted)}>Coined Concepts</div>
        <div className="flex flex-wrap gap-1">{person.coined_concepts.map(c => <Badge key={c} variant="outline" className={cn('text-xs rounded-full', isLedger ? 'bg-[#75FB90]/15 text-emerald-700 border-[#75FB90]/30' : 'bg-cyan-500/15 text-cyan-300 border-cyan-400/20')}>{c}</Badge>)}</div>
      </div>
      <div className={cn('border-t pt-4 mt-4', glass.separator)} />
      <div>
        <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-3', text.muted)}>Quotes ({personQuotes.length})</div>
        <div className="space-y-3">
          {personQuotes.map(q => (
            <div key={q.id} className={cn('border-l-2 pl-3 py-1', isLedger ? 'border-[#75FB90]' : 'border-cyan-500/30')}>
              <p className={cn('text-xs italic', isLedger ? 'text-gray-500' : 'text-white/60')}>«{q.text}»</p>
              <div className={cn('text-[10px] mt-1', text.muted)}>{q.source_article} · {q.year}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PipelineRunDetail({ run }: { run: PipelineRun }) {
  const { glass, text, statusColor } = useT();
  return (
    <>
      <div className={cn('font-medium font-mono', text.primary)}>{run.batch_id}</div>
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', statusColor[run.status])}>{run.status}</Badge>
        <span className={cn('text-xs', text.secondary)}>{formatDuration(run.duration_seconds)}</span>
      </div>
      <div className={cn('border-t pt-4 mt-4', glass.separator)} />
      <div className="space-y-2">
        {Object.entries(run.metrics).map(([key, val]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className={text.secondary}>{key.replace(/_/g, ' ')}</span>
            <span className={cn('font-mono', text.primary)}>{val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════
// USERS LIST
// ══════════════════════════════════════════
function UsersListSection({ onSelectUser }: { onSelectUser: (userId: string) => void }) {
  const { glass, text, statusColor, isLedger } = useT();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl', text.heading)}>Users ({mockUsers.length})</h2>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <KPICard label="Total Users" value={mockUsers.length} />
        <KPICard label="Avg Read Rate" value={`${Math.round(mockUsers.reduce((a, u) => a + (u.cards_total > 0 ? (u.cards_read / u.cards_total) * 100 : 0), 0) / mockUsers.length)}%`} />
        <KPICard label="Total Subscriptions" value={mockUsers.reduce((a, u) => a + u.topic_subscriptions.reduce((b, g) => b + g.topics.length, 0) + u.person_subscriptions.length, 0)} />
        <KPICard label="Events (7d)" value={mockUsers.reduce((a, u) => a + u.events_7d, 0)} />
      </div>

      <GlassTable headers={['User', 'Language', 'Topics', 'Persons', 'Cards', 'Read Rate', 'Events 7d', 'Max Cards', 'Last Active']}>
        {mockUsers.map(user => {
          const totalTopics = user.topic_subscriptions.reduce((a, g) => a + g.topics.length, 0);
          const readRate = user.cards_total > 0 ? Math.round((user.cards_read / user.cards_total) * 100) : 0;
          return (
            <tr key={user.id} className={cn(glass.tableRow, 'cursor-pointer')} onClick={() => onSelectUser(user.id)}>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={cn('h-8 w-8 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0', isLedger ? 'bg-[#75FB90]/20 border-[#75FB90]/30 text-black' : 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border-white/[0.1] text-white')}>{user.name[0]}</div>
                  <div>
                    <div className={cn('font-medium', text.primary)}>{user.name}</div>
                    <div className={cn('text-[10px] font-mono', isLedger ? 'text-gray-400' : 'text-white/25')}>{user.id.slice(0, 8)}…</div>
                  </div>
                </div>
              </td>
              <td className={cn('px-4 py-3.5 text-center', text.secondary)}>{user.language}</td>
              <td className={cn('px-4 py-3.5 text-center', text.secondary)}>{totalTopics}</td>
              <td className={cn('px-4 py-3.5 text-center', text.secondary)}>{user.person_subscriptions.length}</td>
              <td className="px-4 py-3.5 text-center">
                <span className={text.primary}>{user.cards_read}</span>
                <span className={text.muted}>/{user.cards_total}</span>
              </td>
              <td className="px-4 py-3.5 text-center">
                <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', readRate >= 80 ? statusColor.active : readRate >= 50 ? (isLedger ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/80 text-black border-transparent') : statusColor.failed)}>
                  {readRate}%
                </Badge>
              </td>
              <td className={cn('px-4 py-3.5 text-center', text.secondary)}>{user.events_7d}</td>
              <td className={cn('px-4 py-3.5 text-center', text.secondary)}>{user.max_cards}</td>
              <td className={cn('px-4 py-3.5 text-xs', text.muted)}>{relativeTime(user.last_active)}</td>
            </tr>
          );
        })}
      </GlassTable>
    </div>
  );
}

// ══════════════════════════════════════════
// MAIN ADMIN PAGE
// ══════════════════════════════════════════
export default function Admin() {
  const { theme } = useTheme();
  const isLedger = theme === 'ledger';

  const tokens: TokenSet = {
    isLedger,
    glass: isLedger ? glassLight : glassDark,
    text: isLedger ? textLight : textDark,
    slotColor: isLedger ? slotColorLight : slotColorDark,
    tierColor: isLedger ? tierColorLight : tierColorDark,
    statusColor: isLedger ? statusColorLight : statusColorDark,
    actionColor: isLedger ? actionColorLight : actionColorDark,
    groupColor: isLedger ? groupColorLight : groupColorDark,
  };

  const [view, setView] = useState<ActiveView>({ kind: 'dashboard' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  const [detailPanel, setDetailPanel] = useState<{ type: string; data: unknown } | null>(null);

  const navigateTo = (v: ActiveView) => { setView(v); setDetailPanel(null); };

  const isActive = (v: ActiveView) => {
    if (v.kind !== view.kind) return false;
    if (v.kind === 'dashboard') return true;
    if (v.kind === 'system' && view.kind === 'system') return v.section === view.section;
    if (v.kind === 'user' && view.kind === 'user') return v.userId === view.userId;
    return false;
  };

  const renderContent = () => {
    switch (view.kind) {
      case 'dashboard': return <DashboardSection />;
      case 'system':
        switch (view.section) {
          case 'categories': return <CategoriesSection />;
          case 'sources': return <SourcesSection onSelect={s => setDetailPanel({ type: 'source', data: s })} />;
          case 'persons': return <PersonsSection onSelect={p => setDetailPanel({ type: 'person', data: p })} />;
          case 'quotes': return <QuotesSection />;
          case 'clusters': return <ClustersSection onSelect={c => setDetailPanel({ type: 'cluster', data: c })} />;
          case 'runs': return <PipelineRunsSection onSelect={r => setDetailPanel({ type: 'run', data: r })} />;
          case 'settings': return <SettingsSection />;
          case 'users': return <UsersListSection onSelectUser={id => navigateTo({ kind: 'user', userId: id, tab: 'profile' })} />;
        }
        break;
      case 'user': {
        const user = mockUsers.find(u => u.id === view.userId);
        if (!user) return <div className={tokens.text.muted}>User not found</div>;
        return (
          <div>
            <div className="px-7 pt-5">
              <button className={cn('text-xs h-7 flex items-center gap-1 transition-colors', tokens.text.muted, isLedger ? 'hover:text-gray-700' : 'hover:text-white/70')} onClick={() => navigateTo({ kind: 'system', section: 'users' })}>
                <ChevronLeft className="h-3 w-3" /> Back to Users
              </button>
            </div>
            <UserDetailPage user={user} activeTab={view.tab} onTabChange={tab => setView({ ...view, tab })} />
          </div>
        );
      }
    }
  };

  const renderDetail = () => {
    if (!detailPanel) return null;
    const { type, data } = detailPanel;
    switch (type) {
      case 'cluster': return <DetailPanel title="Cluster" onClose={() => setDetailPanel(null)}><ClusterDetail cluster={data as EventCluster} /></DetailPanel>;
      case 'source': {
        const s = data as RSSSource;
        return (
          <DetailPanel title="RSS Source" onClose={() => setDetailPanel(null)}>
            <div className={cn('font-medium', tokens.text.primary)}>{s.name}</div>
            <a href={s.url} target="_blank" rel="noopener" className={cn('text-xs break-all', isLedger ? 'text-emerald-600' : 'text-cyan-400')}>{s.url}</a>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', tokens.groupColor[s.feed_group] || 'bg-gray-100 text-gray-500 border-gray-200')}>{s.feed_group}</Badge>
              <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', tokens.tierColor[s.tier])}>Tier {s.tier}</Badge>
              <Badge variant="outline" className={cn('text-[10px] rounded-full px-2.5', tokens.statusColor[s.status])}>{s.status}</Badge>
            </div>
            <div className={cn('border-t pt-4 mt-4', tokens.glass.separator)} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className={tokens.text.secondary}>Topics:</span><span className={tokens.text.primary}>{s.topics_covered}</span>
              <span className={tokens.text.secondary}>48h articles:</span><span className={tokens.text.primary}>{s.articles_48h}</span>
              <span className={tokens.text.secondary}>Last fetched:</span><span className={tokens.text.primary}>{relativeTime(s.fetched_at)}</span>
            </div>
          </DetailPanel>
        );
      }
      case 'person': return <DetailPanel title="Person" onClose={() => setDetailPanel(null)}><PersonDetail person={data as Person} /></DetailPanel>;
      case 'run': return <DetailPanel title="Pipeline Run" onClose={() => setDetailPanel(null)}><PipelineRunDetail run={data as PipelineRun} /></DetailPanel>;
      default: return null;
    }
  };

  return (
    <TokensCtx.Provider value={tokens}>
      <div className="h-screen flex overflow-hidden" style={{ background: isLedger ? '#F0EFF2' : 'linear-gradient(180deg, #0F172A 0%, #0A0F1A 100%)' }}>
        {/* Sidebar */}
        <div
          className={cn('flex flex-col shrink-0 transition-all duration-300', sidebarOpen ? 'w-[230px]' : 'w-[56px]')}
          style={{
            background: isLedger ? '#FFFFFF' : 'rgba(15, 23, 42, 0.7)',
            backdropFilter: isLedger ? undefined : 'blur(20px)',
            borderRight: isLedger ? '1px solid #D3D2D4' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className={cn('h-14 flex items-center justify-between px-3 border-b', isLedger ? 'border-[#D3D2D4]' : 'border-white/[0.06]')}>
            {sidebarOpen && <span className={cn('text-sm font-semibold tracking-tight ml-1', isLedger ? 'text-black' : 'text-white')}>Strata Admin</span>}
            {sidebarOpen && <ThemeSwitcher />}
            <button className={cn('h-8 w-8 rounded-xl flex items-center justify-center transition-colors shrink-0', isLedger ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/[0.04] hover:bg-white/[0.08]')} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft className={cn('h-4 w-4', isLedger ? 'text-gray-500' : 'text-white/50')} /> : <ChevronRight className={cn('h-4 w-4', isLedger ? 'text-gray-500' : 'text-white/50')} />}
            </button>
          </div>
          <ScrollArea className="flex-1 py-3">
            <nav className="px-2 space-y-1">
              <button
                onClick={() => navigateTo({ kind: 'dashboard' })}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                  view.kind === 'dashboard'
                    ? (isLedger ? 'bg-[#75FB90]/15 text-black border-l-2 border-[#75FB90]' : 'bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]')
                    : (isLedger ? 'text-gray-500 hover:text-black hover:bg-gray-50' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]')
                )}
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>Dashboard</span>}
              </button>

              {sidebarOpen && (
                <button
                  onClick={() => setSystemOpen(!systemOpen)}
                  className={cn('w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors mt-4', isLedger ? 'text-gray-400 hover:text-gray-500' : 'text-white/25 hover:text-white/40')}
                >
                  <span>Sections</span>
                  {systemOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
              {(systemOpen || !sidebarOpen) && SYSTEM_ITEMS.map(item => {
                const active = isActive({ kind: 'system', section: item.id }) || (item.id === 'users' && view.kind === 'user');
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo({ kind: 'system', section: item.id })}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      active
                        ? (isLedger ? 'bg-[#75FB90]/15 text-black border-l-2 border-[#75FB90]' : 'bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]')
                        : (isLedger ? 'text-gray-500 hover:text-black hover:bg-gray-50' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'),
                      sidebarOpen && 'pl-5'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1">
            <div className={cn('max-w-[1200px]', view.kind === 'user' ? '' : 'p-7')}>
              {renderContent()}
            </div>
          </ScrollArea>
          {renderDetail()}
        </div>
      </div>
    </TokensCtx.Provider>
  );
}
