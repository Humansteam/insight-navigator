
# Интерфейс чата для режима Documents

## Обзор задачи
Добавить полноценный интерфейс чата для режима "Documents" на главной странице. После отправки запроса пользователь переходит в режим диалога с AI-ассистентом, подобно интерфейсу Manus на скриншотах.

## Пользовательский сценарий

```text
+------------------------------------------+
|  Начальное состояние (Documents Mode)    |
|                                          |
|       Let's dive into your knowledge     |
|                                          |
|   [Documents] Ask about your docs...  [>]|
|                                          |
|   +----------------------------------+   |
|   | Search documents...              |   |
|   | [ ] Research Papers              |   |
|   | [ ] Technical Reports            |   |
|   | ...                              |   |
|   +----------------------------------+   |
|                                          |
|   [Doc1.pdf] [Doc2.pdf] [Doc3.pdf]       |
+------------------------------------------+
            |
            | Отправка запроса
            v
+------------------------------------------+
|  Режим чата (после первого сообщения)    |
|                                          |
|      +---------------------------+       |
|      | расскажи про литиевые... |       | <- user
|      +---------------------------+       |
|                                          |
|   [S] Strata                             |
|   Thinking process v                     |
|                                          |
|   Анализирую документы...               |
|   Найдено 3 релевантных раздела...      |
|                                          |
|   +----------------------------------+   |
|   | Ask Strata...                    |   |
|   | [+]                          [^] |   |
|   +----------------------------------+   |
+------------------------------------------+
```

## Что будет реализовано

### 1. Новый компонент DocumentsChatView
Создание отдельного компонента для чата в режиме Documents:
- Область сообщений со скроллом
- Сообщения пользователя справа (в bubble)
- Ответы AI слева с иконкой Strata
- Индикатор "Thinking..." во время обработки
- Поле ввода внизу в стиле Manus (кнопки +, микрофон опционально, отправить)

### 2. Локальное состояние чата
Для режима Documents будет использоваться локальный стейт сообщений:
- `chatMessages` — массив сообщений
- `isInChatMode` — флаг, переключающийся после первого сообщения
- `isProcessing` — индикатор загрузки

### 3. Переключение интерфейса в Home.tsx
После отправки первого сообщения:
- Скрыть заголовок "Let's dive into your knowledge"
- Скрыть DocumentSelector
- Показать полноэкранный интерфейс чата
- Выбранные документы отображаются как контекст (опционально в хедере чата)

## Технические детали

### Структура файлов

```text
src/
├── components/
│   └── home/
│       ├── DocumentSelector.tsx  (существует)
│       └── DocumentsChatView.tsx (новый)
├── pages/
│   └── Home.tsx (модификация)
```

### Интерфейс сообщения

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}
```

### Состояние в Home.tsx

```typescript
const [isInChatMode, setIsInChatMode] = useState(false);
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [isProcessing, setIsProcessing] = useState(false);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;
  
  // Добавить сообщение пользователя
  setChatMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'user',
    content: query,
    timestamp: new Date()
  }]);
  
  // Переключиться в режим чата
  setIsInChatMode(true);
  setQuery('');
  setIsProcessing(true);
  
  // Симуляция ответа AI
  setTimeout(() => {
    setChatMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Анализирую выбранные документы...',
      timestamp: new Date()
    }]);
    setIsProcessing(false);
  }, 1500);
};
```

### UI компонента DocumentsChatView

Основные элементы:
- Хедер с контекстом (выбранные документы)
- ScrollArea для сообщений
- Floating input container внизу
- Анимации появления сообщений (framer-motion)

### Стилизация в духе Manus

```text
Сообщения пользователя:
┌─────────────────────────────────┐
│  Сообщение справа в rounded box │  <- bg-card border
└─────────────────────────────────┘

Ответы AI:
[S] Strata
Thinking process ▼
Текст ответа без фона, слева
```

## План реализации

1. Создать `src/components/home/DocumentsChatView.tsx`
   - Пропсы: `messages`, `onSendMessage`, `isProcessing`, `selectedDocuments`
   - Рендеринг сообщений с анимацией
   - Floating input с кнопками + и ArrowUp

2. Модифицировать `src/pages/Home.tsx`
   - Добавить состояния `isInChatMode`, `chatMessages`
   - Условный рендеринг: обычный интерфейс или DocumentsChatView
   - Логика handleSubmit для перехода в режим чата
   - Кнопка возврата к выбору документов

3. Стилизация
   - Полноэкранный чат при активном режиме
   - Сохранить хедер и футер
   - Адаптировать под существующие темы

## Особенности UX

- Плавный переход в режим чата после первого сообщения
- Возможность вернуться к выбору документов (кнопка "Back" или крестик в хедере)
- Контекст выбранных документов виден в интерфейсе чата
- Поле ввода всегда закреплено внизу
