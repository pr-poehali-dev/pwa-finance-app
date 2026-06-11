import Icon from "@/components/ui/icon";
import type { IconName } from "./types";

// ── Users ─────────────────────────────────────────────────────────────────────
export function UsersSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Аудитория</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Статистика комьюнити</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          { label: "Подписчиков", value: "128 400", delta: "+3 200", icon: "Users" },
          { label: "Охват / мес", value: "2.4 млн", delta: "+14%", icon: "Eye" },
          { label: "ER средний", value: "6.8%", delta: "+0.4%", icon: "Heart" },
          { label: "Новых за месяц", value: "+8 100", delta: "+22%", icon: "UserPlus" },
          { label: "Отписок", value: "−1 400", delta: "−3%", icon: "UserMinus" },
          { label: "Сохранений", value: "47 600", delta: "+18%", icon: "Bookmark" },
        ].map((s, i) => (
          <div key={s.label} className={`bg-card rounded-2xl p-4 border border-border card-hover stagger-${i + 1} animate-slide-up`}>
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{s.label}</p>
              <Icon name={s.icon as IconName} size={16} className="text-amber-500 opacity-70" />
            </div>
            <p className="font-num text-2xl font-semibold mt-2 whitespace-nowrap">{s.value}</p>
            <p className="text-xs text-green-600 font-num mt-1">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="font-display text-lg font-medium mb-4">Топ контент за месяц</h2>
        <div className="space-y-3">
          {[
            { title: "Закулисье съёмок — рилс", views: "482 000", er: "8.2%" },
            { title: "Анонс нового проекта", views: "310 000", er: "7.4%" },
            { title: "День из жизни команды", views: "275 000", er: "6.9%" },
            { title: "Q&A со звездой", views: "198 000", er: "9.1%" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                <span className="text-sm font-body">{c.title}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium font-num text-foreground whitespace-nowrap">{c.views}</p>
                <p className="text-[10px] text-muted-foreground">ER <span className="font-num">{c.er}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Ads ───────────────────────────────────────────────────────────────────────
export function AdsSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Реклама</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Рекламные кампании</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Активных кампаний", value: "7", icon: "Zap" },
          { label: "Бюджет / мес", value: "380 000 ₽", icon: "Wallet" },
          { label: "Потрачено", value: "214 000 ₽", icon: "CreditCard" },
          { label: "Остаток", value: "166 000 ₽", icon: "PiggyBank" },
        ].map((s, i) => (
          <div key={s.label} className={`bg-card rounded-2xl p-4 border border-border card-hover stagger-${i + 1} animate-slide-up`}>
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide leading-tight">{s.label}</p>
              <Icon name={s.icon as IconName} size={16} className="text-amber-500 opacity-70 shrink-0" />
            </div>
            <p className="font-num text-2xl font-semibold mt-2 whitespace-nowrap">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="font-display text-lg font-medium mb-4">Активные кампании</h2>
        <div className="space-y-4">
          {[
            { name: "Осенняя коллекция — ВКонтакте", budget: 80000, spent: 54000, status: "Активна" },
            { name: "Бренд-имидж — Telegram Ads", budget: 60000, spent: 38000, status: "Активна" },
            { name: "Промо шоу — Reels", budget: 50000, spent: 50000, status: "Завершена" },
            { name: "Ретаргетинг — VK", budget: 40000, spent: 21000, status: "Пауза" },
          ].map((c, i) => {
            const pct = Math.round((c.spent / c.budget) * 100);
            const statusColor =
              c.status === "Активна"
                ? "text-green-600 bg-green-50"
                : c.status === "Пауза"
                ? "text-amber-600 bg-amber-50"
                : "text-stone-500 bg-stone-100";
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusColor}`}>{c.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-num w-20 text-right whitespace-nowrap">
                    {c.spent.toLocaleString("ru")} / {c.budget.toLocaleString("ru")} ₽
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────────
export function CalendarSection() {
  const events = [
    { date: "11", day: "Ср", title: "Съёмка — лукбук осень", type: "shoot", time: "10:00" },
    { date: "12", day: "Чт", title: "Встреча с рекламодателем", type: "meeting", time: "15:00" },
    { date: "14", day: "Сб", title: "Спецпроект — закулисье", type: "special", time: "12:00" },
    { date: "17", day: "Вт", title: "Дедлайн — контент-план июль", type: "deadline", time: "18:00" },
    { date: "20", day: "Пт", title: "Съёмка — рилс-серия", type: "shoot", time: "09:00" },
    { date: "25", day: "Ср", title: "Выплата зарплаты", type: "finance", time: "—" },
    { date: "28", day: "Сб", title: "Ивент — презентация проекта", type: "event", time: "19:00" },
  ];

  const typeStyle: Record<string, string> = {
    shoot: "bg-amber-50 text-amber-700 border-amber-200",
    meeting: "bg-blue-50 text-blue-700 border-blue-200",
    special: "bg-purple-50 text-purple-700 border-purple-200",
    deadline: "bg-red-50 text-red-600 border-red-200",
    finance: "bg-green-50 text-green-700 border-green-200",
    event: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const typeLabel: Record<string, string> = {
    shoot: "Съёмка",
    meeting: "Встреча",
    special: "Спецпроект",
    deadline: "Дедлайн",
    finance: "Финансы",
    event: "Ивент",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Календарь</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Июнь 2026</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="grid grid-cols-7 mb-2">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground font-body py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* June 2026 starts on Monday */}
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const hasEvent = events.some((e) => parseInt(e.date) === day);
            const isToday = day === 11;
            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-num cursor-pointer transition-colors
                  ${isToday ? "gold-gradient text-white font-semibold shadow-sm" : hasEvent ? "bg-amber-50 text-amber-800 border border-amber-200" : "hover:bg-muted text-foreground"}`}
              >
                {day}
                {hasEvent && !isToday && <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="font-display text-lg font-medium mb-4">Ближайшие события</h2>
        <div className="space-y-3">
          {events.map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="text-center min-w-[40px]">
                <p className="font-num text-lg font-semibold text-amber-600">{e.date}</p>
                <p className="text-[10px] text-muted-foreground">{e.day}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-body">{e.title}</p>
                <p className="text-xs text-muted-foreground font-num">{e.time}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body shrink-0 ${typeStyle[e.type]}`}>
                {typeLabel[e.type]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}