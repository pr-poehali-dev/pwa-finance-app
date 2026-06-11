import { useState, useMemo, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Account, IconName, Operation } from "./types";

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

// "гг.мм.дд" → Date (например "26.06.11" → 11 июня 2026)
function parseOpDate(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  return new Date(2000 + Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Date → "гг.мм.дд"
function toOpDate(d: Date): string {
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

function formatRangeLabel(range?: DateRange): string {
  if (!range?.from) return "Выбрать период";
  const f = range.from.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
  if (!range.to) return f;
  const t = range.to.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
  return `${f} – ${t}`;
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

export default function FinanceSection() {
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
  const [range, setRange] = useState<DateRange | undefined>();
  const [calOpen, setCalOpen] = useState(false);

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
        const d = parseOpDate(o.date);
        if (!d) return false;
        if (range?.from) {
          const from = new Date(range.from);
          from.setHours(0, 0, 0, 0);
          if (d < from) return false;
        }
        if (range?.to) {
          const to = new Date(range.to);
          to.setHours(23, 59, 59, 999);
          if (d > to) return false;
        }
      }
      return true;
    });
  }, [ops, filterAccount, period, range, curYY, curMM]);

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
                  onClick={() => {
                    setPeriod(f.id);
                    if (f.id === "custom") setCalOpen(true);
                  }}
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

        {/* Произвольный период — календарь + ручной ввод */}
        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-body gap-1.5">
                  <Icon name="CalendarRange" size={14} />
                  {formatRangeLabel(range)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={1}
                  initialFocus
                />
                <div className="flex items-center justify-between p-2 border-t border-border">
                  <button onClick={() => setRange(undefined)} className="text-xs text-muted-foreground font-body hover:text-foreground px-2">
                    Сбросить
                  </button>
                  <Button size="sm" className="h-7 text-xs gold-gradient text-white border-0" onClick={() => setCalOpen(false)}>
                    Готово
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <span className="text-xs text-muted-foreground font-body">или вручную:</span>
            <Input
              value={range?.from ? toOpDate(range.from) : ""}
              onChange={(e) => {
                const d = parseOpDate(e.target.value);
                setRange((r) => ({ from: d ?? undefined, to: r?.to }));
              }}
              placeholder="гг.мм.дд"
              className="h-8 w-28 text-xs"
            />
            <span className="text-xs text-muted-foreground font-body">—</span>
            <Input
              value={range?.to ? toOpDate(range.to) : ""}
              onChange={(e) => {
                const d = parseOpDate(e.target.value);
                setRange((r) => ({ from: r?.from, to: d ?? undefined }));
              }}
              placeholder="гг.мм.дд"
              className="h-8 w-28 text-xs"
            />
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
