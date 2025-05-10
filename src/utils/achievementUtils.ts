
import { Achievement } from "@/types/Habit.types";

export const generateAchievements = (name: string): Achievement[] => {
  return [
    {
      id: `${name.toLowerCase()}-monday`,
      title: `Monday ${name}`,
      description: `Complete ${name.toLowerCase()} on Monday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-tuesday`,
      title: `Tuesday ${name}`,
      description: `Complete ${name.toLowerCase()} on Tuesday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-wednesday`,
      title: `Wednesday ${name}`,
      description: `Complete ${name.toLowerCase()} on Wednesday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-thursday`,
      title: `Thursday ${name}`,
      description: `Complete ${name.toLowerCase()} on Thursday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-friday`,
      title: `Friday ${name}`,
      description: `Complete ${name.toLowerCase()} on Friday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-saturday`,
      title: `Saturday ${name}`,
      description: `Complete ${name.toLowerCase()} on Saturday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-sunday`,
      title: `Sunday ${name}`,
      description: `Complete ${name.toLowerCase()} on Sunday`,
      threshold: 1,
      achieved: false,
    },
    {
      id: `${name.toLowerCase()}-month`,
      title: `${name} Master`,
      description: `Complete ${name.toLowerCase()} for 30 consecutive days`,
      threshold: 30,
      achieved: false,
    },
  ];
};

export const showAchievementToast = (achievement: Achievement): void => {
  setTimeout(() => {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-nordic-teal text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2";
    toast.innerHTML = `
      <div class="text-2xl">🏆</div>
      <div>
        <p class="font-bold">${achievement.title} Unlocked!</p>
        <p class="text-sm">${achievement.description}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  }, 300);
};
