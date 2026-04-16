import { useState } from 'react';
import { 
  BarChart3, Layers, FolderTree, Radio, User, Quote, Users, 
  Activity, Settings, ChevronLeft, ChevronRight, Search, ExternalLink,
  Check, X, ChevronDown, ChevronUp, CreditCard, Bell, Truck, BarChart2, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

const slotColor: Record<string, string> = {
  now: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  deep: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  bridge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  challenge: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const tierColor: Record<number, string> = {
  1: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  2: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  3: 'bg-orange-800/20 text-orange-600 border-orange-800/30',
};
const statusColor: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-400',
  partial: 'bg-amber-500/20 text-amber-400',
  failed: 'bg-red-500/20 text-red-400',
  running: 'bg-blue-500/20 text-blue-400',
  open: 'bg-emerald-500/20 text-emerald-400',
  archived: 'bg-muted text-muted-foreground',
  active: 'bg-emerald-500/20 text-emerald-400',
  stale: 'bg-red-500/20 text-red-400',
};
const actionColor: Record<string, string> = {
  read: 'bg-blue-500/20 text-blue-400',
  save: 'bg-emerald-500/20 text-emerald-400',
  skip: 'bg-muted text-muted-foreground',
  deep_dive: 'bg-purple-500/20 text-purple-400',
  dismiss: 'bg-red-500/20 text-red-400',
};

// ── Shared ──
function DetailPanel({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="w-[420px] border-l border-border bg-card flex flex-col shrink-0">
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <ScrollArea className="flex-1"><div className="p-4 space-y-4 text-sm">{children}</div></ScrollArea>
    </div>
  );
}

function KPICard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function DashboardSection() {
  const cardsToday = mockFeedCards.filter(c => Date.now() - new Date(c.created_at).getTime() < 86400000).length;
  const activeClusters = mockClusters.filter(c => c.status === 'open').length;
  const activeRSS = mockRSSSources.filter(s => s.status === 'active').length;
  const lastRun = mockPipelineRuns[0];
  const quoteHitRate = lastRun ? Math.round((lastRun.metrics.quotes_attached / lastRun.metrics.cards_saved) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Cards Today" value={cardsToday} sub="last 24h" />
        <KPICard label="Active Clusters" value={activeClusters} />
        <KPICard label="RSS Health" value={`${activeRSS}/${mockRSSSources.length}`} sub="active feeds" />
        <KPICard label="Quote Hit Rate" value={`${quoteHitRate}%`} sub="last pipeline run" />
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Latest Cards</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Slot</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Signal</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Sources</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Created</th>
            </tr></thead>
            <tbody>{mockFeedCards.slice(0, 5).map(card => (
              <tr key={card.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2"><Badge variant="outline" className={cn('text-[10px]', slotColor[card.slot])}>{card.slot}</Badge></td>
                <td className="px-3 py-2 text-foreground max-w-[300px] truncate">{card.signal_text.slice(0, 80)}</td>
                <td className="px-3 py-2 text-muted-foreground">{card.sources.length}</td>
                <td className="px-3 py-2 text-muted-foreground text-xs">{relativeTime(card.created_at)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Pipeline Runs</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Batch</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Duration</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Ingested</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Cards</th>
            </tr></thead>
            <tbody>{mockPipelineRuns.slice(0, 3).map(run => (
              <tr key={run.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-xs text-foreground">{run.batch_id}</td>
                <td className="px-3 py-2"><Badge variant="outline" className={cn('text-[10px]', statusColor[run.status])}>{run.status}</Badge></td>
                <td className="px-3 py-2 text-muted-foreground text-xs">{formatDuration(run.duration_seconds)}</td>
                <td className="px-3 py-2 text-muted-foreground">{run.metrics.ingested}</td>
                <td className="px-3 py-2 text-muted-foreground">{run.metrics.cards_saved}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SYSTEM SECTIONS
// ══════════════════════════════════════════
function CategoriesSection() {
  const [selectedMC, setSelectedMC] = useState<CategoryTree | null>(mockCategories[0]);
  const [selectedL2, setSelectedL2] = useState<CategoryTree | null>(null);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Categories</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">Meta-Categories ({mockCategories.length})</div>
          <div className="divide-y divide-border/50">
            {mockCategories.map(mc => (
              <div key={mc.id} className={cn('px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/20 transition-colors flex items-center justify-between', selectedMC?.id === mc.id && 'bg-muted/30')} onClick={() => { setSelectedMC(mc); setSelectedL2(null); }}>
                <span className="text-foreground">{mc.name}</span>
                <span className="text-xs text-muted-foreground">({mc.sources_count})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">L2 Topics</div>
          <div className="divide-y divide-border/50">
            {selectedMC?.children?.map(t => (
              <div key={t.id} className={cn('px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/20 transition-colors flex items-center justify-between', selectedL2?.id === t.id && 'bg-muted/30')} onClick={() => setSelectedL2(t)}>
                <span className="text-foreground">{t.name}</span>
                <span className="text-xs text-muted-foreground">({t.sources_count})</span>
              </div>
            )) || <div className="px-3 py-4 text-xs text-muted-foreground">Select a meta-category</div>}
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">L3 Topics</div>
          <div className="divide-y divide-border/50">
            {selectedL2?.children?.map(t => (
              <div key={t.id} className="px-3 py-2.5 text-sm hover:bg-muted/20 transition-colors flex items-center justify-between">
                <span className="text-foreground">{t.name}</span>
                <span className="text-xs text-muted-foreground">({t.sources_count})</span>
              </div>
            )) || <div className="px-3 py-4 text-xs text-muted-foreground">{selectedL2 ? 'No L3 topics' : 'Select an L2 topic'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourcesSection({ onSelect }: { onSelect: (s: RSSSource) => void }) {
  const [tierFilter, setTierFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = mockRSSSources.filter(s => {
    if (tierFilter !== 'all' && s.tier !== Number(tierFilter)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">RSS Sources</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." className="h-7 w-40 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
          {['all', '1', '2', '3'].map(t => (
            <Button key={t} size="sm" variant={tierFilter === t ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setTierFilter(t)}>
              {t === 'all' ? 'All' : `T${t}`}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Group</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Tier</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Topics</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">48h Arts</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Fetched</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Status</th>
          </tr></thead>
          <tbody>{filtered.map(s => (
            <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(s)}>
              <td className="px-3 py-2.5 text-foreground">{s.name}</td>
              <td className="px-3 py-2.5"><Badge variant="outline" className="text-[10px]">{s.feed_group}</Badge></td>
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', tierColor[s.tier])}>T{s.tier}</Badge></td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{s.topics_covered}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{s.articles_48h}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(s.fetched_at)}</td>
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[s.status])}>{s.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PersonsSection({ onSelect }: { onSelect: (p: Person) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Persons</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Quotes</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Speaks On</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Publishes In</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Subscribed</th>
          </tr></thead>
          <tbody>{mockPersons.map(p => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(p)}>
              <td className="px-3 py-2.5 text-foreground font-medium">{p.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{p.quotes_count}</td>
              <td className="px-3 py-2.5"><div className="flex gap-1 flex-wrap">{p.speaks_on.slice(0, 3).map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}</div></td>
              <td className="px-3 py-2.5 text-xs text-blue-400">{p.publishes_in}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{p.subscribed_by.join(', ') || '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function QuotesSection() {
  const [search, setSearch] = useState('');
  const filtered = search ? mockQuotes.filter(q => q.text.toLowerCase().includes(search.toLowerCase()) || q.person_name.toLowerCase().includes(search.toLowerCase())) : mockQuotes;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Quotes ({mockQuotes.length})</h2>
        <Input placeholder="Search quotes..." className="h-7 w-60 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[120px]">Person</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Quote</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[150px]">Source</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Year</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Used</th>
          </tr></thead>
          <tbody>{filtered.map(q => (
            <tr key={q.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-3 py-2.5 text-foreground font-medium">{q.person_name}</td>
              <td className="px-3 py-2.5 text-foreground/80 italic truncate max-w-[400px]">«{q.text}»</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground truncate">{q.source_article}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{q.year}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{q.used_in_cards}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function ClustersSection({ onSelect }: { onSelect: (c: EventCluster) => void }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? mockClusters : mockClusters.filter(c => c.status === statusFilter);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Event Clusters</h2>
        <div className="flex items-center gap-2">
          {['all', 'open', 'archived'].map(s => (
            <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setStatusFilter(s)}>{s}</Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Topic</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Articles</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Status</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Sources</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Last Seen</th>
          </tr></thead>
          <tbody>{filtered.map(cl => (
            <tr key={cl.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(cl)}>
              <td className="px-3 py-2.5 text-foreground truncate max-w-[250px]">{cl.topic_text}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{cl.n_articles}</td>
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[cl.status])}>{cl.status}</Badge></td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{cl.feed_groups.length}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(cl.last_seen_at)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PipelineRunsSection({ onSelect }: { onSelect: (r: PipelineRun) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Pipeline Runs</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Batch ID</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Status</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Duration</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Ingested</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Cards</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Quotes</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Started</th>
          </tr></thead>
          <tbody>{mockPipelineRuns.map(run => (
            <tr key={run.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(run)}>
              <td className="px-3 py-2.5 font-mono text-xs text-foreground">{run.batch_id}</td>
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[run.status])}>{run.status}</Badge></td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{formatDuration(run.duration_seconds)}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.ingested}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.cards_saved}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.quotes_attached}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(run.started_at)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <Button variant="outline" size="sm" className="text-xs h-7"><ExternalLink className="h-3 w-3 mr-1" /> Edit on server</Button>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <pre className="p-4 text-xs text-foreground/80 font-mono overflow-auto max-h-[600px]">{JSON.stringify(mockSettings, null, 2)}</pre>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// USER DETAIL TABS
// ══════════════════════════════════════════

function UserProfileTab({ user }: { user: UserProfile }) {
  const [editingSoul, setEditingSoul] = useState(false);
  const [editingTaste, setEditingTaste] = useState(false);
  const [soulDraft, setSoulDraft] = useState(user.soul_md);
  const [tasteDraft, setTasteDraft] = useState(user.taste_md);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-semibold">{user.name[0]}</div>
        <div>
          <div className="text-lg font-semibold text-foreground">{user.name}</div>
          <div className="text-xs text-muted-foreground font-mono">{user.id}</div>
          <div className="text-xs text-muted-foreground">{user.language} · {user.timezone} · Last active {relativeTime(user.last_active)}</div>
        </div>
      </div>

      {/* SOUL.md */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">SOUL.md</span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setEditingSoul(!editingSoul)}>
            {editingSoul ? 'Preview' : 'Edit'}
          </Button>
        </div>
        <div className="p-4">
          {editingSoul ? (
            <Textarea className="min-h-[200px] text-xs font-mono" value={soulDraft} onChange={e => setSoulDraft(e.target.value)} />
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-sm text-foreground/80 whitespace-pre-wrap">{user.soul_md}</div>
          )}
        </div>
      </div>

      {/* TASTE.md */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">TASTE.md</span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setEditingTaste(!editingTaste)}>
            {editingTaste ? 'Preview' : 'Edit'}
          </Button>
        </div>
        <div className="p-4">
          {editingTaste ? (
            <Textarea className="min-h-[200px] text-xs font-mono" value={tasteDraft} onChange={e => setTasteDraft(e.target.value)} />
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-sm text-foreground/80 whitespace-pre-wrap">{user.taste_md}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserSubscriptionsTab({ user }: { user: UserProfile }) {
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
      <h3 className="text-sm font-medium text-foreground">Topic Subscriptions · {subscribedTopics.size} topics</h3>
      {allTopics.map(group => {
        const subCount = group.topics.filter(t => subscribedTopics.has(t)).length;
        return (
          <div key={group.mc} className="rounded-lg border border-border overflow-hidden">
            <div className="bg-muted/30 border-b border-border px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{group.mc}</span>
              <span className="text-[10px] text-muted-foreground">{subCount}/{group.topics.length}</span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {group.topics.map(topic => {
                const isSubscribed = subscribedTopics.has(topic);
                return (
                  <button
                    key={topic}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs border transition-colors',
                      isSubscribed
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-muted/30 text-muted-foreground border-border hover:border-foreground/30'
                    )}
                  >
                    {isSubscribed && <Check className="h-3 w-3 inline mr-1" />}
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <Separator />
      <h3 className="text-sm font-medium text-foreground">Person Subscriptions · {user.person_subscriptions.length} persons</h3>
      <div className="flex flex-wrap gap-2">
        {mockPersons.map(p => {
          const isSubscribed = user.person_subscriptions.includes(p.name);
          return (
            <button
              key={p.id}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs border transition-colors',
                isSubscribed
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-muted/30 text-muted-foreground border-border hover:border-foreground/30'
              )}
            >
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
  const userCards = mockFeedCards.filter(c => c.user_id === user.id);
  const [slotFilter, setSlotFilter] = useState('all');
  const filtered = slotFilter === 'all' ? userCards : userCards.filter(c => c.slot === slotFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Feed Cards · {userCards.length}</h3>
        <div className="flex items-center gap-2">
          {['all', 'now', 'deep', 'bridge', 'challenge'].map(s => (
            <Button key={s} size="sm" variant={slotFilter === s ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setSlotFilter(s)}>{s}</Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Slot</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Signal</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Sources</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Words</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Quote</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Created</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Read</th>
          </tr></thead>
          <tbody>{filtered.map(card => (
            <tr key={card.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', slotColor[card.slot])}>{card.slot}</Badge></td>
              <td className="px-3 py-2.5 text-foreground truncate max-w-[350px]">{card.signal_text.slice(0, 100)}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{card.sources.length}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-center">{card.word_count}</td>
              <td className="px-3 py-2.5 text-center">{card.quote ? <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(card.created_at)}</td>
              <td className="px-3 py-2.5 text-center">{card.read_at ? <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function UserEventsTab({ user }: { user: UserProfile }) {
  const userEvents = mockUserEvents.filter(e => e.user_id === user.id);
  const [actionFilter, setActionFilter] = useState('all');
  const filtered = actionFilter === 'all' ? userEvents : userEvents.filter(e => e.action === actionFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Events · {userEvents.length}</h3>
        <div className="flex items-center gap-2">
          {['all', 'read', 'save', 'skip', 'deep_dive', 'dismiss'].map(a => (
            <Button key={a} size="sm" variant={actionFilter === a ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setActionFilter(a)}>{a}</Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Action</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Card Signal</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[130px]">Cluster</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Time</th>
          </tr></thead>
          <tbody>{filtered.map(ev => (
            <tr key={ev.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', actionColor[ev.action])}>{ev.action}</Badge></td>
              <td className="px-3 py-2.5 text-foreground truncate max-w-[300px]">{ev.card_signal.slice(0, 80)}</td>
              <td className="px-3 py-2.5 text-xs text-blue-400 truncate">{ev.cluster_topic}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(ev.created_at)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function UserStatsTab({ user }: { user: UserProfile }) {
  const readRate = user.cards_total > 0 ? Math.round((user.cards_read / user.cards_total) * 100) : 0;
  const userCards = mockFeedCards.filter(c => c.user_id === user.id);
  const avgWords = userCards.length > 0 ? Math.round(userCards.reduce((a, c) => a + c.word_count, 0) / userCards.length) : 0;
  const quoteRate = userCards.length > 0 ? Math.round((userCards.filter(c => c.quote).length / userCards.length) * 100) : 0;

  // Top topics
  const topicCounts: Record<string, number> = {};
  userCards.forEach(c => { topicCounts[c.cluster_topic] = (topicCounts[c.cluster_topic] || 0) + 1; });
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  // Cards per day (mock sparkline)
  const days = [3, 5, 4, 6, 2, 5, 4];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Cards" value={user.cards_total} />
        <KPICard label="Read Rate" value={`${readRate}%`} sub={`${user.cards_read}/${user.cards_total}`} />
        <KPICard label="Quote Attach Rate" value={`${quoteRate}%`} />
        <KPICard label="Avg Body Words" value={avgWords} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cards per day sparkline */}
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground mb-3">Cards per Day (last 7 days)</div>
          <div className="flex items-end gap-1 h-16">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/30 rounded-sm" style={{ height: `${(d / 6) * 100}%` }} />
                <span className="text-[9px] text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top topics */}
        <div className="rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground mb-3">Top Topics by Card Count</div>
          <div className="space-y-2">
            {topTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{topic}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/50 rounded-full" style={{ width: `${(count / (topTopics[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="text-xs text-muted-foreground mb-2">Events (7d)</div>
        <div className="text-2xl font-semibold text-foreground">{user.events_7d}</div>
      </div>
    </div>
  );
}

function UserDeliveryTab({ user }: { user: UserProfile }) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-foreground">Delivery Settings</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="text-xs text-muted-foreground">Max Cards per Batch</div>
          <div className="text-2xl font-semibold text-foreground">{user.max_cards}</div>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="text-xs text-muted-foreground">Delivery Times (UTC)</div>
          <div className="flex gap-2">
            {user.cron.map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="text-xs text-muted-foreground mb-3">Slot Budget</div>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(user.slots).map(([slot, count]) => (
            <div key={slot} className="text-center">
              <Badge variant="outline" className={cn('text-[10px] mb-2', slotColor[slot])}>{slot}</Badge>
              <div className="text-xl font-semibold text-foreground">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="text-xs text-muted-foreground mb-3">Preferences</div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-emerald-400 mr-1">Likes:</span>
            {user.likes.map(l => <Badge key={l} variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{l}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-red-400 mr-1">Dislikes:</span>
            {user.dislikes.map(d => <Badge key={d} variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">{d}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-orange-400 mr-1">Anti-topics:</span>
            {user.anti_topics.map(a => <Badge key={a} variant="outline" className="text-[10px] bg-orange-500/10 text-orange-400 border-orange-500/30">{a}</Badge>)}
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
  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="border-b border-border px-1 flex gap-0">
        {USER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-3 text-sm flex items-center gap-1.5 border-b-2 transition-colors -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
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
  return (
    <>
      <div className="text-foreground font-medium">{cluster.topic_text}</div>
      <div className="flex gap-2 mt-2">
        <Badge variant="outline" className={cn('text-[10px]', statusColor[cluster.status])}>{cluster.status}</Badge>
        <span className="text-xs text-muted-foreground">{cluster.n_articles} articles</span>
      </div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Member Articles ({cluster.n_articles})</div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {cluster.articles.slice(0, 15).map((a, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/30">
              <span className="text-foreground/80 truncate max-w-[200px]">{a.title}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[9px]">{a.feed_group}</Badge>
                <Badge variant="outline" className={cn('text-[9px]', tierColor[a.tier])}>T{a.tier}</Badge>
              </div>
            </div>
          ))}
          {cluster.articles.length > 15 && <div className="text-xs text-muted-foreground pt-1">+{cluster.articles.length - 15} more...</div>}
        </div>
      </div>
    </>
  );
}

function PersonDetail({ person }: { person: Person }) {
  const personQuotes = mockQuotes.filter(q => q.person_id === person.id);
  return (
    <>
      <div className="text-foreground font-medium text-base">{person.name}</div>
      <div className="text-xs text-muted-foreground">Quotes: {person.quotes_count} · {person.publishes_in}</div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Speaks On</div>
        <div className="flex flex-wrap gap-1">{person.speaks_on.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Coined Concepts</div>
        <div className="flex flex-wrap gap-1">{person.coined_concepts.map(c => <Badge key={c} variant="outline" className="text-xs bg-primary/10 text-primary">{c}</Badge>)}</div>
      </div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Quotes ({personQuotes.length})</div>
        <div className="space-y-2">
          {personQuotes.map(q => (
            <div key={q.id} className="border-l-2 border-border pl-3 py-1">
              <p className="text-foreground/80 text-xs italic">«{q.text}»</p>
              <div className="text-[10px] text-muted-foreground mt-1">{q.source_article} · {q.year}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PipelineRunDetail({ run }: { run: PipelineRun }) {
  return (
    <>
      <div className="text-foreground font-medium font-mono">{run.batch_id}</div>
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className={cn('text-[10px]', statusColor[run.status])}>{run.status}</Badge>
        <span className="text-xs text-muted-foreground">{formatDuration(run.duration_seconds)}</span>
      </div>
      <Separator />
      <div className="space-y-2">
        {Object.entries(run.metrics).map(([key, val]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{key.replace(/_/g, ' ')}</span>
            <span className="text-foreground font-mono">{val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════
// MAIN ADMIN PAGE
// ══════════════════════════════════════════
export default function Admin() {
  const [view, setView] = useState<ActiveView>({ kind: 'dashboard' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [detailPanel, setDetailPanel] = useState<{ type: string; data: unknown } | null>(null);

  const navigateTo = (v: ActiveView) => { setView(v); setDetailPanel(null); };

  const isActive = (v: ActiveView) => {
    if (v.kind !== view.kind) return false;
    if (v.kind === 'dashboard') return true;
    if (v.kind === 'system' && view.kind === 'system') return v.section === view.section;
    if (v.kind === 'user' && view.kind === 'user') return v.userId === view.userId;
    return false;
  };

  // Render main content
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
        }
        break;
      case 'user': {
        const user = mockUsers.find(u => u.id === view.userId);
        if (!user) return <div className="text-muted-foreground">User not found</div>;
        return <UserDetailPage user={user} activeTab={view.tab} onTabChange={tab => setView({ ...view, tab })} />;
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
            <div className="text-foreground font-medium">{s.name}</div>
            <a href={s.url} target="_blank" rel="noopener" className="text-xs text-blue-400 break-all">{s.url}</a>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-[10px]">{s.feed_group}</Badge>
              <Badge variant="outline" className={cn('text-[10px]', tierColor[s.tier])}>Tier {s.tier}</Badge>
              <Badge variant="outline" className={cn('text-[10px]', statusColor[s.status])}>{s.status}</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-muted-foreground">Topics:</span><span className="text-foreground">{s.topics_covered}</span>
              <span className="text-muted-foreground">48h articles:</span><span className="text-foreground">{s.articles_48h}</span>
              <span className="text-muted-foreground">Last fetched:</span><span className="text-foreground">{relativeTime(s.fetched_at)}</span>
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
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className={cn('border-r border-border bg-card flex flex-col shrink-0 transition-all duration-200', sidebarOpen ? 'w-[220px]' : 'w-[52px]')}>
        <div className="h-12 flex items-center justify-between px-3 border-b border-border">
          {sidebarOpen && <span className="text-sm font-semibold text-foreground tracking-tight">Strata Admin</span>}
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => navigateTo({ kind: 'dashboard' })}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                view.kind === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            {/* System section */}
            {sidebarOpen && (
              <button
                onClick={() => setSystemOpen(!systemOpen)}
                className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors mt-3"
              >
                <span>System</span>
                {systemOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
            {(systemOpen || !sidebarOpen) && SYSTEM_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo({ kind: 'system', section: item.id })}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                  isActive({ kind: 'system', section: item.id }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  sidebarOpen && 'pl-4'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}

            {/* Users section */}
            {sidebarOpen && (
              <button
                onClick={() => setUsersOpen(!usersOpen)}
                className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors mt-3"
              >
                <span>Users</span>
                {usersOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => { if (mockUsers[0]) navigateTo({ kind: 'user', userId: mockUsers[0].id, tab: 'profile' }); }}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                  view.kind === 'user' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Users className="h-4 w-4 shrink-0" />
              </button>
            )}
            {usersOpen && sidebarOpen && mockUsers.map(user => (
              <div key={user.id}>
                <button
                  onClick={() => {
                    setExpandedUser(expandedUser === user.id ? null : user.id);
                    navigateTo({ kind: 'user', userId: user.id, tab: 'profile' });
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-md px-4 py-2 text-sm transition-colors',
                    view.kind === 'user' && view.userId === user.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">{user.name[0]}</div>
                  <span className="truncate">{user.name}</span>
                </button>
                {expandedUser === user.id && view.kind === 'user' && (
                  <div className="ml-6 space-y-0.5 mt-0.5">
                    {USER_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => navigateTo({ kind: 'user', userId: user.id, tab: tab.id })}
                        className={cn(
                          'w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                          view.kind === 'user' && view.tab === tab.id
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <tab.icon className="h-3 w-3 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1">
          <div className={cn('max-w-[1200px]', view.kind === 'user' ? '' : 'p-6')}>
            {renderContent()}
          </div>
        </ScrollArea>
        {renderDetail()}
      </div>
    </div>
  );
}
