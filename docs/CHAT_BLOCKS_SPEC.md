# Chat Blocks Specification for AI Responses

## Обзор

Система AssistantBlock позволяет AI-ассистенту возвращать структурированные ответы вместо plain markdown. Каждый ответ — это массив блоков `AssistantBlock[]`, которые фронтенд рендерит как интерактивные карточки, графики, таблицы и другие UI-компоненты.

---

## TypeScript Schema

```typescript
type BlockKind = 
  | 'text'              // Обычный markdown-текст
  | 'summary'           // Краткое резюме (1-2 предложения)
  | 'table'             // Таблица данных
  | 'chart'             // График (bar/line/pie)
  | 'list'              // Список пунктов
  | 'code'              // Блок кода с подсветкой
  | 'insight'           // Инсайт со ссылками на источники
  | 'metric-group'      // Группа KPI-метрик
  | 'timeline'          // Временная шкала событий
  | 'tool-call'         // Вызов инструмента (для агентов)
  // Corporate RAG blocks
  | 'data-series'       // Временной ряд с графиком
  | 'calculation'       // Формула/расчёт с шагами
  | 'forecast'          // Прогноз с progress-bar
  | 'strategy-card'     // Стратегия в колонках
  | 'risk-list'         // Риски с уровнями
  | 'highlight-metrics' // Крупные KPI-карточки
  | 'source-reference'; // Ссылки на документы-источники

interface AssistantBlock {
  id: string;           // Уникальный ID блока
  kind: BlockKind;      // Тип блока
  title?: string;       // Заголовок (опционально)
  body?: string;        // Markdown-текст (для text, summary, insight)
  
  // Специфичные данные по типу
  table?: TableData;
  chart?: ChartData;
  list?: string[];
  code?: { language: string; content: string };
  metrics?: MetricItem[];
  timeline?: TimelineEvent[];
  toolCall?: ToolCallData;
  dataSeries?: DataSeriesData;
  calculation?: CalculationData;
  forecast?: ForecastData;
  strategy?: StrategyCardData;
  risks?: RiskItem[];
  highlightMetrics?: HighlightMetricItem[];
  sources?: SourceReference[];
}
```

---

## Описание каждого типа блока

### 1. `text` — Обычный текст

**Когда использовать:** Для любого текстового контента с markdown-форматированием (заголовки, списки, жирный текст, цитаты, таблицы в markdown).

```json
{
  "id": "t1",
  "kind": "text",
  "title": "Анализ результатов",
  "body": "На основе данных **2024 года** выявлены следующие тенденции:\n\n### Ключевые находки\n\n- Рост выручки на 15%\n- Снижение оттока до 3.2%\n\n> Это лучший результат за последние 5 лет."
}
```

---

### 2. `summary` — Краткое резюме

**Когда использовать:** В начале ответа для 1-2 предложений с главным выводом. Отображается как акцентированная карточка.

```json
{
  "id": "s1",
  "kind": "summary",
  "body": "Анализ 423 документов показал критическое снижение показателя hh-индекса до 1.5, что требует немедленных действий в области HR."
}
```

---

### 3. `table` — Таблица данных

**Когда использовать:** Для структурированных данных, сравнений, списков с атрибутами.

```typescript
interface TableData {
  columns: string[];    // Заголовки колонок
  rows: string[][];     // Данные (строки)
}
```

```json
{
  "id": "tbl1",
  "kind": "table",
  "title": "Топ регионов по продажам",
  "table": {
    "columns": ["Регион", "Выручка", "Рост", "Доля рынка"],
    "rows": [
      ["Москва", "450M ₽", "+12%", "34%"],
      ["СПб", "280M ₽", "+8%", "21%"],
      ["Екатеринбург", "120M ₽", "+15%", "9%"]
    ]
  }
}
```

---

### 4. `chart` — График

**Когда использовать:** Для визуализации трендов, распределений, сравнений по категориям.

```typescript
interface ChartData {
  type: 'bar' | 'line' | 'pie';
  x: string[];                      // Ось X (категории/даты)
  series: Record<string, number[]>; // Серии данных
}
```

```json
{
  "id": "ch1",
  "kind": "chart",
  "title": "Динамика продаж по кварталам",
  "chart": {
    "type": "bar",
    "x": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
    "series": {
      "Продажи": [120, 145, 132, 178],
      "План": [130, 140, 150, 160]
    }
  }
}
```

---

### 5. `list` — Список

