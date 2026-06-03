import { useEffect, useState } from "react";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  initDataUnsafe?: {
    user?: { id: number; first_name?: string; username?: string };
  };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

function getWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function useTelegramWebApp() {
  const [webApp] = useState(getWebApp);

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);

  const user = webApp?.initDataUnsafe?.user;
  const isTelegram = Boolean(webApp);

  const haptic = (type: "light" | "success" | "error" = "light") => {
    if (!webApp?.HapticFeedback) return;
    if (type === "success") webApp.HapticFeedback.notificationOccurred("success");
    else if (type === "error") webApp.HapticFeedback.notificationOccurred("error");
    else webApp.HapticFeedback.impactOccurred("light");
  };

  const shareInvite = (text: string, url: string) => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    if (webApp) {
      webApp.openTelegramLink(shareUrl);
    } else if (navigator.share) {
      void navigator.share({ title: "PlayVerse Games", text, url });
    } else {
      void navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  return {
    webApp,
    isTelegram,
    user,
    colorScheme: webApp?.colorScheme ?? "light",
    displayName: user?.first_name ?? user?.username ?? "Player",
    haptic,
    shareInvite,
  };
}
