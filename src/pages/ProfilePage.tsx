import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, Heart, MapPin, CreditCard, LogOut, Settings,
  ShoppingBag, Clock, CheckCircle2, ChevronRight, Plus,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getProductById, formatINR } from '@/data/products';

type TabKey = 'overview' | 'orders' | 'addresses' | 'payments' | 'settings';

const sampleOrders = [
  {
    id: 'VEL-2026-0451',
    date: '20 Oct 2026',
    status: 'Shipped' as const,
    total: 5498,
    items: [
      { productId: 1, quantity: 1, size: 'M', color: 'Black' },
      { productId: 4, quantity: 1, size: '8', color: 'White' },
    ],
    estimatedDelivery: '25 Oct 2026',
  },
  {
    id: 'VEL-2026-0438',
    date: '15 Oct 2026',
    status: 'Delivered' as const,
    total: 4499,
    items: [{ productId: 5, quantity: 1, size: 'One Size', color: 'Black' }],
    estimatedDelivery: '19 Oct 2026',
  },
  {
    id: 'VEL-2026-0467',
    date: '23 Oct 2026',
    status: 'Confirmed' as const,
    total: 11998,
    items: [
      { productId: 2, quantity: 1, size: '42', color: 'Charcoal' },
      { productId: 12, quantity: 1, size: 'One Size', color: 'Gold' },
    ],
    estimatedDelivery: '28 Oct 2026',
  },
];

const sampleAddresses = [
  { id: 1, label: 'Home', name: 'Aarav Sharma', line1: '42, Indiranagar 100ft Road', line2: 'Bengaluru, Karnataka 560038', phone: '+91 98765 43210', isDefault: true },
  { id: 2, label: 'Office', name: 'Aarav Sharma', line1: 'Tower B, Prestige Tech Park', line2: 'Marathahalli, Bengaluru 560103', phone: '+91 98765 43210', isDefault: false },
];

