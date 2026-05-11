import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
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
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCms from './pages/admin/AdminCms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <CartSidebar />
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/urunler" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminProducts /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/siparisler" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminOrders /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/cms" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminCms /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/kullanicilar" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminUsers /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/analitik" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminAnalytics /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Auth Routes (no header/footer) */}
            <Route path="/giris" element={<LoginPage />} />
            <Route path="/kayit" element={<RegisterPage />} />
            <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />

            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/nasil-calisir" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
            <Route path="/urun/pelvicare" element={<PublicLayout><ProductPage /></PublicLayout>} />
            <Route path="/urun/elektrod-pad" element={<PublicLayout><ProductPage /></PublicLayout>} />
            <Route path="/urun/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/kadin" element={<PublicLayout><WomenPage /></PublicLayout>} />
            <Route path="/erkek" element={<PublicLayout><MenPage /></PublicLayout>} />
            <Route path="/klinik-kanit" element={<PublicLayout><SciencePage /></PublicLayout>} />
            <Route path="/yorumlar" element={<PublicLayout><ReviewsPage /></PublicLayout>} />
            <Route path="/sss" element={<PublicLayout><FaqPage /></PublicLayout>} />
            <Route path="/klinisyenler" element={<PublicLayout><ClinicianPage /></PublicLayout>} />
            <Route path="/kaynaklar" element={<PublicLayout><ResourcesPage /></PublicLayout>} />
            <Route path="/hakkimizda" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/iletisim" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/odeme" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            <Route path="/magaza" element={<PublicLayout><ShopPage /></PublicLayout>} />
            <Route path="/siparislerim" element={
              <ProtectedRoute>
                <PublicLayout><OrdersPage /></PublicLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
