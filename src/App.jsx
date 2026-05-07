import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ProductPage from './pages/ProductPage';
import WomenPage from './pages/WomenPage';
import MenPage from './pages/MenPage';
import SciencePage from './pages/SciencePage';
import ReviewsPage from './pages/ReviewsPage';
import FaqPage from './pages/FaqPage';
import ClinicianPage from './pages/ClinicianPage';
import ResourcesPage from './pages/ResourcesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <CartSidebar />
        <ToastContainer />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nasil-calisir" element={<HowItWorksPage />} />
            <Route path="/urun/pelvicare" element={<ProductPage />} />
            <Route path="/urun/elektrod-pad" element={<ProductPage />} />
            <Route path="/kadin" element={<WomenPage />} />
            <Route path="/erkek" element={<MenPage />} />
            <Route path="/klinik-kanit" element={<SciencePage />} />
            <Route path="/yorumlar" element={<ReviewsPage />} />
            <Route path="/sss" element={<FaqPage />} />
            <Route path="/klinisyenler" element={<ClinicianPage />} />
            <Route path="/kaynaklar" element={<ResourcesPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/odeme" element={<CheckoutPage />} />
          </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
