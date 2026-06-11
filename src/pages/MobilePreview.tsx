import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import Index from "./Index";

// Страница-превью: показывает приложение в рамке смартфона
export default function MobilePreview() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center p-4 gap-5">
      {/* Переключатель на сайт */}
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-body text-stone-600 hover:text-stone-900 transition-colors bg-white/70 rounded-full px-4 py-2 shadow-sm"
      >
        <Icon name="Monitor" size={16} />
        Открыть вид сайта
      </Link>

      {/* Рамка телефона */}
      <div className="relative">
        <div
          className="relative bg-black rounded-[2.8rem] p-3 shadow-2xl"
          style={{ width: 390, maxWidth: "92vw" }}
        >
          {/* Экран */}
          <div
            className="relative bg-background rounded-[2.1rem] overflow-hidden"
            style={{ height: 780, maxHeight: "78vh" }}
          >
            {/* Чёлка */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50" />
            <div className="h-full overflow-hidden">
              <Index forceMobile />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs font-body text-stone-500">Так приложение выглядит на телефоне</p>
    </div>
  );
}
