import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { IconName } from "./types";

// ── Projects ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
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
                  <span className="font-num">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.bar} transition-all duration-700`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  Дедлайн: <span className="font-num whitespace-nowrap">{p.deadline}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Users" size={12} />
                  <span className="font-num">{p.team}</span> чел.
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
export function ChatsSection() {
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
                <span className="text-[10px] text-muted-foreground font-num whitespace-nowrap">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{c.last}</p>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 rounded-full gold-gradient text-white text-[10px] flex items-center justify-center font-medium shrink-0 font-num">
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
export function DocsSection() {
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
            <p className="font-num text-2xl font-semibold">{s.value}</p>
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
                  <p className="text-[10px] text-muted-foreground">{d.type} · <span className="font-num whitespace-nowrap">{d.date}</span></p>
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