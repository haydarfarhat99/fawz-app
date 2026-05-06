/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@shared/layouts/AppLayout';
import { AuthLayout } from '@shared/layouts/AuthLayout';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';

const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('@features/auth/pages/SignupPage'));
const VerifyEmailPage = lazy(() => import('@features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPasswordPage'));
const HomePage = lazy(() => import('@features/home/pages/HomePage'));
const LiveDrawPage = lazy(() => import('@features/draws/pages/LiveDrawPage'));
const DrawResultsPage = lazy(() => import('@features/draws/pages/DrawResultsPage'));
const DrawDetailPage = lazy(() => import('@features/draws/pages/DrawDetailPage'));
const WinnerSharePage = lazy(() => import('@features/draws/pages/WinnerSharePage'));
const EntriesPage = lazy(() => import('@features/entries/pages/EntriesPage'));
const ChallengesPage = lazy(() => import('@features/challenges/pages/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@features/challenges/pages/ChallengeDetailPage'));
const ReferralPage = lazy(() => import('@features/referral/pages/ReferralPage'));
const ReferralHistoryPage = lazy(() => import('@features/referral/pages/ReferralHistoryPage'));
const PrizesPage = lazy(() => import('@features/prizes/pages/PrizesPage'));
const NotificationsPage = lazy(() => import('@features/notifications/pages/NotificationsPage'));
const NotificationPreferencesPage = lazy(() => import('@features/notifications/pages/NotificationPreferencesPage'));
const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'));
const DisputeSubmissionPage = lazy(() => import('@features/disputes/pages/DisputeSubmissionPage'));
const DisputeHistoryPage = lazy(() => import('@features/disputes/pages/DisputeHistoryPage'));
const MerchantHomePage = lazy(() => import('@features/merchant/pages/MerchantHomePage'));
const MerchantEntriesPage = lazy(() => import('@features/merchant/pages/MerchantEntriesPage'));
const MerchantPrizesPage = lazy(() => import('@features/merchant/pages/MerchantPrizesPage'));

function PageBoundary() {
  return (
    <Suspense fallback={<LoadingOverlay visible label="Loading…" />}>
      <Outlet />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <PageBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      {
        element: (
          <GuestGuard>
            <AuthLayout />
          </GuestGuard>
        ),
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
          { path: '/verify-email', element: <VerifyEmailPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: '/draws/live', element: <LiveDrawPage /> },
          { path: '/winners/:winnerId/share', element: <WinnerSharePage /> },
        ],
      },
      {
        element: (
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        ),
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/entries', element: <EntriesPage /> },
          { path: '/draws', element: <Navigate to="/draws/results" replace /> },
          { path: '/draws/results', element: <DrawResultsPage /> },
          { path: '/draws/:id', element: <DrawDetailPage /> },
          { path: '/challenges', element: <ChallengesPage /> },
          { path: '/challenges/:id', element: <ChallengeDetailPage /> },
          { path: '/referral', element: <ReferralPage /> },
          { path: '/referral/history', element: <ReferralHistoryPage /> },
          { path: '/prizes', element: <PrizesPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/settings/notifications', element: <NotificationPreferencesPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/support/dispute', element: <DisputeSubmissionPage /> },
          { path: '/support/disputes', element: <DisputeHistoryPage /> },
          { path: '/merchant/home', element: <MerchantHomePage /> },
          { path: '/merchant/entries', element: <MerchantEntriesPage /> },
          { path: '/merchant/prizes', element: <MerchantPrizesPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
