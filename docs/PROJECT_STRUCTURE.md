# Stata Research Platform — Документация структуры проекта

> ⚠️ **ВАЖНО ДЛЯ AI/CLAUDE**: Этот код НЕ нужно переписывать! Нужно КОПИРОВАТЬ файлы и ИНТЕГРИРОВАТЬ их в продакшн. Каждый компонент уже работает — просто подключите его к бэкенду.

---

## 📁 Общая структура проекта

```
src/
├── components/          # Все UI компоненты
│   ├── cockpit/        # Компоненты для анализа и визуализации
│   ├── journals/       # Система заметок/журналов
│   ├── papers-screening/  # Скрининг научных статей
│   ├── report/         # Панель чата для отчётов
│   ├── topology/       # Граф связей статей
│   └── ui/             # Базовые shadcn/ui компоненты
├── contexts/           # React контексты (состояние)
├── data/               # Мок-данные для разработки
├── hooks/              # Кастомные React хуки
├── pages/              # Страницы приложения
├── types/              # TypeScript типы
└── lib/                # Утилиты
```

---

## 🎨 БЛОК 1: ИНТЕРФЕЙС (Header + Layout)

### Главный файл страницы
**Путь:** `src/pages/Index.tsx`

Это ГЛАВНЫЙ файл, который собирает всё приложение. Он:
- Управляет состоянием активного вида (`activeView`: 'report' | 'topology' | 'papers' | 'notes')
- Контролирует боковые панели (левая и правая)
- Рендерит разный контент в зависимости от выбранного раздела

```tsx
// Ключевые состояния:
const [isSidebarOpen, setIsSidebarOpen] = useState(true);        // Правая панель
const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);    // Левая панель  
const [activeView, setActiveView] = useState<ReportView>('report'); // Активный раздел

// Доступные разделы:
const viewOptions = [
  { id: 'report', label: 'Report' },      // Отчёт
  { id: 'topology', label: 'Topology' },  // Граф
  { id: 'papers', label: 'Papers' },      // Скрининг
  { id: 'notes', label: 'Journals' },     // Заметки
];
```

### Шапка приложения
**Путь:** `src/components/UnifiedHeader.tsx`

Единый хедер с:
- Логотипом и названием ("Stata")
- Переключателем разделов (табы)
- Кнопками toggle для боковых панелей
- Переключателем темы
- Кнопкой перевода (пока без функционала)

**Props:**
```tsx
interface UnifiedHeaderProps {
  activeView: ReportView;
  setActiveView: (view: ReportView) => void;
  viewOptions: ViewOption[];
  projectTitle: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isLeftPanelOpen: boolean;
  setIsLeftPanelOpen: (open: boolean) => void;
}
```

### Переключатель темы
**Путь:** `src/components/ThemeSwitcher.tsx`

Поддерживает 3 темы: light, dark, deep-space

---

## 💬 БЛОК 2: ЧАТ-СИСТЕМА

### Контекст чата (глобальное состояние)
**Путь:** `src/contexts/ChatContext.tsx`

Глобальный стейт для чата, используется во всех разделах.

```tsx
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  sendMessage: (content: string) => void;  // Отправка + mock ответ
}
```

**Как подключить к бэкенду:**
1. Заменить `sendMessage` — вместо setTimeout вызывать API
2. Добавить streaming для ответов
3. Сохранять историю в БД

### Панель чата (UI)
**Путь:** `src/components/report/ReportChatPanel.tsx`

Это левая панель с чатом, которая отображается в разделах Report, Topology и Papers.

**Особенности:**
- Стиль как в Lovable (floating input, rounded messages)
- Кнопки действий под каждым сообщением AI
- Интеграция с журналами (AddToJournalPopover)
- Использует `useChat()` из контекста

**Для интеграции бэкенда:** Заменить mock-ответы в ChatContext на реальные API вызовы.

---

## 📊 БЛОК 3: РАЗДЕЛ REPORT (Отчёт)

### Основной контент отчёта
**Путь:** Рендерится прямо в `src/pages/Index.tsx` (функция `renderReportContent`)

Показывает:
- Заголовок отчёта
- Лид-параграф
- Abstract
- Methods (collapsible)
- Results с цитатами на статьи

### Компоненты отчёта

