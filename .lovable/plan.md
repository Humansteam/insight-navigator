
# Исправление стилей чата по макету Manus

## Точные параметры из скриншота Manus

### Типографика
- Основной текст: **16px** (text-base)
- Межстрочный интервал: **1.6** (leading-relaxed)
- Заголовок "manus/Strata": **16px font-medium**
- "Thinking process": **15px**, цвет muted

### Размеры контейнеров
- Ширина контента: **640px** (max-w-[640px])
- User bubble: без явной границы, просто тёмный фон
- Поле ввода: более компактное, высота ~52-56px

### Визуальные отличия
- Иконка Strata — без фона, просто иконка
- Под ответом нет border-top перед кнопками
- Кнопки Copy/Start agent/Create — просто иконки с текстом, очень лёгкие

---

## Изменения в DocumentsChatView.tsx

### 1. Типографика
```tsx
// Было:
text-[15px] leading-[1.75]

// Станет:
text-base leading-relaxed  // 16px, line-height 1.625
```

### 2. Ширина контента
```tsx
// Было:
max-w-[720px]

// Станет:
max-w-[640px]
```

### 3. Иконка Strata — без фона
```tsx
// Было:
<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
  <Sparkles className="w-4 h-4 text-primary" />
</div>

// Станет:
<Sparkles className="w-5 h-5 text-primary" />
```

### 4. Action buttons — убрать border-top
```tsx
// Было:
<div className="flex items-center gap-5 pt-3 border-t border-border/30">

// Станет:
<div className="flex items-center gap-4 pt-2">
```

### 5. Поле ввода — более компактное
```tsx
// Было:
<div className="px-5 pt-4 pb-2">

// Станет:
<div className="px-4 py-3">
```

### 6. User bubble — уменьшить padding
```tsx
// Было:
<div className="max-w-[85%] px-5 py-3.5 rounded-2xl ...">

// Станет:
<div className="max-w-[80%] px-4 py-3 rounded-xl ...">
```

---

## Полный список изменений

| Файл | Изменение |
|------|-----------|
| DocumentsChatView.tsx | Шрифт 16px вместо 15px |
| DocumentsChatView.tsx | Ширина 640px вместо 720px |
| DocumentsChatView.tsx | Иконка Strata без wrapper |
| DocumentsChatView.tsx | Убрать border-top у action buttons |
| DocumentsChatView.tsx | Компактнее padding в поле ввода |
| DocumentsChatView.tsx | Уменьшить округление user bubble |
