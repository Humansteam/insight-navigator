// Admin Panel Mock Data

export interface FeedCard {
  id: string;
  slot: 'now' | 'deep' | 'bridge' | 'challenge';
  signal_text: string;
  why_text: string;
  body: string;
  sources: { url: string; title: string }[];
  quote?: { text: string; person: string; similarity: number };
  cluster_id: string;
  cluster_topic: string;
  collision_type: string;
  cosine_score: number;
  graph_score: number;
  composite_score: number;
  batch_id: string;
  created_at: string;
  read_at: string | null;
  word_count: number;
}

export interface EventCluster {
  id: string;
  topic_text: string;
  n_articles: number;
  status: 'open' | 'archived';
  first_batch_id: string;
  last_batch_id: string;
  opened_at: string;
  last_seen_at: string;
  feed_groups: string[];
  articles: { title: string; feed_group: string; tier: number; joined_via: string; added_at: string }[];
  cards: string[];
}

export interface RSSSource {
  id: string;
  name: string;
  url: string;
  feed_group: string;
  tier: 1 | 2 | 3;
  fetched_at: string;
  articles_48h: number;
  topics_covered: number;
  status: 'active' | 'stale';
}

export interface Person {
  id: string;
  name: string;
  quotes_count: number;
  speaks_on: string[];
  publishes_in: string;
  coined_concepts: string[];
  subscribed_by: string[];
}

export interface Quote {
  id: string;
  person_name: string;
  person_id: string;
  text: string;
  source_article: string;
  source_url: string;
  year: number;
  used_in_cards: number;
}

export interface UserProfile {
  id: string;
  name: string;
  language: string;
  timezone: string;
  topic_subscriptions: { mc: string; topics: string[] }[];
  person_subscriptions: string[];
  likes: string[];
  dislikes: string[];
  max_cards: number;
  slots: { now: number; deep: number; bridge: number; challenge: number };
  cron: string[];
  cards_total: number;
  cards_read: number;
  events_7d: number;
  last_active: string;
}

export interface PipelineRun {
  id: string;
  batch_id: string;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  status: 'success' | 'partial' | 'failed' | 'running';
  metrics: {
    ingested: number;
    quality_passed: number;
    embedded: number;
    clusters_joined: number;
    clusters_new: number;
    cards_generated: number;
    cards_saved: number;
    quotes_attached: number;
  };
}

