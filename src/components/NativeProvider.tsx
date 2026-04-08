"use client";

import { useEffect } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export const native = {
  haptics: {
    impact: async (style: ImpactStyle = ImpactStyle.Medium) => {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style });
      }
    },
    notification: async (type: NotificationType = NotificationType.Success) => {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type });
      }
    },
    selection: async () => {
      if (Capacitor.isNativePlatform()) {
        await Haptics.selectionStart();
      }
    }
  }
};

export function NativeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: "#050505" });
    }
  }, []);

  return <>{children}</>;
}
