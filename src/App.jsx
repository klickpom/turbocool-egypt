import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandBar } from './components/BrandBar';
import { CapacityCalculator } from './components/CapacityCalculator';
import { AcRemoteSimulator } from './components/AcRemoteSimulator';
import { ProductCatalog } from './components/ProductCatalog';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { FloatingContactHub } from './components/FloatingContactHub';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { BookingModal } from './components/BookingModal';
import { ComparisonModal } from './components/ComparisonModal';
import { MobileBottomBar } from './components/MobileBottomBar';

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-cairo selection:bg-brand-500 selection:text-white" dir="rtl">
      {/* Navigation & Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Official Brand Slogan */}
        <Hero />

        {/* Authorized Brands Fast Bar */}
        <BrandBar />

        {/* Smart AC Room Capacity Calculator */}
        <CapacityCalculator />

        {/* Interactive AC Remote Simulator Experience */}
        <AcRemoteSimulator />

        {/* Full E-Commerce Product Catalog */}
        <ProductCatalog />

        {/* Maintenance & Installation Services */}
        <ServicesSection />

        {/* Why Turbo Cool & Warranty Guarantees */}
        <WhyChooseUs />

        {/* Testimonials & Social Proof */}
        <CustomerReviews />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Full Footer */}
      <Footer />

      {/* Floating Marketing & Help Hubs */}
      <LiveSalesNotification />
      <FloatingContactHub />

      {/* Interactive Modals & Drawers */}
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
