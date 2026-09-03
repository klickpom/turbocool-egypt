import React, { lazy, Suspense } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandBar } from './components/BrandBar';
import { CapacityCalculator } from './components/CapacityCalculator';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { FloatingContactHub } from './components/FloatingContactHub';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { BookingModal } from './components/BookingModal';
import { ComparisonModal } from './components/ComparisonModal';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { LazySection } from './components/LazySection';

const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);

function AppContent() {
  const { currentView } = useStore();

  if (currentView === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-cairo selection:bg-brand-500 selection:text-white pb-20 lg:pb-0" dir="rtl">
      <Header />

      <main className="flex-1">
        <Hero />
        <BrandBar />
        <CapacityCalculator />
        <LazySection loader={() => import('./components/AcRemoteSimulator').then((m) => ({ default: m.AcRemoteSimulator }))} />
        <ProductCatalog />
        <LazySection loader={() => import('./components/AirConditionerPriceTable2026').then((m) => ({ default: m.AirConditionerPriceTable2026 }))} />
        <LazySection loader={() => import('./components/ServicesSection').then((m) => ({ default: m.ServicesSection }))} />
        <LazySection loader={() => import('./components/WhyChooseUs').then((m) => ({ default: m.WhyChooseUs }))} />
        <LazySection loader={() => import('./components/CustomerReviews').then((m) => ({ default: m.CustomerReviews }))} />
        <LazySection loader={() => import('./components/SeoContentHub').then((m) => ({ default: m.SeoContentHub }))} />
      </main>

      <Footer />
      <LiveSalesNotification />
      <FloatingContactHub />
      <CartDrawer />
      <QuickViewModal />
      <BookingModal />
      <ComparisonModal />
      <MobileBottomBar />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
