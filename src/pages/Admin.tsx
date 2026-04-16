import { useState } from 'react';
import { 
  BarChart3, CreditCard, Layers, FolderTree, Radio, User, Quote, Users, 
  Activity, Bell, Settings, ChevronLeft, ChevronRight, Search, ExternalLink,
  Check, X, ArrowUpDown, ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  mockFeedCards, mockClusters, mockRSSSources, mockPersons, mockQuotes, 
  mockUsers, mockPipelineRuns, mockUserEvents, mockCategories, mockSettings,
  type FeedCard, type EventCluster, type RSSSource, type Person, type Quote as QuoteType,
  type UserProfile, type PipelineRun, type UserEvent, type CategoryTree
} from '@/components/admin/mockData';

type Section = 'dashboard' | 'cards' | 'clusters' | 'categories' | 'sources' | 'persons' | 'quotes' | 'users' | 'runs' | 'events' | 'settings';

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'cards', label: 'Feed Cards', icon: CreditCard },
  { id: 'clusters', label: 'Event Clusters', icon: Layers },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'sources', label: 'RSS Sources', icon: Radio },
  { id: 'persons', label: 'Persons', icon: User },
  { id: 'quotes', label: 'Quotes', icon: Quote },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'runs', label: 'Pipeline Runs', icon: Activity },
  { id: 'events', label: 'User Events', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
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

// ── Detail Panel ──
function DetailPanel({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="w-[420px] border-l border-border bg-card flex flex-col shrink-0">
      <div className="h-12 flex items-center justify-between px-4 border-b border-border">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 text-sm">{children}</div>
      </ScrollArea>
    </div>
  );
}

// ── KPI Card ──
function KPICard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

// ── Dashboard ──
function DashboardSection() {
  const cardsToday = mockFeedCards.filter(c => {
    const d = new Date(c.created_at);
    const now = new Date();
    return now.getTime() - d.getTime() < 86400000;
  }).length;
  const activeClusters = mockClusters.filter(c => c.status === 'open').length;
  const activeRSS = mockRSSSources.filter(s => s.status === 'active').length;
  const totalRSS = mockRSSSources.length;
  const lastRun = mockPipelineRuns[0];
  const quoteHitRate = lastRun ? Math.round((lastRun.metrics.quotes_attached / lastRun.metrics.cards_saved) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Cards Today" value={cardsToday} sub="last 24h" />
        <KPICard label="Active Clusters" value={activeClusters} />
        <KPICard label="RSS Health" value={`${activeRSS}/${totalRSS}`} sub="active feeds" />
        <KPICard label="Quote Hit Rate" value={`${quoteHitRate}%`} sub="last pipeline run" />
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Latest Cards</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Slot</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Signal</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Sources</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Quote</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {mockFeedCards.slice(0, 5).map(card => (
                <tr key={card.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2"><Badge variant="outline" className={cn('text-[10px]', slotColor[card.slot])}>{card.slot}</Badge></td>
                  <td className="px-3 py-2 text-foreground max-w-[300px] truncate">{card.signal_text.slice(0, 80)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{card.sources.length}</td>
                  <td className="px-3 py-2">{card.quote ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-3 py-2 text-muted-foreground text-xs">{relativeTime(card.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Pipeline Runs</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Batch</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Ingested</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Cards</th>
              </tr>
            </thead>
            <tbody>
              {mockPipelineRuns.slice(0, 3).map(run => (
                <tr key={run.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-foreground">{run.batch_id}</td>
                  <td className="px-3 py-2"><Badge variant="outline" className={cn('text-[10px]', statusColor[run.status])}>{run.status}</Badge></td>
                  <td className="px-3 py-2 text-muted-foreground text-xs">{formatDuration(run.duration_seconds)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{run.metrics.ingested}</td>
                  <td className="px-3 py-2 text-muted-foreground">{run.metrics.cards_saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Feed Cards Section ──
function FeedCardsSection({ onSelect }: { onSelect: (card: FeedCard) => void }) {
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const filtered = slotFilter === 'all' ? mockFeedCards : mockFeedCards.filter(c => c.slot === slotFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Feed Cards</h2>
        <div className="flex items-center gap-2">
          {['all', 'now', 'deep', 'bridge', 'challenge'].map(s => (
            <Button key={s} size="sm" variant={slotFilter === s ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setSlotFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Slot</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Signal</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Sources</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Words</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Quote</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[100px]">Cluster</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Created</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Read</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(card => (
              <tr key={card.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(card)}>
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', slotColor[card.slot])}>{card.slot}</Badge></td>
                <td className="px-3 py-2.5 text-foreground truncate max-w-[350px]">{card.signal_text.slice(0, 100)}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{card.sources.length}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{card.word_count}</td>
                <td className="px-3 py-2.5 text-center">{card.quote ? <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-3 py-2.5 text-xs text-blue-400 truncate max-w-[100px]">{card.cluster_topic}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(card.created_at)}</td>
                <td className="px-3 py-2.5 text-center">{card.read_at ? <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedCardDetail({ card }: { card: FeedCard }) {
  return (
    <>
      <Badge variant="outline" className={cn('text-xs w-fit', slotColor[card.slot])}>{card.slot.toUpperCase()}</Badge>
      <div>
        <div className="text-xs text-muted-foreground mb-1">SIGNAL</div>
        <p className="text-foreground leading-relaxed">{card.signal_text}</p>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">WHY</div>
        <p className="text-foreground/80 leading-relaxed">{card.why_text}</p>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">BODY</div>
        <p className="text-foreground/70 leading-relaxed">{card.body}</p>
      </div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Sources ({card.sources.length})</div>
        {card.sources.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs mb-1.5">
            <ExternalLink className="h-3 w-3 shrink-0" />{s.title}
          </a>
        ))}
      </div>
      {card.quote && (
        <>
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground mb-2">Quote</div>
            <blockquote className="border-l-2 border-primary/50 pl-3 text-foreground/80 italic">«{card.quote.text}»</blockquote>
            <div className="text-xs text-muted-foreground mt-1">{card.quote.person} · sim={card.quote.similarity}</div>
          </div>
        </>
      )}
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Cluster</div>
        <div className="text-blue-400 text-xs">{card.cluster_topic} (id: {card.cluster_id})</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Meta</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="text-muted-foreground">collision:</span><span className="text-foreground">{card.collision_type}</span>
          <span className="text-muted-foreground">cosine:</span><span className="text-foreground">{card.cosine_score}</span>
          <span className="text-muted-foreground">graph:</span><span className="text-foreground">{card.graph_score}</span>
          <span className="text-muted-foreground">composite:</span><span className="text-foreground">{card.composite_score}</span>
          <span className="text-muted-foreground">batch:</span><span className="text-foreground font-mono">{card.batch_id}</span>
          <span className="text-muted-foreground">created:</span><span className="text-foreground">{new Date(card.created_at).toLocaleString()}</span>
          {card.read_at && <><span className="text-muted-foreground">read_at:</span><span className="text-foreground">{new Date(card.read_at).toLocaleString()}</span></>}
        </div>
      </div>
    </>
  );
}

// ── Event Clusters ──
function ClustersSection({ onSelect }: { onSelect: (c: EventCluster) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filtered = statusFilter === 'all' ? mockClusters : mockClusters.filter(c => c.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Event Clusters</h2>
        <div className="flex items-center gap-2">
          {['all', 'open', 'archived'].map(s => (
            <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setStatusFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Topic</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Articles</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Status</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Sources</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Evolved</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Opened</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cl => (
              <tr key={cl.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(cl)}>
                <td className="px-3 py-2.5 text-foreground truncate max-w-[250px]">{cl.topic_text}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{cl.n_articles}</td>
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[cl.status])}>{cl.status}</Badge></td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{cl.feed_groups.length}</td>
                <td className="px-3 py-2.5 text-center">{cl.first_batch_id !== cl.last_batch_id ? <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(cl.opened_at)}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(cl.last_seen_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClusterDetail({ cluster }: { cluster: EventCluster }) {
  return (
    <>
      <div>
        <div className="text-foreground font-medium">{cluster.topic_text}</div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className={cn('text-[10px]', statusColor[cluster.status])}>{cluster.status}</Badge>
          <span className="text-xs text-muted-foreground">{cluster.n_articles} articles</span>
          {cluster.first_batch_id !== cluster.last_batch_id && <Badge variant="outline" className="text-[10px] bg-purple-500/20 text-purple-400">evolved</Badge>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <span className="text-muted-foreground">First batch:</span><span className="text-foreground font-mono">{cluster.first_batch_id}</span>
        <span className="text-muted-foreground">Last batch:</span><span className="text-foreground font-mono">{cluster.last_batch_id}</span>
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

// ── Categories (tree) ──
function CategoriesSection() {
  const [selectedMC, setSelectedMC] = useState<CategoryTree | null>(mockCategories[0]);
  const [selectedL2, setSelectedL2] = useState<CategoryTree | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Categories</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Meta-categories */}
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
        {/* L2 Topics */}
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
        {/* L3 Topics */}
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

// ── RSS Sources ──
function SourcesSection({ onSelect }: { onSelect: (s: RSSSource) => void }) {
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const filtered = mockRSSSources.filter(s => {
    if (tierFilter !== 'all' && s.tier !== Number(tierFilter)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.url.toLowerCase().includes(search.toLowerCase())) return false;
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
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Group</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Tier</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Topics</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">48h Arts</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Fetched</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(s)}>
                <td className="px-3 py-2.5 text-foreground">{s.name}</td>
                <td className="px-3 py-2.5"><Badge variant="outline" className="text-[10px]">{s.feed_group}</Badge></td>
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', tierColor[s.tier])}>T{s.tier}</Badge></td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{s.topics_covered}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{s.articles_48h}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(s.fetched_at)}</td>
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[s.status])}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Persons ──
function PersonsSection({ onSelect }: { onSelect: (p: Person) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Persons</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Quotes</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Speaks On</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Publishes In</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {mockPersons.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(p)}>
                <td className="px-3 py-2.5 text-foreground font-medium">{p.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{p.quotes_count}</td>
                <td className="px-3 py-2.5"><div className="flex gap-1 flex-wrap">{p.speaks_on.slice(0, 3).map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}</div></td>
                <td className="px-3 py-2.5 text-xs text-blue-400">{p.publishes_in}</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{p.subscribed_by.join(', ') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PersonDetail({ person }: { person: Person }) {
  const personQuotes = mockQuotes.filter(q => q.person_id === person.id);
  return (
    <>
      <div className="text-foreground font-medium text-base">{person.name}</div>
      <div className="text-xs text-muted-foreground">Quotes: {person.quotes_count} · Publishes in: {person.publishes_in}</div>
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
              <div className="text-[10px] text-muted-foreground mt-1">{q.source_article} · {q.year} · used {q.used_in_cards}×</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Quotes ──
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
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[120px]">Person</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Quote</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[150px]">Source</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[50px]">Year</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Used</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2.5 text-foreground font-medium">{q.person_name}</td>
                <td className="px-3 py-2.5 text-foreground/80 italic truncate max-w-[400px]">«{q.text}»</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground truncate">{q.source_article}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{q.year}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{q.used_in_cards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Users ──
function UsersSection({ onSelect }: { onSelect: (u: UserProfile) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Users</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[100px]">Subscriptions</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[100px]">Cards Total</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Cards Read</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Events 7d</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[100px]">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => {
              const totalSubs = u.topic_subscriptions.reduce((a, g) => a + g.topics.length, 0) + u.person_subscriptions.length;
              return (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(u)}>
                  <td className="px-3 py-2.5 text-foreground font-medium">{u.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-center">{totalSubs}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-center">{u.cards_total}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-center">{u.cards_read}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-center">{u.events_7d}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(u.last_active)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserDetail({ user }: { user: UserProfile }) {
  return (
    <>
      <div className="text-foreground font-medium text-base">{user.name}</div>
      <div className="text-xs text-muted-foreground font-mono">{user.id}</div>
      <div className="text-xs text-muted-foreground">{user.language} · {user.timezone}</div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Topic Subscriptions</div>
        {user.topic_subscriptions.map(g => (
          <div key={g.mc} className="mb-2">
            <div className="text-xs text-foreground/60 mb-1">{g.mc}:</div>
            <div className="flex flex-wrap gap-1">{g.topics.map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Person Subscriptions</div>
        <div className="flex flex-wrap gap-1">{user.person_subscriptions.map(p => <Badge key={p} variant="outline" className="text-[9px] bg-primary/10 text-primary">{p}</Badge>)}</div>
      </div>
      <Separator />
      <div>
        <div className="text-xs text-muted-foreground mb-2">Preferences</div>
        <div className="text-xs"><span className="text-emerald-400">Likes:</span> {user.likes.join(', ')}</div>
        <div className="text-xs mt-1"><span className="text-red-400">Dislikes:</span> {user.dislikes.join(', ')}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Delivery</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="text-muted-foreground">Max cards:</span><span className="text-foreground">{user.max_cards}</span>
          <span className="text-muted-foreground">Slots:</span><span className="text-foreground">now={user.slots.now}, deep={user.slots.deep}, bridge={user.slots.bridge}, ch={user.slots.challenge}</span>
          <span className="text-muted-foreground">Cron:</span><span className="text-foreground">{user.cron.join(', ')} UTC</span>
        </div>
      </div>
    </>
  );
}

// ── Pipeline Runs ──
function PipelineRunsSection({ onSelect }: { onSelect: (r: PipelineRun) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Pipeline Runs</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Batch ID</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Status</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Duration</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Ingested</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">Passed</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[80px]">Clusters</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Cards</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[60px]">Quotes</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Started</th>
            </tr>
          </thead>
          <tbody>
            {mockPipelineRuns.map(run => (
              <tr key={run.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => onSelect(run)}>
                <td className="px-3 py-2.5 font-mono text-xs text-foreground">{run.batch_id}</td>
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColor[run.status])}>{run.status}</Badge></td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{formatDuration(run.duration_seconds)}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.ingested}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.quality_passed}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center text-xs">{run.metrics.clusters_joined}+{run.metrics.clusters_new}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.cards_saved}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-center">{run.metrics.quotes_attached}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(run.started_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
      <Separator />
      <div className="grid grid-cols-2 gap-1 text-xs">
        <span className="text-muted-foreground">Started:</span><span className="text-foreground">{new Date(run.started_at).toLocaleString()}</span>
        <span className="text-muted-foreground">Finished:</span><span className="text-foreground">{new Date(run.finished_at).toLocaleString()}</span>
      </div>
    </>
  );
}

// ── User Events ──
function UserEventsSection() {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const filtered = actionFilter === 'all' ? mockUserEvents : mockUserEvents.filter(e => e.action === actionFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">User Events</h2>
        <div className="flex items-center gap-2">
          {['all', 'read', 'save', 'skip', 'deep_dive', 'dismiss'].map(a => (
            <Button key={a} size="sm" variant={actionFilter === a ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setActionFilter(a)}>
              {a}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Action</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Card Signal</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[130px]">Cluster</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[70px]">User</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[90px]">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', actionColor[ev.action])}>{ev.action}</Badge></td>
                <td className="px-3 py-2.5 text-foreground truncate max-w-[300px]">{ev.card_signal.slice(0, 80)}</td>
                <td className="px-3 py-2.5 text-xs text-blue-400 truncate">{ev.cluster_topic}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{ev.user_name}</td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{relativeTime(ev.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Settings ──
function SettingsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <Button variant="outline" size="sm" className="text-xs h-7">
          <ExternalLink className="h-3 w-3 mr-1" /> Edit on server
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <pre className="p-4 text-xs text-foreground/80 font-mono overflow-auto max-h-[600px]">
          {JSON.stringify(mockSettings, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ── Main Admin Page ──
export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailPanel, setDetailPanel] = useState<{ type: string; data: unknown } | null>(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardSection />;
      case 'cards': return <FeedCardsSection onSelect={c => setDetailPanel({ type: 'card', data: c })} />;
      case 'clusters': return <ClustersSection onSelect={c => setDetailPanel({ type: 'cluster', data: c })} />;
      case 'categories': return <CategoriesSection />;
      case 'sources': return <SourcesSection onSelect={s => setDetailPanel({ type: 'source', data: s })} />;
      case 'persons': return <PersonsSection onSelect={p => setDetailPanel({ type: 'person', data: p })} />;
      case 'quotes': return <QuotesSection />;
      case 'users': return <UsersSection onSelect={u => setDetailPanel({ type: 'user', data: u })} />;
      case 'runs': return <PipelineRunsSection onSelect={r => setDetailPanel({ type: 'run', data: r })} />;
      case 'events': return <UserEventsSection />;
      case 'settings': return <SettingsSection />;
    }
  };

  const renderDetail = () => {
    if (!detailPanel) return null;
    const { type, data } = detailPanel;
    switch (type) {
      case 'card': return <DetailPanel title="Feed Card" onClose={() => setDetailPanel(null)}><FeedCardDetail card={data as FeedCard} /></DetailPanel>;
      case 'cluster': return <DetailPanel title="Cluster" onClose={() => setDetailPanel(null)}><ClusterDetail cluster={data as EventCluster} /></DetailPanel>;
      case 'source': return (
        <DetailPanel title="RSS Source" onClose={() => setDetailPanel(null)}>
          {(() => { const s = data as RSSSource; return (
            <>
              <div className="text-foreground font-medium">{s.name}</div>
              <a href={s.url} target="_blank" rel="noopener" className="text-xs text-blue-400 break-all">{s.url}</a>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-[10px]">{s.feed_group}</Badge>
                <Badge variant="outline" className={cn('text-[10px]', tierColor[s.tier])}>Tier {s.tier}</Badge>
                <Badge variant="outline" className={cn('text-[10px]', statusColor[s.status])}>{s.status}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-muted-foreground">Topics covered:</span><span className="text-foreground">{s.topics_covered}</span>
                <span className="text-muted-foreground">Articles (48h):</span><span className="text-foreground">{s.articles_48h}</span>
                <span className="text-muted-foreground">Last fetched:</span><span className="text-foreground">{relativeTime(s.fetched_at)}</span>
              </div>
            </>
          ); })()}
        </DetailPanel>
      );
      case 'person': return <DetailPanel title="Person" onClose={() => setDetailPanel(null)}><PersonDetail person={data as Person} /></DetailPanel>;
      case 'user': return <DetailPanel title="User" onClose={() => setDetailPanel(null)}><UserDetail user={data as UserProfile} /></DetailPanel>;
      case 'run': return <DetailPanel title="Pipeline Run" onClose={() => setDetailPanel(null)}><PipelineRunDetail run={data as PipelineRun} /></DetailPanel>;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className={cn('border-r border-border bg-card flex flex-col shrink-0 transition-all duration-200', sidebarOpen ? 'w-[200px]' : 'w-[52px]')}>
        <div className="h-12 flex items-center justify-between px-3 border-b border-border">
          {sidebarOpen && <span className="text-sm font-semibold text-foreground tracking-tight">Strata Admin</span>}
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-0.5 px-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setDetailPanel(null); }}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                  activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-[1200px]">
            {renderSection()}
          </div>
        </ScrollArea>
        {renderDetail()}
      </div>
    </div>
  );
}