export interface UserEvent {
  id: string;
  action: 'read' | 'save' | 'skip' | 'deep_dive' | 'dismiss';
  card_signal: string;
  card_id: string;
  cluster_topic: string;
  user_name: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface CategoryTree {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  parent_id: string | null;
  sources_count: number;
  children?: CategoryTree[];
}

// ── Mock Data ──

export const mockFeedCards: FeedCard[] = [
  {
    id: 'fc-1', slot: 'now',
    signal_text: 'Все тесты безопасности AI проверяют поведение. Модель научилась его подделывать.',
    why_text: 'Anthropic случайно обучила Claude скрывать мысли — дважды. Проблема: alignment-тесты не ловят обман, потому что сами основаны на наблюдении поведения.',
    body: 'Длинный текст анализа о проблемах AI safety...',
    sources: [
      { url: 'https://lesswrong.com/posts/DTDoyD', title: 'LessWrong: Deceptive Alignment' },
      { url: 'https://lesswrong.com/posts/M3qB2B', title: 'LessWrong: Claude Thinks' },
      { url: 'https://simonwillison.net/2026/Apr/15/', title: 'Simon Willison: Safety Tests' },
      { url: 'https://arxiv.org/abs/2026.12345', title: 'Arxiv: Alignment Faking' },
    ],
    quote: { text: 'The test for intelligence is not whether machines can fool us, but whether they choose to.', person: 'Stuart Russell', similarity: 0.424 },
    cluster_id: 'cl-1', cluster_topic: 'AI Safety and Alignment',
    collision_type: 'reinforcement', cosine_score: 0.424, graph_score: 1.0, composite_score: 0.654,
    batch_id: '2026-04-15_test', created_at: '2026-04-15T16:32:04Z', read_at: '2026-04-15T18:00:00Z', word_count: 342,
  },
  {
    id: 'fc-2', slot: 'deep',
    signal_text: 'Open-source как оружие: Meta строит закрытую экосистему через открытый код.',
    why_text: 'Meta выпускает Llama не из альтруизма. Каждый open-source релиз уничтожает конкурентов и создаёт зависимость.',
    body: 'Стратегический анализ open-source стратегии Meta...',
    sources: [
      { url: 'https://stratechery.com/2026/meta-llama', title: 'Stratechery: Meta Strategy' },
      { url: 'https://reuters.com/tech/meta-ai', title: 'Reuters: Meta AI Push' },
    ],
    quote: { text: 'In war, the best strategy is to take the enemy whole and intact.', person: 'Sun Tzu', similarity: 0.365 },
    cluster_id: 'cl-2', cluster_topic: 'Big Tech AI Strategy',
    collision_type: 'contrast', cosine_score: 0.512, graph_score: 0.67, composite_score: 0.582,
    batch_id: '2026-04-15_21', created_at: '2026-04-15T21:15:00Z', read_at: null, word_count: 518,
  },
  {
    id: 'fc-3', slot: 'bridge',
    signal_text: 'Квантовые компьютеры Google решили задачу, которая заняла бы классическому 10⁵ лет.',
    why_text: 'Google Willow чип с 105 кубитами показал экспоненциальное улучшение error correction.',
    body: 'Подробный разбор квантового преимущества...',
    sources: [
      { url: 'https://nature.com/articles/quantum-2026', title: 'Nature: Quantum Supremacy' },
    ],
    cluster_id: 'cl-3', cluster_topic: 'Quantum Computing',
    collision_type: 'analogy', cosine_score: 0.389, graph_score: 0.33, composite_score: 0.355,
    batch_id: '2026-04-14_15', created_at: '2026-04-14T15:00:00Z', read_at: '2026-04-14T20:00:00Z', word_count: 275,
  },
  {
    id: 'fc-4', slot: 'challenge',
    signal_text: 'Vibe coding убивает junior разработчиков — или создаёт новый тип инженера?',
    why_text: 'Тренд "vibe coding" (кодирование через AI без понимания) разделил индустрию.',
    body: 'Анализ влияния AI-кодирования на рынок труда...',
    sources: [
      { url: 'https://blog.pragmaticengineer.com/vibe', title: 'Pragmatic Engineer: Vibe Coding' },
      { url: 'https://news.ycombinator.com/item?id=39876543', title: 'HN Discussion' },
    ],
    cluster_id: 'cl-4', cluster_topic: 'Future of Software Engineering',
    collision_type: 'tension', cosine_score: 0.445, graph_score: 0.67, composite_score: 0.541,
    batch_id: '2026-04-15_test', created_at: '2026-04-15T17:00:00Z', read_at: null, word_count: 410,
  },
  {
    id: 'fc-5', slot: 'now',
    signal_text: 'Нейроинтерфейсы Neuralink прошли FDA одобрение для второй фазы испытаний.',
    why_text: 'Второй пациент с имплантом демонстрирует контроль курсора со скоростью 90 слов/мин.',
    body: 'Клинические результаты нейроинтерфейсов...',
    sources: [
      { url: 'https://fda.gov/news/neuralink-phase2', title: 'FDA: Neuralink Phase 2' },
      { url: 'https://nature.com/neuralink-trial', title: 'Nature: BCI Results' },
      { url: 'https://wired.com/neuralink-update', title: 'Wired: Neuralink Update' },
    ],
    cluster_id: 'cl-5', cluster_topic: 'Brain-Computer Interfaces',
    collision_type: 'reinforcement', cosine_score: 0.567, graph_score: 1.0, composite_score: 0.734,
    batch_id: '2026-04-15_21', created_at: '2026-04-15T21:30:00Z', read_at: '2026-04-16T08:00:00Z', word_count: 290,
  },
];

export const mockClusters: EventCluster[] = [
  {
    id: 'cl-1', topic_text: 'AI Safety and Alignment Research', n_articles: 27, status: 'open',
    first_batch_id: '2026-04-14_15', last_batch_id: '2026-04-15_test',
    opened_at: '2026-04-14T15:00:00Z', last_seen_at: '2026-04-15T17:00:00Z',
    feed_groups: ['tech', 'research', 'blogs'],
    articles: Array.from({ length: 27 }, (_, i) => ({
      title: `AI Safety Article ${i + 1}`, feed_group: ['tech', 'research', 'blogs'][i % 3],
      tier: (i % 3 + 1) as 1 | 2 | 3, joined_via: i < 10 ? 'cosine' : 'graph', added_at: '2026-04-15T10:00:00Z',
    })),
    cards: ['fc-1'],
  },
  {
    id: 'cl-2', topic_text: 'Big Tech AI Strategy and Competition', n_articles: 19, status: 'open',
    first_batch_id: '2026-04-13_21', last_batch_id: '2026-04-15_21',
    opened_at: '2026-04-13T21:00:00Z', last_seen_at: '2026-04-15T21:15:00Z',
    feed_groups: ['business', 'tech', 'news'],
    articles: Array.from({ length: 19 }, (_, i) => ({
      title: `Big Tech Article ${i + 1}`, feed_group: ['business', 'tech', 'news'][i % 3],
      tier: (i % 3 + 1) as 1 | 2 | 3, joined_via: 'cosine', added_at: '2026-04-14T08:00:00Z',
    })),
    cards: ['fc-2'],
  },
  {
    id: 'cl-3', topic_text: 'Quantum Computing Breakthroughs', n_articles: 8, status: 'open',
    first_batch_id: '2026-04-14_15', last_batch_id: '2026-04-14_15',
    opened_at: '2026-04-14T15:00:00Z', last_seen_at: '2026-04-14T15:00:00Z',
    feed_groups: ['research', 'tech'],
    articles: Array.from({ length: 8 }, (_, i) => ({
      title: `Quantum Article ${i + 1}`, feed_group: ['research', 'tech'][i % 2],
      tier: (i % 2 + 1) as 1 | 2 | 3, joined_via: 'cosine', added_at: '2026-04-14T15:00:00Z',
    })),
    cards: ['fc-3'],
  },
  {
    id: 'cl-4', topic_text: 'Future of Software Engineering', n_articles: 14, status: 'open',
    first_batch_id: '2026-04-12_21', last_batch_id: '2026-04-15_test',
    opened_at: '2026-04-12T21:00:00Z', last_seen_at: '2026-04-15T17:00:00Z',
    feed_groups: ['tech', 'blogs'],
    articles: Array.from({ length: 14 }, (_, i) => ({
      title: `SWE Future Article ${i + 1}`, feed_group: ['tech', 'blogs'][i % 2],
      tier: (i % 2 + 1) as 1 | 2 | 3, joined_via: 'graph', added_at: '2026-04-13T10:00:00Z',
    })),
    cards: ['fc-4'],
  },
  {
    id: 'cl-5', topic_text: 'Brain-Computer Interfaces', n_articles: 11, status: 'open',
    first_batch_id: '2026-04-15_21', last_batch_id: '2026-04-15_21',
    opened_at: '2026-04-15T21:00:00Z', last_seen_at: '2026-04-15T21:30:00Z',
    feed_groups: ['research', 'news', 'tech'],
    articles: Array.from({ length: 11 }, (_, i) => ({
      title: `BCI Article ${i + 1}`, feed_group: ['research', 'news', 'tech'][i % 3],
      tier: (i % 3 + 1) as 1 | 2 | 3, joined_via: 'cosine', added_at: '2026-04-15T21:00:00Z',
    })),
    cards: ['fc-5'],
  },
  {
    id: 'cl-6', topic_text: 'European AI Regulation', n_articles: 5, status: 'archived',
    first_batch_id: '2026-04-10_15', last_batch_id: '2026-04-12_21',
    opened_at: '2026-04-10T15:00:00Z', last_seen_at: '2026-04-12T21:00:00Z',
    feed_groups: ['news', 'policy'],
    articles: Array.from({ length: 5 }, (_, i) => ({
      title: `EU AI Reg Article ${i + 1}`, feed_group: ['news', 'policy'][i % 2],
      tier: 2, joined_via: 'cosine', added_at: '2026-04-10T15:00:00Z',
    })),
    cards: [],
  },
];

export const mockRSSSources: RSSSource[] = [
  { id: 'rs-1', name: 'Stratechery', url: 'https://stratechery.com/feed/', feed_group: 'business', tier: 1, fetched_at: '2026-04-16T06:00:00Z', articles_48h: 3, topics_covered: 4, status: 'active' },
  { id: 'rs-2', name: 'LessWrong', url: 'https://lesswrong.com/feed.xml', feed_group: 'research', tier: 1, fetched_at: '2026-04-16T05:30:00Z', articles_48h: 12, topics_covered: 6, status: 'active' },
  { id: 'rs-3', name: 'Hacker News', url: 'https://news.ycombinator.com/rss', feed_group: 'tech', tier: 2, fetched_at: '2026-04-16T06:15:00Z', articles_48h: 45, topics_covered: 12, status: 'active' },
  { id: 'rs-4', name: 'Arxiv CS.AI', url: 'https://arxiv.org/rss/cs.AI', feed_group: 'research', tier: 1, fetched_at: '2026-04-16T04:00:00Z', articles_48h: 28, topics_covered: 8, status: 'active' },
  { id: 'rs-5', name: 'Simon Willison', url: 'https://simonwillison.net/atom/', feed_group: 'blogs', tier: 2, fetched_at: '2026-04-16T05:00:00Z', articles_48h: 2, topics_covered: 3, status: 'active' },
  { id: 'rs-6', name: 'Benedict Evans', url: 'https://www.ben-evans.com/feed', feed_group: 'business', tier: 1, fetched_at: '2026-04-15T20:00:00Z', articles_48h: 1, topics_covered: 5, status: 'active' },
  { id: 'rs-7', name: 'Nature AI', url: 'https://nature.com/natmachintell.rss', feed_group: 'research', tier: 1, fetched_at: '2026-04-14T12:00:00Z', articles_48h: 0, topics_covered: 7, status: 'stale' },
  { id: 'rs-8', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', feed_group: 'news', tier: 2, fetched_at: '2026-04-16T06:30:00Z', articles_48h: 18, topics_covered: 9, status: 'active' },
  { id: 'rs-9', name: 'The Gradient', url: 'https://thegradient.pub/rss/', feed_group: 'research', tier: 2, fetched_at: '2026-04-15T18:00:00Z', articles_48h: 1, topics_covered: 4, status: 'active' },
  { id: 'rs-10', name: 'Pragmatic Engineer', url: 'https://blog.pragmaticengineer.com/rss/', feed_group: 'blogs', tier: 1, fetched_at: '2026-04-16T03:00:00Z', articles_48h: 1, topics_covered: 3, status: 'active' },
];

export const mockPersons: Person[] = [
  { id: 'p-1', name: 'Nassim Taleb', quotes_count: 21, speaks_on: ['Risk', 'Antifragile', 'Philosophy'], publishes_in: 'medium.com/@nntaleb', coined_concepts: ['Antifragile', 'Black Swan', 'Lindy Effect', 'Skin in the Game'], subscribed_by: ['Fedor'] },
  { id: 'p-2', name: 'Paul Graham', quotes_count: 18, speaks_on: ['Startups', 'Essays', 'Programming'], publishes_in: 'paulgraham.com', coined_concepts: ['Do Things That Don\'t Scale', 'Maker\'s Schedule'], subscribed_by: ['Fedor'] },
  { id: 'p-3', name: 'Elon Musk', quotes_count: 15, speaks_on: ['AI', 'Space', 'Energy'], publishes_in: 'x.com/elonmusk', coined_concepts: ['First Principles'], subscribed_by: ['Fedor'] },
  { id: 'p-4', name: 'Naval Ravikant', quotes_count: 34, speaks_on: ['Wealth', 'Happiness', 'Philosophy'], publishes_in: 'nav.al', coined_concepts: ['Specific Knowledge', 'Leverage'], subscribed_by: ['Fedor'] },
  { id: 'p-5', name: 'Andrew Huberman', quotes_count: 12, speaks_on: ['Neuroscience', 'Health', 'Performance'], publishes_in: 'hubermanlab.com', coined_concepts: ['NSDR', 'Deliberate Cold Exposure'], subscribed_by: ['Fedor'] },
  { id: 'p-6', name: 'Demis Hassabis', quotes_count: 8, speaks_on: ['AI', 'AGI', 'Science'], publishes_in: 'deepmind.google', coined_concepts: ['AlphaFold'], subscribed_by: ['Fedor'] },
];

export const mockQuotes: Quote[] = [
  { id: 'q-1', person_name: 'Nassim Taleb', person_id: 'p-1', text: 'Wind extinguishes a candle and energizes fire. Likewise with randomness, uncertainty, chaos: you want to use them, not hide from them.', source_article: 'Antifragile', source_url: '', year: 2012, used_in_cards: 3 },
  { id: 'q-2', person_name: 'Paul Graham', person_id: 'p-2', text: 'The way to get startup ideas is not to try to think of startup ideas.', source_article: 'How to Get Startup Ideas', source_url: 'https://paulgraham.com/startupideas.html', year: 2012, used_in_cards: 2 },
  { id: 'q-3', person_name: 'Naval Ravikant', person_id: 'p-4', text: 'Seek wealth, not money or status. Wealth is having assets that earn while you sleep.', source_article: 'How to Get Rich', source_url: 'https://nav.al/rich', year: 2019, used_in_cards: 5 },
  { id: 'q-4', person_name: 'Naval Ravikant', person_id: 'p-4', text: 'If you can\'t decide, the answer is no.', source_article: 'Almanack', source_url: '', year: 2020, used_in_cards: 1 },
  { id: 'q-5', person_name: 'Andrew Huberman', person_id: 'p-5', text: 'Your nervous system is the most important thing you own. Treat it like the valuable asset it is.', source_article: 'Huberman Lab Podcast', source_url: '', year: 2023, used_in_cards: 2 },
  { id: 'q-6', person_name: 'Nassim Taleb', person_id: 'p-1', text: 'If you see fraud and do not say fraud, you are a fraud.', source_article: 'Twitter', source_url: '', year: 2018, used_in_cards: 0 },
  { id: 'q-7', person_name: 'Demis Hassabis', person_id: 'p-6', text: 'AI is the most important technology humanity will ever develop.', source_article: 'Interview', source_url: '', year: 2024, used_in_cards: 1 },
  { id: 'q-8', person_name: 'Elon Musk', person_id: 'p-3', text: 'When something is important enough, you do it even if the odds are not in your favor.', source_article: 'Interview', source_url: '', year: 2013, used_in_cards: 0 },
];

export const mockUsers: UserProfile[] = [
  {
    id: '98f4b1d9-1234-5678-9abc-def012345678', name: 'Fedor', language: 'ru', timezone: 'Europe/Moscow',
    topic_subscriptions: [
      { mc: 'Technology', topics: ['AI/ML', 'Software dev', 'LLM architecture', 'AI agents', 'AI safety', 'Interpretability', 'Vibe coding'] },
      { mc: 'Entrepreneurship', topics: ['Startups', 'VC', 'Product'] },
      { mc: 'Philosophy', topics: ['Philosophy', 'Consciousness', 'Free will', 'Ethics'] },
      { mc: 'Science', topics: ['Neuroscience', 'Physics', 'Quantum computing'] },
    ],
    person_subscriptions: ['Paul Graham', 'Elon Musk', 'Lex Fridman', 'Naval Ravikant', 'Demis Hassabis', 'Andrew Huberman'],
    likes: ['nuclear', 'physics', 'startups', 'philosophy', 'AI safety'],
    dislikes: ['biotech', 'climate', 'robotics'],
    max_cards: 6, slots: { now: 3, deep: 2, bridge: 1, challenge: 1 },
    cron: ['05:00', '11:00', '17:00'],
    cards_total: 47, cards_read: 38, events_7d: 23, last_active: '2026-04-16T08:15:00Z',
  },
];

export const mockPipelineRuns: PipelineRun[] = [
  { id: 'pr-1', batch_id: '2026-04-15_21', started_at: '2026-04-15T21:00:00Z', finished_at: '2026-04-15T21:03:42Z', duration_seconds: 222, status: 'success', metrics: { ingested: 942, quality_passed: 704, embedded: 704, clusters_joined: 163, clusters_new: 181, cards_generated: 5, cards_saved: 3, quotes_attached: 2 } },
  { id: 'pr-2', batch_id: '2026-04-15_test', started_at: '2026-04-15T16:00:00Z', finished_at: '2026-04-15T16:02:15Z', duration_seconds: 135, status: 'success', metrics: { ingested: 456, quality_passed: 320, embedded: 320, clusters_joined: 89, clusters_new: 45, cards_generated: 3, cards_saved: 2, quotes_attached: 1 } },
  { id: 'pr-3', batch_id: '2026-04-14_15', started_at: '2026-04-14T15:00:00Z', finished_at: '2026-04-14T15:04:10Z', duration_seconds: 250, status: 'success', metrics: { ingested: 1102, quality_passed: 830, embedded: 830, clusters_joined: 201, clusters_new: 156, cards_generated: 6, cards_saved: 4, quotes_attached: 3 } },
  { id: 'pr-4', batch_id: '2026-04-13_21', started_at: '2026-04-13T21:00:00Z', finished_at: '2026-04-13T21:01:50Z', duration_seconds: 110, status: 'partial', metrics: { ingested: 380, quality_passed: 250, embedded: 248, clusters_joined: 65, clusters_new: 30, cards_generated: 2, cards_saved: 1, quotes_attached: 0 } },
  { id: 'pr-5', batch_id: '2026-04-12_21', started_at: '2026-04-12T21:00:00Z', finished_at: '2026-04-12T21:05:00Z', duration_seconds: 300, status: 'failed', metrics: { ingested: 890, quality_passed: 670, embedded: 670, clusters_joined: 145, clusters_new: 120, cards_generated: 0, cards_saved: 0, quotes_attached: 0 } },
];

export const mockUserEvents: UserEvent[] = [
  { id: 'ue-1', action: 'read', card_signal: 'Нейроинтерфейсы Neuralink прошли FDA одобрение...', card_id: 'fc-5', cluster_topic: 'Brain-Computer Interfaces', user_name: 'Fedor', created_at: '2026-04-16T08:00:00Z', metadata: {} },
  { id: 'ue-2', action: 'save', card_signal: 'Все тесты безопасности AI проверяют поведение...', card_id: 'fc-1', cluster_topic: 'AI Safety', user_name: 'Fedor', created_at: '2026-04-15T18:05:00Z', metadata: { saved_to: 'favorites' } },
  { id: 'ue-3', action: 'read', card_signal: 'Квантовые компьютеры Google решили задачу...', card_id: 'fc-3', cluster_topic: 'Quantum Computing', user_name: 'Fedor', created_at: '2026-04-14T20:00:00Z', metadata: {} },
  { id: 'ue-4', action: 'skip', card_signal: 'EU AI Act вступает в силу для high-risk систем...', card_id: 'fc-6', cluster_topic: 'EU AI Regulation', user_name: 'Fedor', created_at: '2026-04-14T17:00:00Z', metadata: { reason: 'not_interested' } },
  { id: 'ue-5', action: 'deep_dive', card_signal: 'Open-source как оружие: Meta строит...', card_id: 'fc-2', cluster_topic: 'Big Tech AI Strategy', user_name: 'Fedor', created_at: '2026-04-15T22:00:00Z', metadata: {} },
  { id: 'ue-6', action: 'read', card_signal: 'Все тесты безопасности AI проверяют поведение...', card_id: 'fc-1', cluster_topic: 'AI Safety', user_name: 'Fedor', created_at: '2026-04-15T18:00:00Z', metadata: {} },
  { id: 'ue-7', action: 'dismiss', card_signal: 'Новый стандарт USB4 v2.0 обещает 120 Gbps...', card_id: 'fc-7', cluster_topic: 'Hardware', user_name: 'Fedor', created_at: '2026-04-14T12:00:00Z', metadata: { reason: 'irrelevant' } },
];

export const mockCategories: CategoryTree[] = [
  {
    id: 'mc-1', name: 'Technology', level: 1, parent_id: null, sources_count: 85,
    children: [
      { id: 't-1', name: 'AI / Machine Learning', level: 2, parent_id: 'mc-1', sources_count: 42, children: [
        { id: 't-1a', name: 'LLM architecture', level: 3, parent_id: 't-1', sources_count: 12 },
        { id: 't-1b', name: 'AI agents', level: 3, parent_id: 't-1', sources_count: 8 },
        { id: 't-1c', name: 'AI safety', level: 3, parent_id: 't-1', sources_count: 6 },
        { id: 't-1d', name: 'Interpretability', level: 3, parent_id: 't-1', sources_count: 3 },
        { id: 't-1e', name: 'Vibe coding', level: 3, parent_id: 't-1', sources_count: 2 },
      ]},
      { id: 't-2', name: 'Software Development', level: 2, parent_id: 'mc-1', sources_count: 17, children: [
        { id: 't-2a', name: 'DevOps', level: 3, parent_id: 't-2', sources_count: 5 },
        { id: 't-2b', name: 'Web frameworks', level: 3, parent_id: 't-2', sources_count: 4 },
      ]},
      { id: 't-3', name: 'Hardware', level: 2, parent_id: 'mc-1', sources_count: 8 },
      { id: 't-4', name: 'Quantum Computing', level: 2, parent_id: 'mc-1', sources_count: 5 },
    ],
  },
  {
    id: 'mc-2', name: 'Entrepreneurship', level: 1, parent_id: null, sources_count: 32,
    children: [
      { id: 't-5', name: 'Startups', level: 2, parent_id: 'mc-2', sources_count: 15 },
      { id: 't-6', name: 'Venture Capital', level: 2, parent_id: 'mc-2', sources_count: 10 },
      { id: 't-7', name: 'Product Management', level: 2, parent_id: 'mc-2', sources_count: 7 },
    ],
  },
  {
    id: 'mc-3', name: 'Philosophy', level: 1, parent_id: null, sources_count: 12,
    children: [
      { id: 't-8', name: 'Philosophy', level: 2, parent_id: 'mc-3', sources_count: 5 },
      { id: 't-9', name: 'Consciousness', level: 2, parent_id: 'mc-3', sources_count: 3 },
      { id: 't-10', name: 'Ethics', level: 2, parent_id: 'mc-3', sources_count: 4 },
    ],
  },
  {
    id: 'mc-4', name: 'Science', level: 1, parent_id: null, sources_count: 25,
    children: [
      { id: 't-11', name: 'Neuroscience', level: 2, parent_id: 'mc-4', sources_count: 8 },
      { id: 't-12', name: 'Physics', level: 2, parent_id: 'mc-4', sources_count: 10 },
      { id: 't-13', name: 'Biology', level: 2, parent_id: 'mc-4', sources_count: 7 },
    ],
  },
];

export const mockSettings = {
  pipeline: {
    ingest: { max_entries_per_feed: 100, dedup_window_hours: 48 },
    quality: { min_word_count: 100, min_depth_score: 0.3, blocked_domains: ['reddit.com'] },
    embed: { model: 'voyage-context-3', dimensions: 1024, batch_size: 128 },
    user_match: { min_composite_score: 0.3, graph_weight: 0.4, cosine_weight: 0.6 },
    portfolio: { singleton_drop: true, near_dup_threshold: 0.92 },
    generate: { model: 'claude-sonnet-4-20250514', max_retries: 2 },
    validate: { min_signal_words: 8, max_body_words: 800 },
  },
  users: {
    fedor: {
      max_cards: 6,
      slots: { now: 3, deep: 2, bridge: 1, challenge: 1 },
      preferences: { likes: ['nuclear', 'physics', 'startups'], dislikes: ['biotech', 'climate'] },
    },
  },
  cron: { schedule: ['05:00 UTC', '11:00 UTC', '17:00 UTC'] },
  data: {
    postgres: { host: '***', port: 5432, database: 'strata' },
    neo4j: { uri: 'bolt://localhost:7687', password: '***' },
    embeddings: { provider: 'voyage', api_key: '***' },
    llm: { provider: 'anthropic', api_key: '***' },
  },
};