**Когда использовать:** Для перечислений, шагов, рекомендаций. Если в title есть "next", "action", "step" — отображается как чеклист.

```json
{
  "id": "l1",
  "kind": "list",
  "title": "Next Steps",
  "list": [
    "Провести аудит текущих процессов",
    "Внедрить автоматизацию отчётности",
    "Обучить команду новым инструментам"
  ]
}
```

---

### 6. `code` — Блок кода

**Когда использовать:** Для примеров кода, конфигураций, SQL-запросов.

```json
{
  "id": "c1",
  "kind": "code",
  "title": "Пример запроса",
  "code": {
    "language": "sql",
    "content": "SELECT region, SUM(revenue) as total\nFROM sales\nWHERE year = 2024\nGROUP BY region\nORDER BY total DESC;"
  }
}
```

---

### 7. `insight` — Инсайт

**Когда использовать:** Для ключевых находок со ссылками на источники (документы, страницы).

```json
{
  "id": "i1",
  "kind": "insight",
  "title": "Ключевая находка",
  "body": "Стоимость привлечения клиента выросла на 45% за последний год, что связано с усилением конкуренции в digital-каналах.",
  "meta": {
    "paperIds": ["doc-123", "doc-456"]
  }
}
```

---

### 8. `metric-group` — Группа метрик

**Когда использовать:** Для отображения 3-6 ключевых KPI с трендами.

```typescript
interface MetricItem {
  label: string;
  value: string | number;
  change?: number;      // Изменение в %
  trend?: 'up' | 'down' | 'neutral';
}
```

```json
{
  "id": "m1",
  "kind": "metric-group",
  "title": "Ключевые показатели",
  "metrics": [
    { "label": "Выручка", "value": "1.2B ₽", "change": 12, "trend": "up" },
    { "label": "Маржа", "value": "23%", "change": -2, "trend": "down" },
    { "label": "NPS", "value": 72, "change": 5, "trend": "up" },
    { "label": "Churn", "value": "3.1%", "trend": "neutral" }
  ]
}
```

---

### 9. `timeline` — Временная шкала

**Когда использовать:** Для последовательности событий, этапов проекта, истории изменений.

```typescript
interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  detail?: string;
}
```

```json
{
  "id": "tl1",
  "kind": "timeline",
  "title": "Этапы внедрения",
  "timeline": [
    { "id": "e1", "label": "Анализ требований", "timestamp": "Янв 2024", "status": "complete", "detail": "Проведено 12 интервью" },
    { "id": "e2", "label": "Разработка MVP", "timestamp": "Мар 2024", "status": "complete" },
    { "id": "e3", "label": "Пилотный запуск", "timestamp": "Июн 2024", "status": "running" },
    { "id": "e4", "label": "Масштабирование", "timestamp": "Сен 2024", "status": "pending" }
  ]
}
```

---

### 10. `data-series` — Временной ряд с графиком

**Когда использовать:** Для динамики показателей с несколькими сериями данных и критическими порогами.

```typescript
interface DataSeriesData {
  periods: string[];    // Периоды (месяцы, кварталы)
  groups?: { label: string; data: number[] }[];  // Серии данных
  threshold?: { value: number; label: string };  // Критический порог
  source?: { page?: number; document: string };  // Источник
}
```

```json
{
  "id": "ds1",
  "kind": "data-series",
  "title": "Динамика hh-индекса в рознице",
  "dataSeries": {
    "periods": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
    "groups": [
      { "label": "2023", "data": [2.6, 2.6, 2.8, 2.5, 2.3, 2.1] },
      { "label": "2024", "data": [1.5, 1.6, 1.7, 1.5, 1.1, 1.1] }
    ],
    "threshold": { "value": 1.0, "label": "Критическая отметка" },
    "source": { "page": 2, "document": "HR_Report_2024.pdf" }
  }
}
```

---

### 11. `calculation` — Расчёт/формула

**Когда использовать:** Для демонстрации логики вычислений с входными данными и результатом.

```typescript
interface CalculationData {
  formula: string;
  inputs: { label: string; value: number | string }[];
  result: { label: string; value: number | string; unit?: string };
  steps?: string[];
}
```

```json
{
  "id": "calc1",
  "kind": "calculation",
  "title": "Расчёт ROI",
  "calculation": {
    "formula": "(revenue - cost) / cost × 100%",
    "inputs": [
      { "label": "Выручка", "value": "1,200,000 ₽" },
      { "label": "Затраты", "value": "800,000 ₽" }
    ],
    "result": { "label": "ROI", "value": 50, "unit": "%" },
    "steps": [
      "Прибыль = 1,200,000 - 800,000 = 400,000 ₽",
      "ROI = 400,000 / 800,000 = 0.5",
      "ROI = 50%"
    ]
  }
}
```

