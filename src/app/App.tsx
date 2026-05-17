import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { OfflineListener } from "@/components/effects/OfflineListener";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { MentalHealthAssessmentScreen } from "@/screens/auth/MentalHealthAssessmentScreen";
import { ProfileSetupScreen } from "@/screens/auth/ProfileSetupScreen";
import { SignInScreen } from "@/screens/auth/SignInScreen";
import { SignUpScreen } from "@/screens/auth/SignUpScreen";
import { ForgotPasswordScreen } from "@/screens/auth/ForgotPasswordScreen";
import { WelcomeScreen } from "@/screens/auth/WelcomeScreen";
import { AIChatbotScreen } from "@/screens/chatbot/AIChatbotScreen";
import { ChatConversationScreen } from "@/screens/chatbot/ChatConversationScreen";
import { CustomAIInstructionsScreen } from "@/screens/chatbot/CustomAIInstructionsScreen";
import { NewConversationScreen } from "@/screens/chatbot/NewConversationScreen";
import { TokenLimitScreen } from "@/screens/chatbot/TokenLimitScreen";
import { VoiceChatScreen } from "@/screens/chatbot/VoiceChatScreen";
import { CommunityNotificationsScreen } from "@/screens/community/CommunityNotificationsScreen";
import { CommunityScreen } from "@/screens/community/CommunityScreen";
import { CommunityWelcomeScreen } from "@/screens/community/CommunityWelcomeScreen";
import { DMScreen } from "@/screens/community/DMScreen";
import { NewPostScreen } from "@/screens/community/NewPostScreen";
import { PostSuccessScreen } from "@/screens/community/PostSuccessScreen";
import { UserProfileScreen } from "@/screens/community/UserProfileScreen";
import { InternalErrorScreen } from "@/screens/errors/InternalErrorScreen";
import { MaintenanceScreen } from "@/screens/errors/MaintenanceScreen";
import { NoInternetScreen } from "@/screens/errors/NoInternetScreen";
import { NotAllowedScreen } from "@/screens/errors/NotAllowedScreen";
import { NotFoundScreen } from "@/screens/errors/NotFoundScreen";
import { MindoraScoreAISuggestionsScreen } from "@/screens/home/MindoraScoreAISuggestionsScreen";
import { MindoraScoreScreen } from "@/screens/home/MindoraScoreScreen";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { JournalDetailScreen } from "@/screens/journal/JournalDetailScreen";
import { JournalListScreen } from "@/screens/journal/JournalListScreen";
import { JournalScreen } from "@/screens/journal/JournalScreen";
import { NewJournalScreen } from "@/screens/journal/NewJournalScreen";
import { ExerciseActiveScreen } from "@/screens/mindful/ExerciseActiveScreen";
import { ExerciseCompleteScreen } from "@/screens/mindful/ExerciseCompleteScreen";
import { MindfulExerciseScreen } from "@/screens/mindful/MindfulExerciseScreen";
import { MindfulHoursScreen } from "@/screens/mindful/MindfulHoursScreen";
import { MindfulHoursStatsScreen } from "@/screens/mindful/MindfulHoursStatsScreen";
import { MoodAISuggestionsScreen } from "@/screens/mood/MoodAISuggestionsScreen";
import { MoodHistoryScreen } from "@/screens/mood/MoodHistoryScreen";
import { MoodSetScreen } from "@/screens/mood/MoodSetScreen";
import { MoodTrackerScreen } from "@/screens/mood/MoodTrackerScreen";
import { NotificationsScreen } from "@/screens/notifications/NotificationsScreen";
import { SmartNotificationScreen } from "@/screens/notifications/SmartNotificationScreen";
import { HelpCenterScreen } from "@/screens/profile/HelpCenterScreen";
import { InviteFriendsScreen } from "@/screens/profile/InviteFriendsScreen";
import { LanguagesScreen } from "@/screens/profile/LanguagesScreen";
import { LinkedDevicesScreen } from "@/screens/profile/LinkedDevicesScreen";
import { LiveChatChatScreen } from "@/screens/profile/LiveChatChatScreen";
import { LiveChatScreen } from "@/screens/profile/LiveChatScreen";
import { NotificationSettingsScreen } from "@/screens/profile/NotificationSettingsScreen";
import { PersonalInfoScreen } from "@/screens/profile/PersonalInfoScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { SecuritySettingsScreen } from "@/screens/profile/SecuritySettingsScreen";
import { SendFeedbackScreen } from "@/screens/profile/SendFeedbackScreen";
import { ArticleDetailScreen } from "@/screens/resources/ArticleDetailScreen";
import { ArticlesScreen } from "@/screens/resources/ArticlesScreen";
import { CopingToolkitScreen } from "@/screens/resources/CopingToolkitScreen";
import { CourseCompleteScreen } from "@/screens/resources/CourseCompleteScreen";
import { CourseDetailScreen } from "@/screens/resources/CourseDetailScreen";
import { CoursePlayerScreen } from "@/screens/resources/CoursePlayerScreen";
import { CoursesScreen } from "@/screens/resources/CoursesScreen";
import { ResourcesScreen } from "@/screens/resources/ResourcesScreen";
import { SearchScreen } from "@/screens/search/SearchScreen";
import { SleepActiveScreen } from "@/screens/sleep/SleepActiveScreen";
import { SleepInsightsScreen } from "@/screens/sleep/SleepInsightsScreen";
import { SleepQualityScreen } from "@/screens/sleep/SleepQualityScreen";
import { SleepResultsScreen } from "@/screens/sleep/SleepResultsScreen";
import { SleepScheduleScreen } from "@/screens/sleep/SleepScheduleScreen";
import { WakeUpScreen } from "@/screens/sleep/WakeUpScreen";
import { StressLevelScreen } from "@/screens/stress/StressLevelScreen";
import { StressLevelStatsScreen } from "@/screens/stress/StressLevelStatsScreen";
import { StressLogScreen } from "@/screens/stress/StressLogScreen";

