import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Уже установлено (запущено как приложение)
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;
    if (standalone) return;

    if (localStorage.getItem(DISMISS_KEY)) return;

    const ua = window.navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    if (ios) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    close();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-sm z-40 animate-slide-up">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center shrink-0">
          <Icon name="Smartphone" size={22} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-medium text-foreground leading-tight">
            Установить приложение
          </p>
          {isIOS ? (
            <p className="text-xs text-muted-foreground font-body mt-1 leading-snug">
              Нажмите{" "}
              <Icon name="Share" size={13} className="inline -mt-0.5 text-foreground" /> внизу
              и выберите «На экран „Домой“»
            </p>
          ) : (
            <p className="text-xs text-muted-foreground font-body mt-1 leading-snug">
              Studio Hub откроется иконкой на главном экране и будет работать офлайн
            </p>
          )}
          {!isIOS && (
            <button
              onClick={install}
              className="mt-3 gold-gradient text-white text-sm font-body font-medium rounded-xl px-4 py-2 w-full hover:opacity-90 transition-opacity"
            >
              Установить
            </button>
          )}
        </div>
        <button
          onClick={close}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 -mt-1 -mr-1 p-1"
          aria-label="Закрыть"
        >
          <Icon name="X" size={18} />
        </button>
      </div>
    </div>
  );
}