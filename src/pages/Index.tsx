import { useState } from "react";
import Icon from "@/components/ui/icon";
import { type IconName, type Section, NAV_ITEMS } from "./sections/types";
import FinanceSection from "./sections/FinanceSection";
import { UsersSection, AdsSection, CalendarSection } from "./sections/InfoSections";
import { ProjectsSection, ChatsSection, DocsSection } from "./sections/ListSections";
import InstallSection from "./sections/InstallSection";

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Index({ forceMobile = false }: { forceMobile?: boolean }) {
  const [active, setActive] = useState<Section>("finance");
  const [moreOpen, setMoreOpen] = useState(false);

  // 4 основных пункта в нижнем меню + остальные в «Ещё»
  const primaryNav = NAV_ITEMS.slice(0, 4);
  const secondaryNav = NAV_ITEMS.slice(4);
  const activeItem = NAV_ITEMS.find((i) => i.id === active);
  const isSecondaryActive = secondaryNav.some((i) => i.id === active);

  // forceMobile — мобильный вид при любом размере экрана (для превью /app)
  const sidebarCls = forceMobile ? "hidden" : "hidden md:flex";
  const mobileOnlyCls = forceMobile ? "" : "md:hidden";
  const contentPadCls = forceMobile
    ? "flex-1 overflow-y-auto px-4 py-5 pb-28"
    : "flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8 pb-28 md:pb-8";

  const sectionMap: Record<Section, JSX.Element> = {
    finance: <FinanceSection />,
    users: <UsersSection />,
    ads: <AdsSection />,
    calendar: <CalendarSection />,
    projects: <ProjectsSection />,
    chats: <ChatsSection />,
    docs: <DocsSection />,
    install: <InstallSection />,
  };

  return (
    <div className={`bg-background flex ${forceMobile ? "h-full overflow-hidden" : "min-h-screen"}`}>
      {/* Desktop Sidebar */}
      <aside className={`${sidebarCls} flex-col w-60 bg-sidebar-dark min-h-screen sticky top-0 h-screen shrink-0`}>
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
      <main className={`flex-1 flex flex-col overflow-hidden ${forceMobile ? "h-full" : "min-h-screen"}`}>
        {/* Mobile header */}
        <header className={`${mobileOnlyCls} bg-sidebar-dark sticky top-0 z-10 safe-top`}>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeItem && (
                <div className="w-9 h-9 rounded-xl bg-[hsl(var(--sidebar-accent))] flex items-center justify-center shrink-0">
                  <Icon name={activeItem.icon as IconName} size={18} className="text-gold" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-40 font-body leading-none">Studio Hub</p>
                <h1 className="font-display text-lg text-gold leading-tight truncate">{activeItem?.label}</h1>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-sm text-white font-medium shrink-0">А</div>
          </div>
        </header>

        <div className={contentPadCls}>
          <div className="max-w-3xl mx-auto">
            {sectionMap[active]}
          </div>
        </div>

        {/* Выезжающее меню «Ещё» */}
        {moreOpen && (
          <div className={`${mobileOnlyCls} ${forceMobile ? "absolute" : "fixed"} inset-0 z-30`} onClick={() => setMoreOpen(false)}>
            <div className="absolute inset-0 bg-black/40 animate-fade-in" />
            <div className="absolute bottom-0 left-0 right-0 bg-sidebar-dark rounded-t-3xl p-4 pb-8 safe-bottom animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full bg-[hsl(var(--sidebar-border))] mx-auto mb-4" />
              <p className="text-[11px] text-[hsl(var(--sidebar-foreground))] opacity-40 font-body uppercase tracking-wide px-2 mb-2">Ещё разделы</p>
              <div className="grid grid-cols-3 gap-2">
                {secondaryNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActive(item.id);
                      setMoreOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all duration-200
                      ${active === item.id
                        ? "bg-[hsl(var(--sidebar-accent))] text-gold"
                        : "text-[hsl(var(--sidebar-foreground))] opacity-60"
                      }`}
                  >
                    <Icon name={item.icon as IconName} size={22} />
                    <span className="text-[11px] font-body">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Nav */}
        <nav className={`${mobileOnlyCls} ${forceMobile ? "absolute" : "fixed"} bottom-0 left-0 right-0 bg-sidebar-dark border-t border-[hsl(var(--sidebar-border))] z-20 safe-bottom`}>
          <div className="flex items-stretch">
            {primaryNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMoreOpen(false);
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200
                  ${active === item.id ? "text-gold" : "text-[hsl(var(--sidebar-foreground))] opacity-40"}`}
              >
                <Icon name={item.icon as IconName} size={22} />
                <span className="text-[9px] font-body whitespace-nowrap">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200
                ${isSecondaryActive || moreOpen ? "text-gold" : "text-[hsl(var(--sidebar-foreground))] opacity-40"}`}
            >
              <Icon name={moreOpen ? "X" : "Menu"} size={22} />
              <span className="text-[9px] font-body whitespace-nowrap">Ещё</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}