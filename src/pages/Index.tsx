import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type IconName = string;
type Account = "cash" | "bank";
type Operation = {
  name: string;
  amount: number;
  date: string; // гг.гг.гг (например 26.06.11)
  account: Account;
};
type Section = "finance" | "users" | "ads" | "calendar" | "projects" | "chats" | "docs";

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "finance", label: "Движение денег", icon: "Wallet" },
  { id: "users", label: "Аудитория", icon: "Users" },
  { id: "ads", label: "Реклама", icon: "Megaphone" },
  { id: "calendar", label: "Календарь", icon: "Calendar" },
  { id: "projects", label: "Проекты", icon: "Clapperboard" },
  { id: "chats", label: "Чаты", icon: "MessageSquare" },
  { id: "docs", label: "Документы", icon: "FileText" },
];

// ── Движение денег ────────────────────────────────────────────────────────────
const INITIAL_OPS: Operation[] = [
  { name: "Поступление — Рекламный контракт", amount: 280000, date: "26.06.10", account: "cash" },
  { name: "Выплата зарплаты — команда", amount: -140000, date: "26.06.05", account: "bank" },
  { name: "Поступление — Спецпроект", amount: 120000, date: "26.06.03", account: "bank" },
  { name: "Производственные расходы", amount: -48000, date: "26.06.01", account: "cash" },
  { name: "Инвестиции — брокерский счёт", amount: -50000, date: "26.05.28", account: "bank" },
];