| Файл | Описание |
|------|----------|
| `src/components/cockpit/InlinePaperCard.tsx` | Карточка цитируемой статьи (появляется при hover) |
| `src/components/cockpit/ReportPanel.tsx` | Альтернативная панель отчёта с прогрессом |
| `src/components/cockpit/ReasoningProcess.tsx` | Визуализация процесса анализа |
| `src/components/cockpit/EvidenceMatrixPanel.tsx` | Правая панель со списком статей |

### Правая панель (Evidence Matrix)
**Путь:** `src/components/cockpit/EvidenceMatrixPanel.tsx`

Показывает список статей с:
- Фильтрацией по кластерам
- Hover-эффектами (синхронизация с графом)
- Деталями по статье

---

## 🔗 БЛОК 4: РАЗДЕЛ TOPOLOGY (Граф)

### Главный компонент
**Путь:** `src/components/topology/TopologyMain.tsx`

Обёртка для графа с:
- Выделением узлов (multi-select)
- Action bar для выбранных статей
- Интеграцией с чатом для суммаризации

**Props:**
```tsx
interface TopologyMainProps {
  nodes?: DataNode[];
  edges?: DataEdge[];
  externalHoveredNodeId?: string | null;
  onExternalHoverNode?: (id: string | null) => void;
  onMatrixClusterSelect?: (quadrant: string | null, nodeIds: string[]) => void;
}
```

### Визуализация графа
**Путь:** `src/components/cockpit/TopologyVisualization.tsx`

Интерактивный 2D граф на Canvas/SVG:
- UMAP координаты для позиционирования
- Цветовая кодировка по странам
- Hover и selection

### Компоненты топологии

| Файл | Описание |
|------|----------|
| `TopologyVisualization.tsx` | Сам граф (Canvas) |
| `SelectionActionBar.tsx` | Панель действий над выбранными узлами |
| `TopologyChatPanel.tsx` | Чат специфичный для топологии |
| `TopologyRightPanel.tsx` | Правая панель деталей |

### Maturity Matrix
**Путь:** `src/components/cockpit/MaturityMatrix.tsx`

Scatter plot с пузырьками:
- X: TRL (Technology Readiness Level)
- Y: Market Velocity
- Size: Volume (количество статей)

---

## 📑 БЛОК 5: РАЗДЕЛ PAPERS (Скрининг)

### Главный компонент
**Путь:** `src/components/papers-screening/PapersScreeningMain.tsx`

Таблица статей со скринингом:
- Сортировка по score
- Детальная панель справа
- Статусы: included, excluded, uncertain

### Компоненты скрининга

| Файл | Описание |
|------|----------|
| `PaperRowCard.tsx` | Строка таблицы с одной статьёй |
| `ScreeningDetailsPanel.tsx` | Правая панель с деталями статьи |
| `ScreeningBadge.tsx` | Бейдж статуса (included/excluded) |
| `CriteriaTags.tsx` | Теги критериев |
| `ScreeningFilters.tsx` | Фильтры |
| `mockData.ts` | Тестовые данные |
| `types.ts` | TypeScript типы |

### Типы скрининга
**Путь:** `src/components/papers-screening/types.ts`

```tsx
export interface PaperWithScreening extends DataNode {
  screening: ScreeningData;
}

export interface ScreeningData {
  status: 'included' | 'excluded' | 'uncertain';
  combinedScore: number;
  criteria: CriteriaJudgement[];
  aiSummary: string;
  reasoning: string;
}

export type ReportView = 'report' | 'topology' | 'papers' | 'notes' | 'timeline';
```

---

## 📓 БЛОК 6: РАЗДЕЛ JOURNALS (Заметки)

### Провайдер состояния
**Путь:** `src/contexts/JournalsContext.tsx`

Глобальный стейт для журналов.

### Workspace компоненты
**Путь:** `src/components/journals/JournalsWorkspaceDock.tsx`

Экспортирует:
- `JournalsWorkspaceProvider` — провайдер контекста
- `JournalsLeftPanel` — левая панель со списком журналов
- `JournalsMainPanel` — основная область редактирования

### Все компоненты журналов

