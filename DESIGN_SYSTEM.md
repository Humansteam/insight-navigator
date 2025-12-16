# 🎨 Design System Documentation
## Translate AI - Multi-Theme Design System

Этот документ содержит полную дизайн-систему для проекта с тремя темами: Light, Dark и Deep Space.

---

## 📁 Структура файлов

```
src/
├── index.css          # CSS переменные для всех тем
├── pages/
│   └── Translate.tsx  # Главная страница переводчика
├── components/
│   ├── ThemeSwitcher.tsx  # Переключатель тем
│   └── ui/            # Базовые UI компоненты (shadcn)
tailwind.config.ts     # Конфигурация Tailwind
```

---

## 🔤 Типографика

### Шрифты
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Размеры текста
| Элемент | Размер | Вес | Tailwind класс |
|---------|--------|-----|----------------|
| H1 | 30px | 600 | `text-3xl font-semibold` |
| H2 | 24px | 600 | `text-2xl font-semibold` |
| H3 | 18px | 500 | `text-lg font-medium` |
| Body | 14px | 400 | `text-sm` |
| Small | 12px | 400 | `text-xs` |
| Caption | 11px | 500 | `text-[11px] font-medium` |
| Mono/Data | 13px | 500 | `font-mono text-[13px]` |

---

## 📐 Скругления (Border Radius)

```css
--radius: 0.5rem;  /* 8px - базовое значение */
```

| Токен | Значение | Использование |
|-------|----------|---------------|
| `rounded-sm` | 4px | Мелкие элементы, badges |
| `rounded-md` | 6px | Инпуты, мелкие кнопки |
| `rounded-lg` | 8px | Карточки, основные кнопки |
| `rounded-xl` | 12px | Модальные окна, большие карточки |
| `rounded-full` | 9999px | Аватары, круглые кнопки |

---

## 🌞 LIGHT THEME (Manus Style)

### Активация
```tsx
// По умолчанию (:root)
<html>  // или без класса
```

### Цветовая палитра

#### Фоны
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--background` | `60 7% 97%` | `#F8F8F7` | Основной фон страницы |
| `--background-deep` | `60 7% 97%` | `#F8F8F7` | Глубокий фон |
| `--background-elevated` | `0 0% 100%` | `#FFFFFF` | Приподнятые элементы |

#### Текст
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--foreground` | `0 0% 9%` | `#171717` | Основной текст |
| `--foreground-muted` | `0 0% 45%` | `#737373` | Вторичный текст |

#### Карточки
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--card` | `0 0% 100%` | `#FFFFFF` | Фон карточки |
| `--card-foreground` | `0 0% 9%` | `#171717` | Текст в карточке |
| `--card-border` | `0 0% 82%` | `#D1D1D1` | Граница карточки |

#### Границы
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--border` | `0 0% 80%` | `#CCCCCC` | Основные границы |
| `--border-glow` | `165 60% 50%` | `#33CC99` | Границы с подсветкой |

#### Акцентный цвет (Primary)
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--primary` | `165 60% 40%` | `#33A38C` | Кнопки, ссылки, акценты |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Текст на primary фоне |
| `--primary-glow` | `165 60% 50%` | `#33CC99` | Свечение, hover |
| `--primary-muted` | `165 30% 80%` | `#B3D9D1` | Приглушённый акцент |

#### Sidebar
| Токен | HSL | HEX |
|-------|-----|-----|
| `--sidebar-background` | `60 5% 95%` | `#F2F2F0` |
| `--sidebar-foreground` | `0 0% 9%` | `#171717` |
| `--sidebar-border` | `0 0% 85%` | `#D9D9D9` |
| `--sidebar-accent` | `60 5% 90%` | `#E6E6E3` |

#### Тени
```css
--shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
--shadow-md: 0 4px 12px hsl(0 0% 0% / 0.1);
--shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.15);
--shadow-glow: 0 0 20px hsl(165 60% 40% / 0.2);
```

---

## 🌙 DARK THEME (Morphik Neutral)

### Активация
```tsx
<html className="dark">
```

### Цветовая палитра

#### Фоны
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--background` | `240 10% 3.9%` | `#09090B` | Основной фон |
| `--background-deep` | `240 10% 2%` | `#050506` | Глубокий фон |
| `--background-elevated` | `240 10% 6%` | `#0F0F12` | Карточки, панели |