const samplePayments = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '08/28', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8888', expiry: '03/27', isDefault: false },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const { count: wishlistCount } = useWishlist();
  const { totalItems, subtotal } = useCart();

  const stats = [
    { label: 'Total Orders', value: sampleOrders.length, icon: Package, color: 'text-gold-400' },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart, color: 'text-red-400' },
    { label: 'In Bag', value: totalItems, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Total Spent', value: formatINR(sampleOrders.reduce((sum, o) => sum + o.total, 0)), icon: CreditCard, color: 'text-green-400' },
  ];

  const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'orders', label: 'My Orders', icon: Package },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'payments', label: 'Payment Methods', icon: CreditCard },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-cream-50 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-ink-900 border border-ink-700/50 rounded-xl overflow-hidden sticky top-24">
            <div className="p-6 text-center border-b border-ink-700">
              <div className="w-20 h-20 rounded-full bg-gold-500/15 border-2 border-gold-500/30 flex items-center justify-center mx-auto mb-3">
                <User className="w-10 h-10 text-gold-400" />
              </div>
              <h3 className="text-lg font-serif text-cream-50">Aarav Sharma</h3>
              <p className="text-xs text-neutral-400">aarav.sharma@email.com</p>
              <span className="inline-block mt-2 text-xs text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1">
                Gold Member
              </span>
            </div>
            <nav className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                      : 'text-neutral-300 hover:bg-ink-800 hover:text-cream-100 border border-transparent'
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:bg-ink-800 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-ink-900 border border-ink-700/50 rounded-xl p-5">
                    <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                    <p className="text-2xl font-serif font-semibold text-cream-50">{stat.value}</p>
                    <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-ink-900 border border-ink-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif text-cream-50">Recent Order</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <OrderCard order={sampleOrders[0]} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/wishlist" className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 hover:border-gold-500/30 transition-colors group">
                  <Heart className="w-6 h-6 text-red-400 mb-3" />
                  <h4 className="text-sm font-medium text-cream-100">My Wishlist</h4>
                  <p className="text-xs text-neutral-400 mt-1">{wishlistCount} saved items</p>
                  <span className="text-xs text-gold-400 group-hover:text-gold-300 transition-colors mt-3 inline-flex items-center gap-1">
                    View Wishlist <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
                <Link to="/track-order" className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 hover:border-gold-500/30 transition-colors group">
                  <Package className="w-6 h-6 text-gold-400 mb-3" />
                  <h4 className="text-sm font-medium text-cream-100">Track Orders</h4>
                  <p className="text-xs text-neutral-400 mt-1">Check shipment status</p>
                  <span className="text-xs text-gold-400 group-hover:text-gold-300 transition-colors mt-3 inline-flex items-center gap-1">
                    Track Now <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-cream-50 mb-4">My Orders</h2>
              {sampleOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-cream-50">Saved Addresses</h2>
                <button className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
              {sampleAddresses.map(addr => (
                <div key={addr.id} className="bg-ink-900 border border-ink-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-cream-100">{addr.label}</h4>
                          {addr.isDefault && (
                            <span className="text-xs text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full px-2 py-0.5">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-cream-100 mt-1">{addr.name}</p>
                        <p className="text-xs text-neutral-400 mt-1">{addr.line1}</p>
                        <p className="text-xs text-neutral-400">{addr.line2}</p>
                        <p className="text-xs text-neutral-400 mt-1">{addr.phone}</p>
                      </div>
                    </div>
                    <button className="text-sm text-neutral-400 hover:text-gold-400 transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-cream-50">Payment Methods</h2>
                <button className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>
              {samplePayments.map(payment => (
                <div key={payment.id} className="bg-ink-900 border border-ink-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center text-ink-950 text-xs font-bold">
                        {payment.type === 'Visa' ? 'VISA' : 'MC'}
                      </div>
                      <div>
                        <p className="text-sm text-cream-100">•••• •••• •••• {payment.last4}</p>
                        <p className="text-xs text-neutral-400">Expires {payment.expiry}</p>
                      </div>
                    </div>
                    {payment.isDefault && (
                      <span className="text-xs text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full px-2.5 py-1">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="bg-ink-800/30 border border-dashed border-ink-700 rounded-xl p-6 text-center">
                <CreditCard className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Add a new card for faster checkout</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-cream-50 mb-4">Account Settings</h2>
              <div className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Aarav Sharma"
                    className="w-full mt-1.5 bg-ink-800 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    defaultValue="aarav.sharma@email.com"
                    className="w-full mt-1.5 bg-ink-800 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full mt-1.5 bg-ink-800 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="px-6 py-2.5 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors">
                    Save Changes
                  </button>
                  <button className="px-6 py-2.5 bg-ink-800 border border-ink-700 text-cream-100 text-sm font-medium rounded-lg hover:border-gold-500/40 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="bg-ink-900 border border-ink-700/50 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-cream-100 uppercase tracking-wider mb-3">Notification Preferences</h4>
                <div className="space-y-3">
                  {['Order updates', 'New arrivals & promotions', 'Price drop alerts', 'Newsletter'].map((pref, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-300">{pref}</span>
                      <div className={`w-11 h-6 rounded-full transition-colors relative ${i < 2 ? 'bg-gold-500' : 'bg-ink-700'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${i < 2 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: typeof sampleOrders[0] }) {
  return (
    <Link
      to="/track-order"
      className="block bg-ink-800/50 border border-ink-700/50 rounded-lg p-4 hover:border-gold-500/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-cream-100">{order.id}</p>
          <p className="text-xs text-neutral-400">Placed on {order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full ${
            order.status === 'Delivered'
              ? 'bg-green-900/30 text-green-400 border border-green-500/20'
              : order.status === 'Shipped'
                ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20'
                : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
          }`}>
            {order.status}
          </span>
          <span className="text-sm font-semibold text-cream-50">{formatINR(order.total)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {order.items.map((item, i) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return (
            <img
              key={i}
              src={product.image}
              alt={product.name}
              className="w-12 h-16 object-cover rounded shrink-0"
            />
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-neutral-400 shrink-0">
          {order.status === 'Delivered' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              Delivered on {order.estimatedDelivery}
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Est. delivery: {order.estimatedDelivery}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