function formatMoney(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toLocaleString("ru-RU")} ₽`;
}

const OPS_STORAGE_KEY = "studiohub_operations";

function loadOps(): Operation[] {
  try {
    const raw = localStorage.getItem(OPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Operation[];
  } catch {
    /* ignore */
  }
  return INITIAL_OPS;
}

function FinanceSection() {
  const now = new Date();
  const monthName = now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  // текущие год/месяц в формате дат операций (гг.мм)
  const curYY = String(now.getFullYear()).slice(2);
  const curMM = String(now.getMonth() + 1).padStart(2, "0");

  const [ops, setOps] = useState<Operation[]>(loadOps);

  useEffect(() => {
    localStorage.setItem(OPS_STORAGE_KEY, JSON.stringify(ops));
  }, [ops]);
  const [open, setOpen] = useState(false);

  // фильтры
  const [filterAccount, setFilterAccount] = useState<"all" | Account>("all");
  const [period, setPeriod] = useState<"month" | "year" | "custom">("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // форма
  const [fDate, setFDate] = useState("");
  const [fName, setFName] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fAccount, setFAccount] = useState<Account>("cash");
  const [fSign, setFSign] = useState<"in" | "out">("in");

  const filtered = useMemo(() => {
    return ops.filter((o) => {
      if (filterAccount !== "all" && o.account !== filterAccount) return false;
      if (o.date === "—") return true;

      if (period === "month") {
        if (!o.date.startsWith(`${curYY}.${curMM}`)) return false;
      } else if (period === "year") {
        if (!o.date.startsWith(`${curYY}.`)) return false;
      } else if (period === "custom") {
        if (customFrom && o.date < customFrom) return false;
        if (customTo && o.date > customTo) return false;
      }
      return true;
    });
  }, [ops, filterAccount, period, customFrom, customTo, curYY, curMM]);

  const cashBalance = ops.filter((o) => o.account === "cash").reduce((s, o) => s + o.amount, 0) + 320000;
  const bankBalance = ops.filter((o) => o.account === "bank").reduce((s, o) => s + o.amount, 0) + 1480000;

  const handleAdd = () => {
    const num = parseInt(fAmount.replace(/\D/g, ""), 10);
    if (!fName.trim() || !num) return;
    const signed = fSign === "out" ? -Math.abs(num) : Math.abs(num);
    setOps([{ name: fName.trim(), amount: signed, date: fDate || "—", account: fAccount }, ...ops]);
    setFDate("");
    setFName("");
    setFAmount("");
    setFAccount("cash");
    setFSign("in");
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Шапка: дата + остатки */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-light text-foreground">Движение денег</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body capitalize">{monthName}</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gold-gradient text-white border-0 hover:opacity-90 shrink-0">
          <Icon name="Plus" size={16} className="mr-1" />
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Остаток — наличные", value: `${cashBalance.toLocaleString("ru-RU")} ₽`, icon: "Banknote", tint: "bg-amber-50 border-amber-200" },
          { label: "Остаток — расчётный счёт", value: `${bankBalance.toLocaleString("ru-RU")} ₽`, icon: "Landmark", tint: "bg-stone-50 border-stone-200" },
        ].map((b, i) => (
          <div key={b.label} className={`rounded-2xl p-5 border card-hover stagger-${i + 1} animate-slide-up ${b.tint}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{b.label}</p>
              <Icon name={b.icon as IconName} size={18} className="text-bronze opacity-70" />
            </div>
            <p className="font-display text-3xl font-semibold mt-2 text-foreground">{b.value}</p>
          </div>
        ))}
      </div>

      {/* Колонки-расшифровки */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Доход", value: "1 840 000 ₽", delta: "+12%", up: true },
          { label: "Расходы", value: "940 000 ₽", delta: "−4%", up: false },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className={`bg-card rounded-2xl p-4 border border-border card-hover stagger-${i + 1} animate-slide-up`}
          >
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{kpi.label}</p>
            <p className="font-display text-xl font-semibold mt-1 text-foreground">{kpi.value}</p>
            <span className={`text-xs font-body font-medium ${kpi.up ? "text-green-600" : "text-red-500"}`}>
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Таблица операций с фильтрами */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-lg font-medium">Последние операции</h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Фильтр по виду операции */}
            <div className="flex bg-muted rounded-lg p-0.5">
              {([
                { id: "all", label: "Все" },
                { id: "cash", label: "нал." },
                { id: "bank", label: "по р/сч" },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterAccount(f.id)}
                  className={`text-xs font-body px-2.5 py-1 rounded-md transition-colors ${
                    filterAccount === f.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Фильтр по периоду */}
            <div className="flex bg-muted rounded-lg p-0.5">
              {([
                { id: "month", label: "Месяц" },
                { id: "year", label: "Год" },
                { id: "custom", label: "Период" },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPeriod(f.id)}
                  className={`text-xs font-body px-2.5 py-1 rounded-md transition-colors ${
                    period === f.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Произвольный период */}
        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
            <span className="text-xs text-muted-foreground font-body">с</span>
            <Input value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} placeholder="гг.гг.гг" className="h-8 w-28 text-xs" />
            <span className="text-xs text-muted-foreground font-body">по</span>
            <Input value={customTo} onChange={(e) => setCustomTo(e.target.value)} placeholder="гг.гг.гг" className="h-8 w-28 text-xs" />
          </div>
        )}

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground font-body text-center py-6">Операций не найдено</p>
          )}
          {filtered.map((tx, i) => {
            const isIn = tx.amount > 0;
            return (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${isIn ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {isIn ? "↓" : "↑"}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-body text-foreground block truncate">{tx.name}</span>
                    <span className={`text-[10px] font-body font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block ${tx.account === "cash" ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-stone-600"}`}>
                      {tx.account === "cash" ? "нал." : "по р/сч"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`text-sm font-medium font-body ${isIn ? "text-green-600" : "text-red-500"}`}>{formatMoney(tx.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Форма добавления операции */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-light">Новая операция</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* 1. Дата */}
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-muted-foreground">Дата</Label>
              <Input value={fDate} onChange={(e) => setFDate(e.target.value)} placeholder="гг.гг.гг (26.06.11)" />
            </div>
            {/* 2. Описание */}
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-muted-foreground">Описание операции</Label>
              <Input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Напр. Поступление — контракт" />
            </div>
            {/* 3. Сумма */}
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-muted-foreground">Сумма, ₽</Label>
              <Input value={fAmount} onChange={(e) => setFAmount(e.target.value)} placeholder="50 000" inputMode="numeric" />
              <div className="flex gap-2 pt-1">
                {([
                  { id: "in", label: "Приход", cls: "text-green-600 border-green-300 bg-green-50" },
                  { id: "out", label: "Расход", cls: "text-red-500 border-red-300 bg-red-50" },
                ] as const).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFSign(s.id)}
                    className={`flex-1 text-xs font-body py-1.5 rounded-lg border transition-all ${
                      fSign === s.id ? s.cls : "border-border text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 4. Вид операции */}
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-muted-foreground">Вид операции</Label>
              <div className="flex gap-2">
                {([
                  { id: "cash", label: "Наличные" },
                  { id: "bank", label: "По р/сч" },
                ] as const).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setFAccount(a.id)}
                    className={`flex-1 text-sm font-body py-2 rounded-lg border transition-all ${
                      fAccount === a.id ? "border-gold bg-amber-50 text-amber-700 font-medium" : "border-border text-muted-foreground"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleAdd} className="gold-gradient text-white border-0 hover:opacity-90">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function UsersSection() {
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
            <p className="font-display text-2xl font-semibold mt-2">{s.value}</p>
            <p className="text-xs text-green-600 font-body mt-1">{s.delta}</p>
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
                <p className="text-sm font-medium font-body text-foreground">{c.views}</p>
                <p className="text-[10px] text-muted-foreground">ER {c.er}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Ads ───────────────────────────────────────────────────────────────────────
function AdsSection() {
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
            <p className="font-display text-2xl font-semibold mt-2">{s.value}</p>
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
                  <span className="text-xs text-muted-foreground font-body w-20 text-right">
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
function CalendarSection() {
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
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-body cursor-pointer transition-colors
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
                <p className="font-display text-lg font-semibold text-amber-600">{e.date}</p>
                <p className="text-[10px] text-muted-foreground">{e.day}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-body">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.time}</p>
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

// ── Projects ──────────────────────────────────────────────────────────────────
function ProjectsSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Проекты</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Съёмки и спецпроекты</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Осенняя коллекция", type: "Лукбук / съёмка", status: "В работе", progress: 65, deadline: "20 июн", team: 4, color: "bg-amber-50 border-amber-200", bar: "bg-amber-400" },
          { title: "Документальная серия", type: "Спецпроект", status: "Планирование", progress: 20, deadline: "15 июл", team: 6, color: "bg-purple-50 border-purple-200", bar: "bg-purple-400" },
          { title: "Рилс-марафон — июнь", type: "Контент", status: "В работе", progress: 80, deadline: "30 июн", team: 3, color: "bg-blue-50 border-blue-200", bar: "bg-blue-400" },
          { title: "Коллаборация — бренд X", type: "Рекламный спецпроект", status: "Согласование", progress: 35, deadline: "10 июл", team: 5, color: "bg-green-50 border-green-200", bar: "bg-green-500" },
        ].map((p, i) => (
          <div key={i} className={`rounded-2xl border p-5 card-hover stagger-${i + 1} animate-slide-up ${p.color}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-lg font-medium text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground font-body">{p.type}</p>
              </div>
              <span className="text-xs font-body font-medium text-muted-foreground bg-white/70 px-2 py-0.5 rounded-full border border-border">
                {p.status}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                  <span>Прогресс</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.bar} transition-all duration-700`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  Дедлайн: {p.deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Users" size={12} />
                  {p.team} чел.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chats ─────────────────────────────────────────────────────────────────────
function ChatsSection() {
  const [active, setActive] = useState(0);

  const chats = [
    { name: "Команда продакшна", last: "Готово, отправляю правки...", time: "14:32", unread: 3, avatar: "🎬" },
    { name: "Менеджеры проектов", last: "Согласовали дедлайн на пятницу", time: "12:15", unread: 0, avatar: "📋" },
    { name: "Рекламный отдел", last: "Новый бриф — смотри в доках", time: "11:08", unread: 1, avatar: "📢" },
    { name: "Финансы", last: "Счёт оплачен, квитанция выслана", time: "Вчера", unread: 0, avatar: "💰" },
    { name: "Контент-группа", last: "Выкладываем в 19:00?", time: "Вчера", unread: 5, avatar: "✨" },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Чаты</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Внутренняя коммуникация</p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {chats.map((c, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-border last:border-0
              ${active === i ? "bg-amber-50" : "hover:bg-muted/50"}`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-body font-medium text-sm text-foreground">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{c.last}</p>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 rounded-full gold-gradient text-white text-[10px] flex items-center justify-center font-medium shrink-0">
                {c.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
          <span className="text-xl">{chats[active].avatar}</span>
          <h3 className="font-body font-medium text-sm">{chats[active].name}</h3>
        </div>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="text-muted-foreground">
            <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-body opacity-40">Чат будет открыт здесь</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Docs ──────────────────────────────────────────────────────────────────────
function DocsSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Документы</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Договоры и согласия</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Всего", value: "142", icon: "FileText" },
          { label: "На подписи", value: "8", icon: "FilePen" },
          { label: "Просрочены", value: "2", icon: "AlertCircle" },
        ].map((s, i) => (
          <div key={s.label} className={`bg-card rounded-2xl p-4 border border-border stagger-${i + 1} animate-slide-up`}>
            <Icon name={s.icon as IconName} size={18} className="text-amber-500 mb-2" />
            <p className="font-display text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-medium">Последние документы</h2>
          <button className="text-xs text-amber-600 font-body hover:underline">Все</button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Договор — коллаборация «Бренд X»", type: "Договор", status: "На подписи", date: "9 июн" },
            { name: "Согласие на образ — Анна К.", type: "Согласие", status: "Подписан", date: "7 июн" },
            { name: "Договор — видеосъёмка осень 2026", type: "Договор", status: "Подписан", date: "5 июн" },
            { name: "NDA — новый партнёр", type: "NDA", status: "На подписи", date: "3 июн" },
            { name: "Согласие — аудиозапись шоу", type: "Согласие", status: "Подписан", date: "1 июн" },
            { name: "Договор — аренда студии", type: "Договор", status: "Просрочен", date: "28 май" },
          ].map((d, i) => {
            const st =
              d.status === "Подписан"
                ? "text-green-600 bg-green-50"
                : d.status === "Просрочен"
                ? "text-red-500 bg-red-50"
                : "text-amber-600 bg-amber-50";
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Icon name="FileText" size={14} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-foreground truncate">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.type} · {d.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-medium shrink-0 ${st}`}>
                  {d.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [active, setActive] = useState<Section>("finance");

  const sectionMap: Record<Section, JSX.Element> = {
    finance: <FinanceSection />,
    users: <UsersSection />,
    ads: <AdsSection />,
    calendar: <CalendarSection />,
    projects: <ProjectsSection />,
    chats: <ChatsSection />,
    docs: <DocsSection />,
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-sidebar-dark min-h-screen sticky top-0 h-screen shrink-0">
        <div className="px-6 py-7 border-b border-[hsl(var(--sidebar-border))]">
          <h1 className="font-display text-2xl text-gold tracking-wide">Studio Hub</h1>
          <p className="text-[11px] text-[hsl(var(--sidebar-foreground))] opacity-40 mt-0.5 font-body">Управление студией</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200
                ${active === item.id
                  ? "bg-[hsl(var(--sidebar-accent))] text-gold"
                  : "text-[hsl(var(--sidebar-foreground))] opacity-60 hover:opacity-100 hover:bg-[hsl(var(--sidebar-accent))]"
                }`}
            >
              <Icon name={item.icon as IconName} size={17} />
              <span>{item.label}</span>
              {active === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-sm text-white font-medium shrink-0">
              А
            </div>
            <div className="min-w-0">
              <p className="text-xs font-body text-[hsl(var(--sidebar-foreground))] font-medium">Администратор</p>
              <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-40 truncate">Studio Hub</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-sidebar-dark sticky top-0 z-10">
          <h1 className="font-display text-xl text-gold">Studio Hub</h1>
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-sm text-white font-medium">А</div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="max-w-3xl mx-auto">
            {sectionMap[active]}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-dark border-t border-[hsl(var(--sidebar-border))] z-20 safe-area-pb">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 min-w-[64px] transition-all duration-200
                  ${active === item.id ? "text-gold" : "text-[hsl(var(--sidebar-foreground))] opacity-40"}`}
              >
                <Icon name={item.icon as IconName} size={20} />
                <span className="text-[9px] font-body whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}