#### Текст
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--foreground` | `0 0% 98%` | `#FAFAFA` | Основной текст |
| `--foreground-muted` | `240 5% 64.9%` | `#A1A1AA` | Вторичный текст |

#### Карточки
| Токен | HSL | HEX |
|-------|-----|-----|
| `--card` | `240 10% 3.9%` | `#09090B` |
| `--card-border` | `240 3.7% 15.9%` | `#27272A` |

#### Границы
| Токен | HSL | HEX |
|-------|-----|-----|
| `--border` | `240 3.7% 15.9%` | `#27272A` |

#### Акцентный цвет (Primary) - БЕЛЫЙ
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--primary` | `0 0% 98%` | `#FAFAFA` | Кнопки, акценты |
| `--primary-foreground` | `240 5.9% 10%` | `#18181B` | Текст на primary |

#### Тени
```css
--shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.3);
--shadow-md: 0 4px 12px hsl(0 0% 0% / 0.4);
--shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.5);
--shadow-glow: 0 0 20px hsl(0 0% 98% / 0.2);
```

---

## 🌌 DEEP SPACE THEME (Cyan Accents)

### Активация
```tsx
<html className="deep-space">
```

### Цветовая палитра

#### Фоны
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--background` | `222 47% 6%` | `#0A1628` | Основной фон |
| `--background-deep` | `225 50% 4%` | `#060D17` | Глубокий фон |
| `--background-elevated` | `222 40% 10%` | `#122035` | Карточки, модалки |

#### Текст
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--foreground` | `210 40% 96%` | `#E8F1FA` | Основной текст |
| `--foreground-muted` | `215 20% 55%` | `#6B8299` | Вторичный текст |

#### Карточки
| Токен | HSL | HEX |
|-------|-----|-----|
| `--card` | `222 40% 8%` | `#0D1A2D` |
| `--card-border` | `220 40% 15%` | `#1E3A5F` |

#### Границы
| Токен | HSL | HEX |
|-------|-----|-----|
| `--border` | `220 40% 15%` | `#1E3A5F` |
| `--border-glow` | `185 75% 40%` | `#1AB3B3` |

#### Акцентный цвет (Primary) - CYAN
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--primary` | `185 75% 50%` | `#20D5D8` | Кнопки, ссылки |
| `--primary-foreground` | `222 47% 6%` | `#0A1628` | Текст на primary |
| `--primary-glow` | `185 75% 60%` | `#4DE0E3` | Свечение |

#### Вторичный акцент (Accent) - BLUE
| Токен | HSL | HEX | Использование |
|-------|-----|-----|---------------|
| `--accent` | `210 100% 55%` | `#2680FF` | Иконки, индикаторы |
| `--accent-foreground` | `210 40% 98%` | `#F5F9FF` | Текст на accent |

#### Тени с цветным свечением
```css
--shadow-glow: 0 0 20px hsl(185 75% 50% / 0.3);
--shadow-glow-sm: 0 0 8px hsl(185 75% 50% / 0.2);
```

---

## 🧩 Компоненты

### Кнопки

#### Primary Button
```tsx
// Tailwind классы
<Button className="bg-primary text-primary-foreground hover:bg-primary-glow">
  Translate
</Button>
```

#### Secondary/Ghost Button
```tsx
<Button variant="ghost" className="bg-secondary text-secondary-foreground hover:bg-accent">
  Clear
</Button>
```

### Карточки

```tsx
<div className="bg-card border border-border rounded-lg p-4 shadow-md">
  {/* Контент */}
</div>

// С эффектом подъёма
<div className="card-elevated rounded-xl p-6">
  {/* Контент */}
</div>
```

### Инпуты

```tsx
<input 
  className="bg-input-background border border-input rounded-md px-3 py-2 
             text-foreground placeholder:text-foreground-muted
             focus:ring-2 focus:ring-ring focus:border-transparent"
/>
```

### Sidebar

```tsx
<aside className="bg-sidebar border-r border-sidebar-border">
  {/* Обычный пункт */}
  <div className="text-sidebar-foreground hover:bg-sidebar-accent">
    Item
  </div>
  
  {/* Активный пункт */}
  <div className="bg-sidebar-accent text-sidebar-primary font-medium">
    Active Item
  </div>
</aside>
```