export default function App() {
  return (
    <HashRouter>
      <>
        <OfflineListener />
        <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<OnboardingGuard />}>
            <Route path="/assessment" element={<MentalHealthAssessmentScreen />} />
            <Route path="/profile-setup" element={<ProfileSetupScreen />} />
            <Route element={<MainLayout />}>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/mindora-score" element={<MindoraScoreScreen />} />
            <Route path="/mindora-score/suggestions" element={<MindoraScoreAISuggestionsScreen />} />
            <Route path="/mood" element={<MoodTrackerScreen />} />
            <Route path="/mood/set" element={<MoodSetScreen />} />
            <Route path="/mood/history" element={<MoodHistoryScreen />} />
            <Route path="/mood/suggestions" element={<MoodAISuggestionsScreen />} />
            <Route path="/stress" element={<StressLevelScreen />} />
            <Route path="/stress/log" element={<StressLogScreen />} />
            <Route path="/stress/stats" element={<StressLevelStatsScreen />} />
            <Route path="/journal" element={<JournalScreen />} />
            <Route path="/journal/new" element={<NewJournalScreen />} />
            <Route path="/journal/list" element={<JournalListScreen />} />
            <Route path="/journal/:id" element={<JournalDetailScreen />} />
            <Route path="/sleep" element={<SleepQualityScreen />} />
            <Route path="/sleep/schedule" element={<SleepScheduleScreen />} />
            <Route path="/sleep/insights" element={<SleepInsightsScreen />} />
            <Route path="/sleep/active" element={<SleepActiveScreen />} />
            <Route path="/sleep/wake" element={<WakeUpScreen />} />
            <Route path="/sleep/results" element={<SleepResultsScreen />} />
            <Route path="/mindful" element={<MindfulHoursScreen />} />
            <Route path="/mindful/stats" element={<MindfulHoursStatsScreen />} />
            <Route path="/mindful/exercise" element={<MindfulExerciseScreen />} />
            <Route path="/mindful/exercise/active" element={<ExerciseActiveScreen />} />
            <Route path="/mindful/complete" element={<ExerciseCompleteScreen />} />
            <Route path="/chatbot" element={<AIChatbotScreen />} />
            <Route path="/chatbot/new" element={<NewConversationScreen />} />
            <Route path="/chatbot/voice" element={<VoiceChatScreen />} />
            <Route path="/chatbot/tokens" element={<TokenLimitScreen />} />
            <Route path="/chatbot/custom-instructions" element={<CustomAIInstructionsScreen />} />
            <Route path="/chatbot/:id" element={<ChatConversationScreen />} />
            <Route path="/resources" element={<ResourcesScreen />} />
            <Route path="/resources/articles" element={<ArticlesScreen />} />
            <Route path="/resources/courses" element={<CoursesScreen />} />
            <Route path="/resources/coping" element={<CopingToolkitScreen />} />
            <Route path="/resources/article/:id" element={<ArticleDetailScreen />} />
            <Route path="/resources/course/:id" element={<CourseDetailScreen />} />
            <Route path="/resources/play/:courseId" element={<CoursePlayerScreen />} />
            <Route path="/resources/complete/:courseId" element={<CourseCompleteScreen />} />
            <Route path="/community" element={<CommunityScreen />} />
            <Route path="/community/welcome" element={<CommunityWelcomeScreen />} />
            <Route path="/community/notifications" element={<CommunityNotificationsScreen />} />
            <Route path="/community/new-post" element={<NewPostScreen />} />
            <Route path="/community/post-success" element={<PostSuccessScreen />} />
            <Route path="/community/profile/:id" element={<UserProfileScreen />} />
            <Route path="/community/dm/:userId" element={<DMScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/notifications/smart/:type" element={<SmartNotificationScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/invite" element={<InviteFriendsScreen />} />
            <Route path="/settings/personal" element={<PersonalInfoScreen />} />
            <Route path="/settings/notifications" element={<NotificationSettingsScreen />} />
            <Route path="/settings/security" element={<SecuritySettingsScreen />} />
            <Route path="/settings/devices" element={<LinkedDevicesScreen />} />
            <Route path="/settings/language" element={<LanguagesScreen />} />
            <Route path="/help" element={<HelpCenterScreen />} />
            <Route path="/help/live-chat" element={<LiveChatScreen />} />
            <Route path="/help/live-chat/session" element={<LiveChatChatScreen />} />
            <Route path="/feedback" element={<SendFeedbackScreen />} />
            </Route>
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundScreen />} />
        <Route path="/no-internet" element={<NoInternetScreen />} />
        <Route path="/500" element={<InternalErrorScreen />} />
        <Route path="/maintenance" element={<MaintenanceScreen />} />
        <Route path="/not-allowed" element={<NotAllowedScreen />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </>
    </HashRouter>
  );
}
