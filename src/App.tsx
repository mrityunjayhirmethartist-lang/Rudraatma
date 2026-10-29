import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogsPage } from './pages/BlogsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { ReleasesPage } from './pages/dashboard/ReleasesPage';
import {
  MyLabelsPage,
  ProfilePage,
  ReportsPage,
  FinancialPage,
  UserManagementPage,
  SupportPage,
  SubscriptionPlanPage,
  WalletTransactionsPage,
  OthersPage,
  YouTubePage,
  ManageArtistsPage,
  SmartLinksPage,
  OtherRequestsPage,
  AdminDashboardPage
} from './pages/dashboard/DashboardModules';

const RouteRenderer: React.FC = () => {
  const { path, navigate } = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-xs font-mono text-slate-500">
        Loading Rudraatma Music...
      </div>
    );
  }

  // Protected Dashboard Routes
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return <LoginPage />;
    }

    if (path === '/dashboard/labels') return <MyLabelsPage />;
    if (path === '/dashboard/profile') return <ProfilePage />;
    if (path.startsWith('/dashboard/releases')) return <ReleasesPage />;
    if (path === '/dashboard/reports') return <ReportsPage />;
    if (path === '/dashboard/financial') return <FinancialPage />;
    if (path === '/dashboard/users') return <UserManagementPage />;
    if (path === '/dashboard/support') return <SupportPage />;
    if (path === '/dashboard/subscription') return <SubscriptionPlanPage />;
    if (path === '/dashboard/wallet-transactions') return <WalletTransactionsPage />;
    if (path === '/dashboard/others') return <OthersPage />;
    if (path === '/dashboard/youtube') return <YouTubePage />;
    if (path === '/dashboard/artists') return <ManageArtistsPage />;
    if (path === '/dashboard/smart-links') return <SmartLinksPage />;
    if (path === '/dashboard/other-requests') return <OtherRequestsPage />;
    return <DashboardOverviewPage />;
  }

  // Admin Routes
  if (path.startsWith('/admin')) {
    return <AdminDashboardPage />;
  }

  // Public Routes
  if (path === '/services') return <ServicesPage />;
  if (path === '/pricing') return <PricingPage />;
  if (path === '/checkout' || path === '/checkout/success' || path === '/checkout/failure') return <CheckoutPage />;
  if (path === '/blogs') return <BlogsPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/login' || path === '/forgot-password') return <LoginPage />;
  if (path === '/signup') return <SignUpPage />;

  // Legal & Policy Routes
  if (
    path === '/terms' ||
    path === '/privacy' ||
    path === '/refund-policy' ||
    path === '/cancellation-policy' ||
    path === '/distribution-agreement'
  ) {
    return <LegalPage />;
  }

  // Default Home
  return <HomePage />;
};

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <RouteRenderer />
      </AuthProvider>
    </RouterProvider>
  );
}
