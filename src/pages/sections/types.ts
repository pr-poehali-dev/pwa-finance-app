export type IconName = string;
export type Account = "cash" | "bank";
export type Operation = {
  name: string;
  amount: number;
  date: string; // гг.гг.гг (например 26.06.11)
  account: Account;
};
// Категории событий календаря
export type EventCategory = "community" | "internal" | "offline" | "online";

export const EVENT_CATEGORIES: { id: EventCategory; label: string; short: string; style: string; dot: string; cell: string }[] = [
  { id: "community", label: "В сообществе", short: "Сообщество", style: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400", cell: "bg-purple-100 text-purple-800 border border-purple-300" },
  { id: "internal", label: "Внутренние", short: "Внутр.", style: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400", cell: "bg-blue-100 text-blue-800 border border-blue-300" },
  { id: "offline", label: "Офлайн съёмки", short: "Офлайн", style: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400", cell: "bg-amber-100 text-amber-800 border border-amber-300" },
  { id: "online", label: "Онлайн запись", short: "Онлайн", style: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-400", cell: "bg-green-100 text-green-800 border border-green-300" },
];

// Контрагент (справочник гостей)
export type Contact = {
  id: number;
  fio: string;
  phone: string;
  email: string;
  telegram: string;
  instagram: string;
  contactPerson: string;
};

// Событие календаря
export type CalEvent = {
  id: number;
  date: string; // гг.мм.дд (например 26.06.11)
  timeStart: string;
  timeEnd: string;
  category: EventCategory;
  title: string;
  guestId?: number | null; // для категории "В сообществе"
  agreementSigned?: boolean; // подписано соглашение (ПЭП)
  approvedByGuest?: boolean; // согласовано гостем
  zoomLink?: string;
};

export type Section = "finance" | "users" | "ads" | "calendar" | "projects" | "chats" | "docs" | "install";

export const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "finance", label: "Движение денег", icon: "Wallet" },
  { id: "users", label: "Аудитория", icon: "Users" },
  { id: "ads", label: "Реклама", icon: "Megaphone" },
  { id: "calendar", label: "Календарь", icon: "Calendar" },
  { id: "projects", label: "Проекты", icon: "Clapperboard" },
  { id: "chats", label: "Чаты", icon: "MessageSquare" },
  { id: "docs", label: "Документы", icon: "FileText" },
  { id: "install", label: "Установка", icon: "Download" },
];