### Select/Dropdown

```tsx
<Select>
  <SelectTrigger className="bg-card border-border">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-popover border-border">
    <SelectItem>Option</SelectItem>
  </SelectContent>
</Select>
```

---

## 🎯 Правила использования акцентного цвета

### ✅ Используйте Primary для:
- CTA кнопок (главные действия)
- Активных состояний в навигации
- Ссылок
- Иконок важных действий
- Прогресс-баров
- Переключателей (toggle)

### ❌ НЕ используйте Primary для:
- Фоновых заливок больших областей
- Обычного текста
- Границ неактивных элементов

---

## 📱 Адаптивность

```tsx
// Пример адаптивной сетки
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Контент */}
</div>

// Скрытие элементов
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

---

## ⚡ Анимации

### Предустановленные анимации
```css
animate-fade-in        /* Появление снизу */
animate-slide-in-right /* Появление справа */
animate-pulse-ring     /* Пульсирующее кольцо */
animate-accordion-down /* Раскрытие аккордеона */
```

### Использование
```tsx
<div className="animate-fade-in">
  Animated content
</div>
```

---

## 🔧 CSS Утилиты

### Свечение
```tsx
<div className="glow-primary">    {/* Полное свечение */}
<div className="glow-primary-sm"> {/* Маленькое свечение */}
<span className="text-glow">      {/* Свечение текста */}
```

### Моноширинный текст для данных
```tsx
<span className="font-data">1,234.56</span>
```

### Карточка с градиентом
```tsx
<div className="card-elevated rounded-lg">
  {/* Автоматический градиент фона */}
