
// Utility to get consistent colors for habits
export const getHabitColor = (index: number) => {
  const colors = [
    "#8B5CF6", // Purple
    "#D946EF", // Magenta
    "#F97316", // Orange
    "#0EA5E9", // Blue
    "#10B981", // Green
    "#EC4899", // Pink
    "#EAB308", // Yellow
  ];
  return colors[index % colors.length];
};
