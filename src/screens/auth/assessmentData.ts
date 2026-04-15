export const HEALTH_GOALS = [
  "Improve sleep quality",
  "Reduce stress & anxiety",
  "Boost daily mood",
  "Build healthy habits",
  "Track overall wellness",
] as const;

export const COMMON_MEDICATIONS = [
  "Sertraline",
  "Escitalopram",
  "Fluoxetine",
  "Bupropion",
  "Venlafaxine",
  "Duloxetine",
  "Amitriptyline",
  "Lorazepam",
  "Alprazolam",
  "Melatonin",
  "Multivitamin",
  "Ibuprofen",
] as const;

export const SYMPTOM_CHIPS = [
  "Anxiety",
  "Low mood",
  "Panic attacks",
  "Brain fog",
  "Fatigue",
  "Irritability",
  "Social withdrawal",
  "Sleep issues",
  "Racing thoughts",
  "Loss of interest",
] as const;

export const SLEEP_LEVELS = [
  { id: "excellent", label: "Excellent", emoji: "😄" },
  { id: "good", label: "Good", emoji: "🙂" },
  { id: "fair", label: "Fair", emoji: "😐" },
  { id: "poor", label: "Poor", emoji: "😟" },
  { id: "very_poor", label: "Very Poor", emoji: "😫" },
] as const;