---

### 12. `forecast` — Прогноз

**Когда использовать:** Для визуализации прогноза достижения целевого показателя с уровнем риска.

```typescript
interface ForecastData {
  current: { value: number; label: string; date: string };
  target: { value: number; label: string };
  timeToTarget: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence?: number;  // 0-100%
}
```

```json
{
  "id": "f1",
  "kind": "forecast",
  "title": "Прогноз достижения цели",
  "forecast": {
    "current": { "value": 1.5, "label": "Текущее значение", "date": "Декабрь 2024" },
    "target": { "value": 1.0, "label": "Критическая точка" },
    "timeToTarget": "≈ 11 месяцев",
    "riskLevel": "critical",
    "confidence": 85
  }
}
```

---

### 13. `strategy-card` — Стратегические приоритеты

**Когда использовать:** Для отображения плана действий в нескольких колонках с чекбоксами и уровнем срочности.

```typescript
interface StrategyCardData {
  columns: {
    title: string;
    items: { text: string; done?: boolean }[];
  }[];
  urgency?: number;     // 0-100
  timeframe?: string;
}
```

```json
{
  "id": "str1",
  "kind": "strategy-card",
  "title": "План действий",
  "strategy": {
    "columns": [
      {
        "title": "Немедленные (Q1)",
        "items": [
          { "text": "Оптимизировать воронку найма", "done": false },
          { "text": "Внедрить ATS-систему", "done": false }
        ]
      },
      {
        "title": "Среднесрочные (Q2-Q3)",
        "items": [
          { "text": "Запустить employer branding", "done": false },
          { "text": "Создать кадровый резерв", "done": false }
        ]
      }
    ],
    "urgency": 85,
    "timeframe": "2025"
  }
}
```

---

### 14. `risk-list` — Список рисков

**Когда использовать:** Для перечисления рисков/угроз с уровнями критичности.

```typescript
interface RiskItem {
  level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  impact?: string;
}
```

```json
{
  "id": "r1",
  "kind": "risk-list",
  "title": "Ключевые риски",
  "risks": [
    {
      "level": "critical",
      "title": "Дефицит кадров",
      "description": "Соотношение кандидат/вакансия приближается к 1:1"
    },
    {
      "level": "high",
      "title": "Рост стоимости найма",
      "impact": "+100-150% к текущим бюджетам"
    },
    {
      "level": "medium",
      "title": "Снижение качества кандидатов",
      "description": "Придётся снижать требования к квалификации"
    }
  ]
}
```

---

### 15. `highlight-metrics` — Выделенные KPI

**Когда использовать:** Для крупных акцентных показателей (3-4 штуки), например конкурентные преимущества или ключевые достижения.

```typescript
interface HighlightMetricItem {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  icon?: string;    // 'trending-up', 'trending-down', 'target', 'calendar', 'dollar', 'zap'
  color?: string;   // 'green', 'red', 'primary', 'muted', 'yellow', 'blue'
}
```

```json
{
  "id": "hm1",
  "kind": "highlight-metrics",
  "title": "Результаты внедрения",
  "highlightMetrics": [
    { "label": "Рост конверсии", "value": "+200%", "trend": "up", "color": "green" },
    { "label": "Снижение CAC", "value": "-30%", "trend": "down", "color": "green" },
    { "label": "Выручка", "value": "2 млрд ₽", "color": "primary" },
    { "label": "Срок окупаемости", "value": "8 мес", "color": "muted" }
  ]
}
```

---

### 16. `source-reference` — Ссылки на источники

**Когда использовать:** В конце ответа для указания документов, из которых взята информация.

```typescript
interface SourceReference {
  documentName: string;
  page?: number;
  section?: string;
  confidence?: number;  // 0-100%
}
```

```json
{
  "id": "src1",
  "kind": "source-reference",
  "sources": [
    { "documentName": "Annual_Report_2024.pdf", "page": 12, "section": "Финансы", "confidence": 95 },
    { "documentName": "Market_Analysis.xlsx", "section": "Конкуренты", "confidence": 88 },
    { "documentName": "Strategy_Deck.pptx", "page": 5, "confidence": 92 }
  ]
}
```

---

## Рекомендации по использованию

