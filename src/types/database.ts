/** Row shapes aligned with Supabase public schema (see supabase/migrations). */
export type AccountType = "patient" | "professional";

export type MoodValue = "depressed" | "sad" | "neutral" | "happy" | "overjoyed";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  account_type: AccountType | null;
  weight: number | null;
  gender: string | null;
  location: string | null;
  date_of_birth: string | null;
  is_pro: boolean | null;
  dark_mode: boolean | null;
  language: string | null;
  assessment_complete: boolean | null;
  profile_setup_complete: boolean | null;
  emergency_contact: string | null;
  mindora_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface MoodEntryRow {
  id: string;
  user_id: string;
  mood: MoodValue;
  note: string | null;
  created_at: string;
}

export interface JournalEntryRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: "text" | "voice";
  emotion: MoodValue | null;
  stress_level: number | null;
  stressors: string[] | null;
  sentiment: "positive" | "negative" | "neutral" | null;
  has_crisis_language: boolean | null;
  ai_suggestions: unknown;
  created_at: string;
  updated_at: string;
}

export interface StressEntryRow {
  id: string;
  user_id: string;
  stress_level: number;
  stressors: string[] | null;
  life_impact: string | null;
  created_at: string;
}

export interface SleepEntryRow {
  id: string;
  user_id: string;
  sleep_at: string | null;
  wake_at: string | null;
  duration_hours: number | null;
  rem_hours: number | null;
  core_hours: number | null;
  quality: "normal" | "care" | "rem" | "irregular" | "insomniac" | null;
  ai_suggestions: unknown;
  created_at: string;
}

export interface SleepScheduleRow {
  id: string;
  user_id: string;
  bedtime: string;
  wake_time: string;
  repeat_days: string[] | null;
  snooze_count: number | null;
  auto_display_stats: boolean | null;
  auto_set_alarm: boolean | null;
  is_active: boolean | null;
  created_at: string;
}

export interface MindfulSessionRow {
  id: string;
  user_id: string;
  type: "breathing" | "mindfulness" | "relax" | "sleep" | null;
  duration_minutes: number | null;
  goal: string | null;
  soundscape: string | null;
  mindora_score_gained: number | null;
  stress_reduced: number | null;
  created_at: string;
}

export interface ChatbotConversationRow {
  id: string;
  user_id: string;
  name: string;
  ai_persona: string | null;
  is_private: boolean | null;
  tags: string[] | null;
  knowledge_sources: string[] | null;
  pull_from_journal: boolean | null;
  token_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChatbotMessageRow {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface MindoraScoreHistoryRow {
  id: string;
  user_id: string;
  score: number;
  label: string | null;
  reason: string | null;
  created_at: string;
}

export interface CommunityPostRow {
  id: string;
  user_id: string;
  content: string;
  category: string | null;
  post_type: "story" | "regular" | "real" | null;
  tags: string[] | null;
  is_hidden: boolean | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
  /** Joined from profiles — present when queried with select("*, profiles(...)") */
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface CommunityLikeRow {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface CommunityCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CommunityNotificationRow {
  id: string;
  recipient_user_id: string;
  actor_user_id: string;
  post_id: string;
  type: "like" | "comment";
  comment_preview: string | null;
  read: boolean;
  created_at: string;
}

export interface AssessmentResponseRow {
  id: string;
  user_id: string;
  responses: Record<string, unknown>;
  initial_mindora_score: number | null;
  completed_at: string;
}
