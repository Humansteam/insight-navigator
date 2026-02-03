
# Точное копирование дизайна блока ввода Manus

## Анализ скриншота

### Структура блока ввода

```text
┌─────────────────────────────────────────────────────────────┐
│  Assign a task or ask anything                              │
│                                                             │
│  [+]  [⚙]                                      [🎤]  [↑]    │
├─────────────────────────────────────────────────────────────┤
│  ⚙  Connect your tools to Strata                       ✕   │
└─────────────────────────────────────────────────────────────┘

         [ Documents ]   [ Research ]   [ Agent Mode ]
```

### Элементы дизайна

| Элемент | Спецификация |
|---------|--------------|
| Контейнер формы | max-w-3xl (768px), rounded-2xl, bg-card, border, shadow-lg |
| Левые кнопки | Plus и Link2 — h-9 w-9, **bg-muted rounded-lg** |
| Правые кнопки | Mic (микрофон) + ArrowUp (круглая) |
| Интеграции | -mt-[22px], rounded-b-[22px], иконка Link2 |
| Кнопки режимов | pill-style под блоком, gap-3 |

---

## Изменения

### 1. DocumentsChatView.tsx — Toolbar

**Было:**
```tsx
<Button className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-transparent">
  <Plus />
</Button>
<Button className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-transparent">
  <Sparkles />
</Button>
```

**Станет:**
```tsx
<Button className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
  <Plus />
</Button>
<Button className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
  <Link2 />  // иконка инструментов
</Button>
```

### 2. Добавить иконку микрофона справа

```tsx
<div className="flex items-center gap-2">
  <Button className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted">
    <Mic />
  </Button>
  <Button className="h-10 w-10 rounded-full bg-foreground text-background">
    <ArrowUp />
  </Button>
</div>
```

### 3. Иконка в интеграциях — Link2

**Было:**
```tsx
<Plus className="w-4 h-4" />
```

**Станет:**
```tsx
<Link2 className="w-4 h-4" />
```

---

## Полный список изменений

| Файл | Изменение |
|------|-----------|
| DocumentsChatView.tsx | Plus и Link2 кнопки с bg-muted фоном |
| DocumentsChatView.tsx | Добавить иконку Mic справа перед кнопкой отправки |
| DocumentsChatView.tsx | Заменить Plus на Link2 в полоске интеграций |
| DocumentsChatView.tsx | Импортировать Mic и Link2 из lucide-react |

---

## Техническая реализация

Импорты:
```tsx
import { ArrowUp, Plus, ChevronDown, ArrowLeft, File, Folder, Copy, Sparkles, X, Mic, Link2 } from 'lucide-react';
```

Toolbar (левая часть):
```tsx
<div className="flex items-center gap-1">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
  >
    <Plus className="w-5 h-5" />
  </Button>
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="h-9 w-9 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
  >
    <Link2 className="w-5 h-5" />
  </Button>
</div>
```

Toolbar (правая часть):
```tsx
<div className="flex items-center gap-2">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted"
  >
    <Mic className="w-5 h-5" />
  </Button>
  <Button
    type="submit"
    variant="ghost"
    size="icon"
    disabled={!input.trim() || isProcessing}
    className={cn(
      "h-10 w-10 rounded-full transition-all",
      input.trim() && !isProcessing
        ? "bg-foreground text-background hover:bg-foreground/90"
        : "bg-muted text-muted-foreground/50"
    )}
  >
    <ArrowUp className="w-5 h-5" />
  </Button>
</div>
```

Интеграции:
```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Link2 className="w-4 h-4" />
  <span>Connect your tools to Strata</span>
</div>
```
