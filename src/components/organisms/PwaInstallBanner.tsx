"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, X } from "lucide-react";

import Logo from "../../../public/favicon_io/android-chrome-192x192.png";

const DISMISSED_AT_KEY = "pwa-install-banner-dismissed-at";
const DISMISSAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

type InstallMode = "chromium" | "ios" | null;

function wasRecentlyDismissed() {
  const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY));
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISSAL_COOLDOWN_MS;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as NavigatorWithStandalone).standalone === true
  );
}

function isIosSafari() {
  const isIos =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isWebKit = /WebKit/.test(navigator.userAgent);
  const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

  return isIos && isWebKit && !isOtherIosBrowser;
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<InstallMode>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    // iOS Safari has no programmatic install prompt, so provide the native
    // Share-sheet instructions instead.
    if (isIosSafari()) setMode("ios");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setMode("chromium");
    };

    const handleAppInstalled = () => {
      localStorage.removeItem(DISMISSED_AT_KEY);
      setDeferredPrompt(null);
      setMode(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "dismissed") {
        localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
      }
    } catch {
      // Browsers may invalidate a deferred prompt after navigation or a
      // concurrent install attempt. The browser's install UI remains available.
    } finally {
      setDeferredPrompt(null);
      setMode(null);
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setDeferredPrompt(null);
    setMode(null);
  }, []);

  if (!mode) return null;

  return (
    <aside
      aria-label="Install Fundable"
      className="fixed left-2 right-2 top-2 z-[60] animate-in slide-in-from-top-4 fade-in duration-500"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/70 px-3 py-2.5 shadow-lg shadow-purple-900/20 backdrop-blur-xl">
        <Image
          src={Logo}
          alt=""
          width={40}
          height={40}
          className="flex-shrink-0 rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-white">
            Add Fundable to your Home Screen
          </p>
          <p className="text-xs leading-tight text-gray-400">
            {mode === "ios"
              ? "Tap Share, then Add to Home Screen."
              : "Install for quick access and an app-like experience."}
          </p>
        </div>

        {mode === "chromium" ? (
          <button
            type="button"
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Download aria-hidden="true" className="size-3.5" />
            {isInstalling ? "Installing…" : "Install"}
          </button>
        ) : (
          <Share aria-hidden="true" className="size-5 flex-shrink-0 text-violet-300" />
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Dismiss install suggestion for seven days"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </aside>
  );
}
