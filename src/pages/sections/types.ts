export type IconName = string;
export type Account = "cash" | "bank";
export type Operation = {
  name: string;
  amount: number;
  date: string; // гг.гг.гг (например 26.06.11)
  account: Account;
};
export type Section = "finance" | "users" | "ads" | "calendar" | "projects" | "chats" | "docs";

export const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "finance", label: "Движение денег", icon: "Wallet" },
  { id: "users", label: "Аудитория", icon: "Users" },
  { id: "ads", label: "Реклама", icon: "Megaphone" },
  { id: "calendar", label: "Календарь", icon: "Calendar" },
  { id: "projects", label: "Проекты", icon: "Clapperboard" },
  { id: "chats", label: "Чаты", icon: "MessageSquare" },
  { id: "docs", label: "Документы", icon: "FileText" },
];
