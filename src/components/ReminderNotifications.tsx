import { useEffect, useRef } from "react";
import { useHabits } from "@/contexts/HabitContext";

function getNextReminderTime(start: string, end: string, interval: number) {
  // Returns an array of Date objects for today between start and end at the given interval
  const now = new Date();
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMin, 0, 0);
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMin, 0, 0);
  const times: Date[] = [];
  let t = new Date(startTime);
  while (t <= endTime) {
    times.push(new Date(t));
    t = new Date(t.getTime() + interval * 60000);
  }
  return times;
}

const ReminderNotifications = () => {
  const { habits } = useHabits();
  const intervalsRef = useRef<{ [habitId: string]: number }>({});

  useEffect(() => {
    // Request notification permission on mount
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Clear all previous intervals
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    habits.forEach(habit => {
      if (!habit.reminderEnabled || !habit.reminderStart || !habit.reminderEnd || !habit.reminderInterval) return;
      // Schedule reminders only for today
      const reminderTimes = getNextReminderTime(habit.reminderStart, habit.reminderEnd, habit.reminderInterval);
      const now = new Date();
      // Find the next reminder time
      const nextTime = reminderTimes.find(t => t > now);
      if (!nextTime) return;
      const msUntilNext = nextTime.getTime() - now.getTime();
      // Set a timeout for the next reminder, then setInterval for subsequent ones
      const timeout = window.setTimeout(() => {
        // Show notification
        if (Notification && Notification.permission === "granted") {
          new Notification(`Streaknest Reminder: ${habit.name}`, {
            body: `Don't forget to complete your daily goal (${habit.goal} ${habit.unit || "times"})!`,
            icon: "/icon-192.png"
          });
        }
        // Set interval for subsequent reminders
        const interval = window.setInterval(() => {
          const now = new Date();
          // Only show if still within the time window
          const [endHour, endMin] = habit.reminderEnd!.split(":").map(Number);
          const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMin, 0, 0);
          if (now > endTime) {
            clearInterval(interval);
            return;
          }
          if (Notification && Notification.permission === "granted") {
            new Notification(`Streaknest Reminder: ${habit.name}`, {
              body: `Don't forget to complete your daily goal (${habit.goal} ${habit.unit || "times"})!`,
              icon: "/icon-192.png"
            });
          }
        }, habit.reminderInterval! * 60000);
        intervalsRef.current[habit.id] = interval;
      }, msUntilNext);
      intervalsRef.current[habit.id] = timeout;
    });
    // Cleanup
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    };
  }, [habits]);

  return null;
};

export default ReminderNotifications; 