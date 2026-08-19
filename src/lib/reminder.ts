/**
 * Client-side in-app reminder using the Notification API.
 * Schedules a daily check; if the user hasn't completed, shows a notification.
 */

let reminderInterval: ReturnType<typeof setInterval> | null = null;

export function startReminderCheck() {
  if (reminderInterval) return;

  reminderInterval = setInterval(() => {
    const enabled = localStorage.getItem("dr_reminderEnabled") === "true";
    if (!enabled) return;

    const targetTime = localStorage.getItem("dr_reminderTime") || "08:00";
    const now = new Date();
    const [h, m] = targetTime.split(":").map(Number);

    // Fire within a 2-minute window of the reminder time
    if (now.getHours() === h && Math.abs(now.getMinutes() - m) <= 1) {
      showReminder();
    }
  }, 60_000);
}

export function stopReminderCheck() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
}

function showReminder() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification("Daily Refresh", {
      body: "Your daily Bible reading is ready. Just 2 minutes!",
      icon: "/icon.svg",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
