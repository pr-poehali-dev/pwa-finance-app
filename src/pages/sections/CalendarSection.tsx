import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EVENT_CATEGORIES,
  type CalEvent,
  type Contact,
  type EventCategory,
} from "./types";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const pad = (n: number) => String(n).padStart(2, "0");
const makeDate = (y: number, m: number, d: number) => `${String(y).slice(2)}.${pad(m + 1)}.${pad(d)}`;

const INITIAL_CONTACTS: Contact[] = [
  { id: "c1", fio: "Иванова Мария Сергеевна", phone: "+7 999 120-45-67", email: "maria@mail.ru", telegram: "@maria_iv", instagram: "@maria.style", contactPerson: "Агент — Ольга" },
  { id: "c2", fio: "Петров Алексей", phone: "+7 905 333-22-11", email: "petrov@gmail.com", telegram: "@alex_p", instagram: "@alexphoto", contactPerson: "" },
];

const INITIAL_EVENTS: CalEvent[] = [
  { id: "e1", date: "26.06.11", timeStart: "10:00", timeEnd: "14:00", category: "offline", title: "Съёмка — лукбук осень" },
  { id: "e2", date: "26.06.12", timeStart: "15:00", timeEnd: "16:30", category: "internal", title: "Планёрка команды" },
  { id: "e3", date: "26.06.14", timeStart: "12:00", timeEnd: "13:00", category: "community", title: "Интервью с гостем", guestId: "c1", agreementSigned: true, approvedByGuest: true },
  { id: "e4", date: "26.06.20", timeStart: "09:00", timeEnd: "11:00", category: "online", title: "Онлайн-запись подкаста", zoomLink: "https://zoom.us/j/123456" },
];

