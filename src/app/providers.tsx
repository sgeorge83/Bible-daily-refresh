"use client";

import { useEffect } from "react";
import { startReminderCheck, requestNotificationPermission } from "@/lib/reminder";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startReminderCheck();
    // Ask permission if reminders enabled
    if (localStorage.getItem("dr_reminderEnabled") === "true") {
      requestNotificationPermission();
    }
  }, []);

  return <>{children}</>;
}
