import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Network, 
  Map, 
  Brain, 
  Shield, 
  Layers, 
  Globe2, 
  Compass, 
  Languages,
  Database,
  Cpu,
  Sparkles
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Research</span>
        </Link>
        <ThemeSwitcher />
      </header>

      {/* Hero Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-8 py-20"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.div variants={fadeIn} className="mb-4">
          <span className="text-xs text-primary uppercase tracking-[0.2em] font-medium">
            AI-Powered Research Intelligence
          </span>
        </motion.div>
        
        <motion.h1 
          variants={fadeIn}
          className="text-5xl md:text-6xl font-serif font-normal text-foreground mb-6 tracking-tight"
        >
          STRATA RESEARCH
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
        >
          Единая точка доступа к глобальной науке. AI-движок, превращающий хаос неструктурированных данных в готовый аналитический продукт.
        </motion.p>
      </motion.section>

      {/* Problem & Solution */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider mb-8">
              ПРОБЛЕМА И РЕШЕНИЕ
            </h2>
            
            <p className="text-lg text-foreground/90 leading-relaxed mb-8">
              В условиях ограниченного доступа к западным базам (Scopus/WoS), Strata Research выступает как{' '}
              <span className="text-primary font-medium">единая точка доступа к глобальной науке</span>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl border border-border bg-card/50">
                <Database className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">Мировые издательства</h3>
                <p className="text-sm text-muted-foreground">
                  Elsevier, Springer, IEEE, ACS — легальная агрегация метаданных и полных текстов
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card/50">
                <Globe2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">Российская наука</h3>
                <p className="text-sm text-muted-foreground">
                  Партнерство с изд. «Наука» РАН + 300 журналов
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-base text-foreground/90 leading-relaxed">
                Наш <span className="font-semibold text-primary">AI-движок</span> превращает хаос неструктурированных данных в готовый аналитический продукт
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Core */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider mb-8">
              ТЕХНОЛОГИЧЕСКОЕ ЯДРО (THE ENGINE)
            </h2>

            <div className="grid gap-4">
              {[
                {
                  icon: Search,
                  title: 'RAG + Visual RAG',
                  description: 'Гибридный поиск по текстам, диаграммам и таблицам'
                },
                {
                  icon: Network,
                  title: 'Graph RAG',
                  description: 'Выявление скрытых связей и цитирований'
                },
                {
                  icon: Map,
                  title: 'UMAP + KNN',
                  description: 'Топологическое моделирование ландшафта (вид "сверху")'
                },
                {
                  icon: Brain,
                  title: 'Agentic Reasoning',
                  description: 'Агентный синтез финальных выводов и гипотез'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pilot Case */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider mb-4">
              ПИЛОТНЫЙ КЕЙС: ADVANCED MATERIALS (2024–2025)
            </h2>
            <p className="text-muted-foreground mb-8">
              Мы доказали эффективность на реальных данных
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-4xl font-serif text-primary mb-2">75 000</div>
                <div className="text-sm text-muted-foreground">статей обработано</div>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-4xl font-serif text-primary mb-2">20 000</div>
                <div className="text-sm text-muted-foreground">высокорелевантных исследований</div>
              </div>
            </div>

            {/* Research Areas */}
            <h3 className="text-base font-semibold text-foreground mb-4">Ключевые направления:</h3>
            <div className="space-y-4 mb-10">
              {[
                {
                  title: 'Композиты',
                  items: 'Углеволокно, прекурсоры, современные эпоксидные связующие'
                },
                {
                  title: 'Аддитивные технологии',
                  items: 'SLM-печать, металлопорошки, AI-дефектоскопия'
                },
                {
                  title: 'Накопители энергии',
                  items: 'Li-ion катоды, твердотельные электролиты, технологии рециклинга'
                }
              ].map((area, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{area.title}:</span>{' '}
                    <span className="text-muted-foreground">{area.items}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Результат:</div>
                  <p className="text-foreground/90">
                    Заказчик получил не список ссылок, а <span className="text-primary font-medium">интерактивную 3D-карту технологий</span> и структурированный отчет с выявленными трендами
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Advantages */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider mb-8">
              КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА (WHY US?)
            </h2>

            <div className="grid gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Безопасность (On-premise)',
                  description: 'Решение класса Enterprise, которое можно развернуть локально в закрытом контуре заказчика (на open-source моделях Qwen/Llama/Saiga). Полная конфиденциальность запросов.'
                },
                {
                  icon: Layers,
                  title: 'Глубокая структуризация',
                  description: 'Многостадийный Reasoning Pipeline извлекает факты, которые пропускает обычный поиск.'
                },
                {
                  icon: Map,
                  title: 'Визуальная навигация',
                  description: 'В отличие от текстовых списков (Elicit, Consensus), мы даем 3D-обзор поля (UMAP), позволяя мгновенно видеть кластеры и белые пятна.'
                },
                {
                  icon: Compass,
                  title: 'Междисциплинарный поиск (Discovery)',
                  description: 'Находит неочевидные пересечения (например, методы из «Физики плазмы» применимые в «Обработке материалов»).'
                },
                {
                  icon: Languages,
                  title: 'Мультиязычность',
                  description: 'Мгновенный перевод и анализ материалов на 40+ языках (стираем языковой барьер с Китаем и Азией).'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl border border-border bg-background"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Cpu className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-foreground mb-4">
              Готовы начать исследование?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Попробуйте Strata Research Engine на вашей задаче
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Начать поиск
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