export default function CalendarSection() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5); // июнь (0-индекс)
  const [filter, setFilter] = useState<EventCategory | "all">("all");

  const [open, setOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  // Форма события
  const emptyForm = {
    date: makeDate(viewYear, viewMonth, 1),
    timeStart: "",
    timeEnd: "",
    category: "offline" as EventCategory,
    title: "",
    guestId: "",
    agreementSigned: false,
    approvedByGuest: false,
    zoomLink: "",
  };
  const [form, setForm] = useState(emptyForm);

  const monthEvents = useMemo(() => {
    const prefix = `${String(viewYear).slice(2)}.${pad(viewMonth + 1)}.`;
    return events
      .filter((e) => e.date.startsWith(prefix))
      .filter((e) => filter === "all" || e.category === filter)
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeStart.localeCompare(b.timeStart));
  }, [events, viewYear, viewMonth, filter]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Пн = 0

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalEvent[]> = {};
    const prefix = `${String(viewYear).slice(2)}.${pad(viewMonth + 1)}.`;
    events
      .filter((e) => e.date.startsWith(prefix))
      .filter((e) => filter === "all" || e.category === filter)
      .forEach((e) => {
        const d = parseInt(e.date.slice(-2), 10);
        (map[d] = map[d] || []).push(e);
      });
    return map;
  }, [events, viewYear, viewMonth, filter]);

  const prevMonth = () => {
    setViewMonth((m) => (m === 0 ? (setViewYear((y) => y - 1), 11) : m - 1));
  };
  const nextMonth = () => {
    setViewMonth((m) => (m === 11 ? (setViewYear((y) => y + 1), 0) : m + 1));
  };

  const catInfo = (id: EventCategory) => EVENT_CATEGORIES.find((c) => c.id === id)!;
  const guestName = (id?: string) => contacts.find((c) => c.id === id)?.fio || "";

  const openAdd = () => {
    setForm({ ...emptyForm, date: makeDate(viewYear, viewMonth, 1) });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.timeStart) return;
    setEvents((prev) => [
      ...prev,
      {
        id: `e${Date.now()}`,
        date: form.date,
        timeStart: form.timeStart,
        timeEnd: form.timeEnd,
        category: form.category,
        title: form.title.trim(),
        guestId: form.category === "community" ? form.guestId || undefined : undefined,
        agreementSigned: form.category === "community" ? form.agreementSigned : undefined,
        approvedByGuest: form.category === "community" ? form.approvedByGuest : undefined,
        zoomLink: form.zoomLink.trim() || undefined,
      },
    ]);
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Календарь</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body font-semibold">
            {MONTHS[viewMonth]} {viewYear}
          </p>
        </div>
        <Button onClick={openAdd} className="gold-gradient text-white border-0 hover:opacity-90 shrink-0 h-10 px-4">
          <Icon name="Plus" size={18} className="mr-1" />
          Событие
        </Button>
      </div>

      {/* Переключатель месяца */}
      <div className="flex items-center justify-between bg-card rounded-2xl border border-border p-2">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="ChevronLeft" size={18} />
        </button>
        <span className="font-body font-semibold text-sm">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
            filter === "all" ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border"
          }`}
        >
          Все
        </button>
        {EVENT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
              filter === c.id ? c.style : "bg-card text-muted-foreground border-border"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
            {c.label}
          </button>
        ))}
      </div>

      {/* Сетка месяца */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground font-body py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = eventsByDay[day] || [];
            return (
              <div
                key={day}
                className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-num text-foreground hover:bg-muted transition-colors"
              >
                {day}
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e, k) => (
                      <span key={k} className={`w-1 h-1 rounded-full ${catInfo(e.category).dot}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Список событий месяца */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-medium">События месяца</h2>
          <button
            onClick={() => setContactsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-body text-bronze hover:opacity-80 transition-opacity"
          >
            <Icon name="Contact" size={15} />
            Контрагенты
          </button>
        </div>
        <div className="space-y-3">
          {monthEvents.length === 0 && (
            <p className="text-sm text-muted-foreground font-body text-center py-6">Событий нет</p>
          )}
          {monthEvents.map((e) => {
            const c = catInfo(e.category);
            return (
              <div key={e.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="text-center min-w-[40px]">
                  <p className="font-num text-lg font-semibold text-amber-600">{e.date.slice(-2)}</p>
                  <p className="text-[10px] text-muted-foreground font-num whitespace-nowrap">{e.timeStart}{e.timeEnd ? `–${e.timeEnd}` : ""}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body">{e.title}</p>
                  {e.guestId && (
                    <p className="text-xs text-muted-foreground font-body mt-0.5 flex items-center gap-1">
                      <Icon name="User" size={12} /> {guestName(e.guestId)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {e.category === "community" && (
                      <>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-body ${e.agreementSigned ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                          {e.agreementSigned ? "Соглашение ✓" : "Без соглашения"}
                        </span>
                        {e.approvedByGuest && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-body bg-blue-50 text-blue-700">Согласовано</span>
                        )}
                      </>
                    )}
                    {e.zoomLink && (
                      <a href={e.zoomLink} target="_blank" rel="noreferrer" className="text-[10px] px-1.5 py-0.5 rounded font-body bg-blue-50 text-blue-700 flex items-center gap-1">
                        <Icon name="Video" size={11} /> Zoom
                      </a>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body shrink-0 ${c.style}`}>
                  {c.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Диалог добавления события */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-light">Новое событие</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-body text-muted-foreground">Дата (гг.мм.дд)</Label>
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="26.06.11" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-body text-muted-foreground">Время начала</Label>
                <Input type="time" value={form.timeStart} onChange={(e) => setForm({ ...form, timeStart: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-body text-muted-foreground">Время окончания</Label>
                <Input type="time" value={form.timeEnd} onChange={(e) => setForm({ ...form, timeEnd: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-body text-muted-foreground">Тип события</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as EventCategory })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-body text-muted-foreground">Название</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Например, интервью с гостем" className="mt-1" />
            </div>

            {/* Условные поля для категории «В сообществе» */}
            {form.category === "community" && (
              <div className="space-y-4 rounded-xl bg-muted/50 p-3 border border-border">
                <div>
                  <Label className="text-xs font-body text-muted-foreground">Гость (контрагент)</Label>
                  <Select value={form.guestId} onValueChange={(v) => setForm({ ...form, guestId: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Выберите гостя" /></SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.fio}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => { setOpen(false); setContactsOpen(true); }}
                    className="text-[11px] text-bronze font-body mt-1.5 flex items-center gap-1 hover:opacity-80"
                  >
                    <Icon name="Plus" size={12} /> Добавить контрагента
                  </button>
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-body">Подписано соглашение? (ПЭП)</span>
                  <Checkbox checked={form.agreementSigned} onCheckedChange={(v) => setForm({ ...form, agreementSigned: !!v })} />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-body">Согласовано гостем</span>
                  <Checkbox checked={form.approvedByGuest} onCheckedChange={(v) => setForm({ ...form, approvedByGuest: !!v })} />
                </label>
              </div>
            )}

            <div>
              <Label className="text-xs font-body text-muted-foreground">Ссылка Zoom</Label>
              <Input value={form.zoomLink} onChange={(e) => setForm({ ...form, zoomLink: e.target.value })} placeholder="https://zoom.us/j/..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleSave} className="gold-gradient text-white border-0">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Справочник Контрагенты */}
      <ContactsDialog
        open={contactsOpen}
        onOpenChange={setContactsOpen}
        contacts={contacts}
        onAdd={(c) => setContacts((prev) => [...prev, c])}
      />
    </div>
  );
}

// ── Справочник контрагентов ───────────────────────────────────────────────────
function ContactsDialog({
  open,
  onOpenChange,
  contacts,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contacts: Contact[];
  onAdd: (c: Contact) => void;
}) {
  const empty = { fio: "", phone: "", email: "", telegram: "", instagram: "", contactPerson: "" };
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);

  const save = () => {
    if (!form.fio.trim()) return;
    onAdd({ id: `c${Date.now()}`, ...form, fio: form.fio.trim() });
    setForm(empty);
    setAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-light">Контрагенты</DialogTitle>
        </DialogHeader>

        {!adding ? (
          <>
            <div className="space-y-2 py-1">
              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground font-body text-center py-4">Список пуст</p>
              )}
              {contacts.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-body font-medium">{c.fio}</p>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground font-body">
                    {c.phone && <p className="font-num">{c.phone}</p>}
                    {c.email && <p>{c.email}</p>}
                    {(c.telegram || c.instagram) && (
                      <p>{[c.telegram, c.instagram].filter(Boolean).join(" · ")}</p>
                    )}
                    {c.contactPerson && <p>Контакт: {c.contactPerson}</p>}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setAdding(true)} className="gold-gradient text-white border-0 w-full">
                <Icon name="Plus" size={16} className="mr-1" /> Добавить контрагента
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-3 py-1">
              <div>
                <Label className="text-xs font-body text-muted-foreground">ФИО</Label>
                <Input value={form.fio} onChange={(e) => setForm({ ...form, fio: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-body text-muted-foreground">Номер телефона</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 ..." className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-body text-muted-foreground">E-mail</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-body text-muted-foreground">Telegram</Label>
                  <Input value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@ник" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-body text-muted-foreground">Instagram</Label>
                  <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@ник" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-body text-muted-foreground">Контактное лицо</Label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Агент, менеджер и т.п." className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdding(false)}>Назад</Button>
              <Button onClick={save} className="gold-gradient text-white border-0">Сохранить</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