</div>
```

---

## 📋 Полный CSS (index.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Light theme - Manus style (#F8F8F7 background) */
  :root {
    --background: 60 7% 97%;
    --background-deep: 60 7% 97%;
    --background-elevated: 0 0% 100%;
    --foreground: 0 0% 9%;
    --foreground-muted: 0 0% 45%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;
    --card-border: 0 0% 82%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 9%;

    --primary: 165 60% 40%;
    --primary-foreground: 0 0% 100%;
    --primary-glow: 165 60% 50%;
    --primary-muted: 165 30% 80%;

    --secondary: 60 5% 92%;
    --secondary-foreground: 0 0% 40%;

    --muted: 60 5% 92%;
    --muted-foreground: 0 0% 45%;

    --accent: 60 5% 92%;
    --accent-foreground: 0 0% 9%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --success: 142 70% 45%;
    --warning: 45 95% 55%;

    --border: 0 0% 80%;
    --border-glow: 165 60% 50%;
    --input: 0 0% 80%;
    --input-background: 0 0% 100%;
    --ring: 165 60% 40%;

    --radius: 0.5rem;

    --sidebar-background: 60 5% 95%;
    --sidebar-foreground: 0 0% 9%;
    --sidebar-primary: 165 60% 40%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 60 5% 90%;
    --sidebar-accent-foreground: 0 0% 9%;
    --sidebar-border: 0 0% 85%;
    --sidebar-ring: 165 60% 40%;

    --gradient-dark: linear-gradient(180deg, hsl(60 7% 97%) 0%, hsl(60 5% 95%) 100%);
    --gradient-card: linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(60 5% 99%) 100%);
    --gradient-glow: radial-gradient(ellipse at center, hsl(165 60% 40% / 0.1) 0%, transparent 70%);

    --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
    --shadow-md: 0 4px 12px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.15);
    --shadow-input: 0 1px 3px hsl(0 0% 0% / 0.05);
    --shadow-glow: 0 0 20px hsl(165 60% 40% / 0.2);
    --shadow-glow-sm: 0 0 8px hsl(165 60% 40% / 0.15);

    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  }

  /* Dark theme - Morphik neutral */
  .dark {
    --background: 240 10% 3.9%;
    --background-deep: 240 10% 2%;
    --background-elevated: 240 10% 6%;
    --foreground: 0 0% 98%;
    --foreground-muted: 240 5% 64.9%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --card-border: 240 3.7% 15.9%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --primary-glow: 0 0% 100%;
    --primary-muted: 240 3.7% 25%;

    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --success: 142 70% 45%;
    --warning: 45 95% 55%;

    --border: 240 3.7% 15.9%;
    --border-glow: 0 0% 50%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 17%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 240 3.7% 17%;
    --sidebar-ring: 240 4.9% 83.9%;

    --gradient-dark: linear-gradient(180deg, hsl(240 10% 3.9%) 0%, hsl(240 10% 2%) 100%);
    --gradient-card: linear-gradient(135deg, hsl(240 10% 6%) 0%, hsl(240 10% 3.9%) 100%);
    --gradient-glow: radial-gradient(ellipse at center, hsl(0 0% 98% / 0.1) 0%, transparent 70%);

    --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.3);
    --shadow-md: 0 4px 12px hsl(0 0% 0% / 0.4);
    --shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.5);
    --shadow-glow: 0 0 20px hsl(0 0% 98% / 0.2);
    --shadow-glow-sm: 0 0 8px hsl(0 0% 98% / 0.15);
  }

  /* Deep Space theme - Cyan accents */
  .deep-space {
    --background: 222 47% 6%;
    --background-deep: 225 50% 4%;
    --background-elevated: 222 40% 10%;
    --foreground: 210 40% 96%;
    --foreground-muted: 215 20% 55%;

    --card: 222 40% 8%;
    --card-foreground: 210 40% 96%;
    --card-border: 220 40% 15%;

    --popover: 222 40% 10%;
    --popover-foreground: 210 40% 96%;

    --primary: 185 75% 50%;
    --primary-foreground: 222 47% 6%;
    --primary-glow: 185 75% 60%;
    --primary-muted: 185 40% 25%;

    --secondary: 220 30% 18%;
    --secondary-foreground: 210 40% 90%;

    --muted: 220 30% 12%;
    --muted-foreground: 215 20% 55%;

    --accent: 210 100% 55%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 75% 55%;
    --destructive-foreground: 210 40% 98%;
    --success: 142 70% 45%;
    --warning: 45 95% 55%;

    --border: 220 40% 15%;
    --border-glow: 185 75% 40%;
    --input: 220 30% 12%;
    --ring: 185 75% 50%;

    --sidebar-background: 225 50% 5%;
    --sidebar-foreground: 215 20% 65%;
    --sidebar-primary: 185 75% 50%;
    --sidebar-primary-foreground: 222 47% 6%;
    --sidebar-accent: 220 30% 12%;
    --sidebar-accent-foreground: 210 40% 90%;
    --sidebar-border: 220 40% 12%;
    --sidebar-ring: 185 75% 50%;

    --gradient-dark: linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(225 50% 4%) 100%);
    --gradient-card: linear-gradient(135deg, hsl(222 40% 10%) 0%, hsl(222 40% 8%) 100%);
    --gradient-glow: radial-gradient(ellipse at center, hsl(185 75% 50% / 0.15) 0%, transparent 70%);

    --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.3);
    --shadow-md: 0 4px 12px hsl(0 0% 0% / 0.4);
    --shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.5);
    --shadow-glow: 0 0 20px hsl(185 75% 50% / 0.3);
    --shadow-glow-sm: 0 0 8px hsl(185 75% 50% / 0.2);
  }
}
```

---

## 📋 Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        "border-glow": "hsl(var(--border-glow))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          deep: "hsl(var(--background-deep))",
          elevated: "hsl(var(--background-elevated))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          muted: "hsl(var(--foreground-muted))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
          muted: "hsl(var(--primary-muted))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow-sm)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## ✅ Чеклист при создании нового компонента

1. [ ] Использовать только семантические токены цветов (`bg-background`, `text-foreground`, `border-border`)
2. [ ] Не использовать хардкод цветов (`bg-white`, `text-black`, `#FFFFFF`)
3. [ ] Применять правильные скругления (`rounded-lg` для карточек)
4. [ ] Добавлять тени через токены (`shadow-md`, `shadow-glow`)
5. [ ] Проверять отображение во всех 3 темах
6. [ ] Использовать `font-mono` / `font-data` для цифр и кода

---

*Документация создана для проекта Translate AI*
*Версия: 1.0*
*Дата: Декабрь 2025*
