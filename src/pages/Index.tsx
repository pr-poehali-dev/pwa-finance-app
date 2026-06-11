import { useState } from "react";
import Icon from "@/components/ui/icon";
import { type IconName, type Section, NAV_ITEMS } from "./sections/types";
import FinanceSection from "./sections/FinanceSection";
import { UsersSection, AdsSection, CalendarSection } from "./sections/InfoSections";
import { ProjectsSection, ChatsSection, DocsSection } from "./sections/ListSections";

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
