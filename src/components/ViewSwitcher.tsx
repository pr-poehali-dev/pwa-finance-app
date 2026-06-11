import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

// Плавающий переключатель между видом сайта (/) и видом телефона (/app)
export default function ViewSwitcher() {
  const { pathname } = useLocation();
  const isApp = pathname === "/app";

  return (
    <div className="fixed top-3 right-3 z-[60] flex items-center bg-black/80 backdrop-blur rounded-full p-1 shadow-lg">
      <Link
        to="/"
        className={`flex items-center gap-1.5 text-xs font-body rounded-full px-3 py-1.5 transition-colors ${
          !isApp ? "bg-gold text-black font-medium" : "text-white/70 hover:text-white"
        }`}
      >
        <Icon name="Monitor" size={14} />
        Сайт
      </Link>
      <Link
        to="/app"
        className={`flex items-center gap-1.5 text-xs font-body rounded-full px-3 py-1.5 transition-colors ${
          isApp ? "bg-gold text-black font-medium" : "text-white/70 hover:text-white"
        }`}
      >
        <Icon name="Smartphone" size={14} />
        Телефон
      </Link>
    </div>
  );
}
