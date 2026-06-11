import Index from "./Index";

// Страница-превью: показывает приложение в рамке смартфона
export default function MobilePreview() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center p-4 gap-5">
      {/* Рамка телефона — пропорции iPhone 19.5:9 */}
      <div
        className="relative bg-black rounded-[2.8rem] p-3 shadow-2xl shrink-0"
        style={{ aspectRatio: "9 / 19.5", height: "min(85vh, 800px)" }}
      >
        {/* Экран */}
        <div className="relative bg-background rounded-[2.1rem] overflow-hidden h-full w-full">
          {/* Чёлка */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50" />
          <div className="h-full overflow-hidden">
            <Index forceMobile />
          </div>
        </div>
      </div>

      <p className="text-xs font-body text-stone-500">Так приложение выглядит на телефоне</p>
    </div>
  );
}