### Структура типичного ответа

```
1. summary         — Краткий вывод (1-2 предложения)
2. text            — Введение и контекст
3. data-series     — Визуализация данных (если есть временные ряды)
4. text            — Анализ данных
5. calculation     — Расчёты (если есть формулы)
6. forecast        — Прогноз (если применимо)
7. text            — Выводы и последствия
8. risk-list       — Риски (если есть)
9. strategy-card   — План действий
10. highlight-metrics — Ключевые показатели
11. text           — Заключение
12. source-reference — Источники
```

### Когда какой блок выбирать

| Ситуация | Рекомендуемый блок |
|----------|-------------------|
| Главный вывод в начале | `summary` |
| Обычный текст с markdown | `text` |
| Табличные данные | `table` |
| Тренды во времени | `chart` (line) или `data-series` |
| Сравнение категорий | `chart` (bar) |
| Доли/проценты | `chart` (pie) |
| Перечисление пунктов | `list` |
| Код или запросы | `code` |
| Важная находка со ссылкой | `insight` |
| 3-6 KPI с трендами | `metric-group` |
| Этапы/события | `timeline` |
| Данные с порогом | `data-series` |
| Формула с вычислениями | `calculation` |
| Прогноз достижения цели | `forecast` |
| План в колонках | `strategy-card` |
| Риски/угрозы | `risk-list` |
| Крупные KPI-карточки | `highlight-metrics` |
| Ссылки на документы | `source-reference` |

### Чередование текста и блоков

**Важно:** Не делайте ответ только из структурированных блоков. Чередуйте `text` блоки с визуальными, чтобы сохранить читаемость и контекст:

```
✅ Правильно:
text → data-series → text → calculation → text → risk-list → text

❌ Неправильно:
data-series → calculation → table → risk-list → highlight-metrics
```

---

## Полный пример ответа

```json
{
  "blocks": [
    {
      "id": "1",
      "kind": "summary",
      "body": "Анализ HR-отчёта выявил критическое снижение показателя кандидат/вакансия до 1.5, прогноз достижения точки 1:1 — ноябрь 2025."
    },
    {
      "id": "2",
      "kind": "text",
      "title": "Обзор ситуации",
      "body": "На основе данных из **HR_Report_2024.pdf** проведён анализ динамики рынка труда в розничной торговле за 2023-2024 годы."
    },
    {
      "id": "3",
      "kind": "data-series",
      "title": "Динамика hh-индекса",
      "dataSeries": {
        "periods": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
        "groups": [
          { "label": "2023", "data": [2.6, 2.6, 2.8, 2.5, 2.3, 2.1] },
          { "label": "2024", "data": [1.5, 1.6, 1.7, 1.5, 1.1, 1.1] }
        ],
        "threshold": { "value": 1.0, "label": "Критич." }
      }
    },
    {
      "id": "4",
      "kind": "calculation",
      "title": "Расчёт скорости снижения",
      "calculation": {
        "formula": "(start - end) / months",
        "inputs": [
          { "label": "Начало", "value": 2.6 },
          { "label": "Конец", "value": 1.5 },
          { "label": "Период", "value": "24 мес" }
        ],
        "result": { "label": "Скорость", "value": 0.046, "unit": "пункт/мес" }
      }
    },
    {
      "id": "5",
      "kind": "forecast",
      "title": "Прогноз",
      "forecast": {
        "current": { "value": 1.5, "label": "Сейчас", "date": "Дек 2024" },
        "target": { "value": 1.0, "label": "Критическая точка" },
        "timeToTarget": "11 мес",
        "riskLevel": "critical",
        "confidence": 85
      }
    },
    {
      "id": "6",
      "kind": "risk-list",
      "title": "Риски",
      "risks": [
        { "level": "critical", "title": "Дефицит кадров", "description": "Острая конкуренция за каждого кандидата" },
        { "level": "high", "title": "Рост стоимости найма", "impact": "+100-150%" }
      ]
    },
    {
      "id": "7",
      "kind": "highlight-metrics",
      "title": "Возможности платформы",
      "highlightMetrics": [
        { "label": "Рост откликов", "value": "+200%", "trend": "up", "color": "green" },
        { "label": "Снижение CAC", "value": "-30%", "trend": "down", "color": "green" }
      ]
    },
    {
      "id": "8",
      "kind": "source-reference",
      "sources": [
        { "documentName": "HR_Report_2024.pdf", "page": 2, "confidence": 95 }
      ]
    }
  ]
}
```