| Файл | Описание |
|------|----------|
| `JournalsWorkspace.tsx` | Обёртка workspace |
| `JournalsWorkspaceDock.tsx` | Dock с provider и panels |
| `JournalsSidebar.tsx` | Боковая панель |
| `JournalEditor.tsx` | Редактор заметки |
| `JournalPreview.tsx` | Превью заметки |
| `JournalTabs.tsx` | Табы журналов |
| `JournalView.tsx` | Просмотр журнала |
| `CreateJournalDialog.tsx` | Диалог создания |
| `AddToJournalPopover.tsx` | Popover для добавления в журнал |
| `FormatToolbar.tsx` | Панель форматирования |
| `TextSelectionTooltip.tsx` | Tooltip при выделении текста |

### Добавление в журнал из других разделов
**Путь:** `src/components/journals/AddToJournalPopover.tsx`

Используется в ReportChatPanel для сохранения AI-ответов в журнал.

---

## 📦 ТИПЫ ДАННЫХ

### Основные типы
**Путь:** `src/types/morphik.ts`

```tsx
// Узел графа (статья)
interface DataNode {
  id: string;
  title: string;
  umap_x: number;
  umap_y: number;
  cluster_label: string;
  country: 'china' | 'usa' | 'europe' | 'other';
  score: number;
  year: number;
  authors: string[];
  abstract: string;
  citations: number;
  dimensions: Record<string, DimensionValue>;
}

// Связь между статьями
interface DataEdge {
  source_id: string;
  target_id: string;
  weight: number;
}
```

---

## 🎣 ХУКИ

### useEngineData
**Путь:** `src/hooks/useEngineData.ts`

Хук для работы с backend engine:
- Фазы анализа (planning, retrieval, extraction, synthesis)
- SSE streaming для прогресса
- Конвертация данных в DataNode формат

**Для интеграции:** Настроить `ENGINE_API_BASE` на ваш API.

---

## 📊 МОК-ДАННЫЕ

**Путь:** `src/data/mockData.ts`

Содержит:
- `mockNodes` — тестовые статьи
- `mockEdges` — тестовые связи
- `mockSearchQueries` — примеры запросов
- `mockExtractionDimensions` — размерности

**Путь:** `src/data/maturityMockData.ts`

Данные для Maturity Matrix.

---

## 🔌 ТОЧКИ ИНТЕГРАЦИИ С БЭКЕНДОМ

### 1. Чат (приоритет высокий)
- **Файл:** `src/contexts/ChatContext.tsx`
- **Что менять:** Функцию `sendMessage` — заменить setTimeout на API call
- **API endpoint:** POST /api/chat

### 2. Данные статей
- **Файл:** `src/hooks/useEngineData.ts`
- **Что менять:** `ENGINE_API_BASE` и логику `analyze`
- **API endpoint:** SSE /api/analyze

### 3. Скрининг статей
- **Файл:** `src/components/papers-screening/PapersScreeningMain.tsx`
- **Что менять:** Заменить `mockScreeningData` на fetch
- **API endpoint:** GET /api/papers

### 4. Журналы
- **Файл:** `src/contexts/JournalsContext.tsx`
- **Что менять:** Добавить CRUD операции к API
- **API endpoints:** GET/POST/PUT/DELETE /api/journals

### 5. Перевод
- **Файл:** `src/components/UnifiedHeader.tsx`
- **Кнопка:** Languages icon (пока без функционала)
- **API endpoint:** POST /api/translate

---

## ⚡ ПОРЯДОК ИНТЕГРАЦИИ

1. **Чат** — подключить к LLM API (OpenAI/Anthropic)
2. **Данные статей** — подключить к базе статей
3. **Скрининг** — подключить к системе скрининга
4. **Журналы** — подключить к БД для персистентности
5. **Перевод** — подключить к translation API

---

## 🚫 НЕ ПЕРЕПИСЫВАТЬ!

Эти компоненты ГОТОВЫ и работают:
- ✅ UnifiedHeader
- ✅ ReportChatPanel
- ✅ TopologyMain + TopologyVisualization
- ✅ PapersScreeningMain
- ✅ JournalsWorkspace
- ✅ MaturityMatrix
- ✅ Все UI компоненты

**Нужно только:**
1. Скопировать файлы в продакшн
2. Заменить mock-данные на API вызовы
3. Подключить бэкенд в точках интеграции
