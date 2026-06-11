import Icon from "@/components/ui/icon";
import type { IconName } from "./types";

type Step = { text: string; icon?: IconName };

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full gold-gradient text-white text-xs font-body font-medium flex items-center justify-center shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm font-body text-foreground leading-snug flex items-center gap-1.5 flex-wrap">
            {s.text}
            {s.icon && <Icon name={s.icon} size={15} className="inline text-bronze" />}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function InstallSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-light">Установка на телефон</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">
          Добавьте Studio Hub на главный экран — приложение откроется иконкой и будет работать без браузера
        </p>
      </div>

      {/* iPhone */}
      <div className="bg-card rounded-2xl border border-border p-5 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            <Icon name="Apple" size={20} className="text-foreground" fallback="Smartphone" />
          </div>
          <div>
            <h2 className="font-display text-lg font-medium leading-tight">iPhone / iPad</h2>
            <p className="text-xs text-muted-foreground font-body">Браузер Safari</p>
          </div>
        </div>
        <Steps
          steps={[
            { text: "Откройте сайт в браузере Safari" },
            { text: "Нажмите кнопку «Поделиться» внизу экрана", icon: "Share" },
            { text: "Выберите «На экран „Домой“»", icon: "Plus" },
            { text: "Нажмите «Добавить» — готово!", icon: "Check" },
          ]}
        />
      </div>

      {/* Android */}
      <div className="bg-card rounded-2xl border border-border p-5 animate-slide-up stagger-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            <Icon name="Smartphone" size={20} className="text-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-medium leading-tight">Android</h2>
            <p className="text-xs text-muted-foreground font-body">Браузер Chrome</p>
          </div>
        </div>
        <Steps
          steps={[
            { text: "Откройте сайт в браузере Chrome" },
            { text: "Нажмите «Установить» во всплывающей карточке" },
            { text: "Или: меню браузера", icon: "EllipsisVertical" },
            { text: "Выберите «Установить приложение»", icon: "Download" },
          ]}
        />
      </div>

      {/* Подсказка */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Icon name="Info" size={18} className="text-bronze shrink-0 mt-0.5" />
        <p className="text-sm font-body text-foreground leading-snug">
          После установки приложение открывается на весь экран, без адресной строки, и работает даже без интернета.
        </p>
      </div>
    </div>
  );
}
