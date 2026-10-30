import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header, MobileMenu } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { SearchPage } from '@/pages/SearchPage';
import { OrderTrackingPage } from '@/pages/OrderTrackingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { StyleFinderPage } from '@/pages/StyleFinderPage';
import { BrandsPage } from '@/pages/BrandsPage';
import { BrandPage } from '@/pages/BrandPage';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ToastProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <div className="min-h-screen bg-ink-950 flex flex-col">
                <AnnouncementBar />
                <Header
                  onOpenCart={() => setCartOpen(true)}
                  onOpenSearch={() => setSearchOpen(true)}
                  onOpenMobileMenu={() => setMobileMenuOpen(true)}
                />
                <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/track-order" element={<OrderTrackingPage />} />
                    <Route path="/account" element={<ProfilePage />} />
                    <Route path="/style-finder" element={<StyleFinderPage />} />
                    <Route path="/brands" element={<BrandsPage />} />
                    <Route path="/brand/:slug" element={<BrandPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>

                <Footer />

                <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
                <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
              </div>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
}

export default App;
