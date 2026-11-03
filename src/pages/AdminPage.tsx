import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Loader2,
  Package,
  Search,
  Users,
} from 'lucide-react';
import { useCatalog } from '@/data/catalog';
import { supabase } from '@/lib/supabase';
import { formatINR } from '@/data/products';

interface OrderSummary {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export function AdminPage() {
  const { products, loading: catalogLoading } = useCatalog();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(8);

      if (cancelled) return;
      if (error) {
        setOrderError('Sign in to view order activity.');
      } else {
        setOrders((data ?? []) as OrderSummary[]);
      }
      setOrdersLoading(false);
    }

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products.slice(0, 12);
    return products
      .filter(product => `${product.name} ${product.brand}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 12);
  }, [products, query]);

  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const lowStockCount = products.filter(product => product.stock > 0 && product.stock <= 5).length;
  const orderRevenue = orders.reduce((total, order) => total + order.total_amount, 0);

  const metrics = [
    { label: 'Catalog Products', value: catalogLoading ? '—' : products.length.toLocaleString('en-IN'), icon: Package, color: 'text-gold-400' },
    { label: 'Low Stock Items', value: catalogLoading ? '—' : lowStockCount.toLocaleString('en-IN'), icon: Boxes, color: 'text-orange-400' },
    { label: 'Recent Orders', value: ordersLoading ? '—' : orders.length.toLocaleString('en-IN'), icon: ClipboardList, color: 'text-blue-400' },
    { label: 'Visible Revenue', value: ordersLoading ? '—' : formatINR(orderRevenue), icon: CircleDollarSign, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold-400">LUXORA operations</p>
          <h1 className="text-3xl font-serif text-cream-50">Admin Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            Monitor the live catalog, inventory health, and order activity in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <BarChart3 className="h-4 w-4 text-gold-400" />
          Live workspace
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(metric => (
          <div key={metric.label} className="rounded-xl border border-ink-700/50 bg-ink-900 p-5">
            <metric.icon className={`mb-3 h-6 w-6 ${metric.color}`} />
            <p className="text-2xl font-serif font-semibold text-cream-50">{metric.value}</p>
            <p className="mt-1 text-xs text-neutral-400">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-ink-700/50 bg-ink-900 p-6 lg:col-span-2">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-serif text-cream-50">Product Inventory</h2>
              <p className="mt-1 text-xs text-neutral-400">Search the complete catalog and review available stock.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search products"
                className="w-full rounded-lg border border-ink-700 bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-cream-100 placeholder-neutral-500 focus:border-gold-500/50 focus:outline-none"
              />
            </div>
          </div>

          {catalogLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading catalog
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-ink-700 text-[11px] uppercase tracking-wider text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Product</th>
                    <th className="pb-3 pr-4 font-medium">Category</th>
                    <th className="pb-3 pr-4 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-ink-800 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="h-10 w-10 rounded object-cover" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-cream-100">{product.name}</p>
                            <p className="text-xs text-gold-400">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs capitalize text-neutral-400">{product.category.replace('-', ' ')}</td>
                      <td className="py-3 pr-4 text-sm text-cream-100">{formatINR(product.price)}</td>
                      <td className="py-3 text-sm">
                        <span className={product.stock <= 5 ? 'text-orange-400' : 'text-green-400'}>{product.stock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <p className="py-10 text-center text-sm text-neutral-400">No products match that search.</p>}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-ink-700/50 bg-ink-900 p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-serif text-cream-50">Order Activity</h2>
              <p className="mt-1 text-xs text-neutral-400">Latest orders visible to this account.</p>
            </div>
            <Users className="h-5 w-5 text-blue-400" />
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading orders
            </div>
          ) : orderError ? (
            <div className="rounded-lg border border-ink-700 bg-ink-800/50 p-4 text-sm leading-relaxed text-neutral-400">{orderError}</div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink-700 p-6 text-center text-sm text-neutral-400">No orders yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="rounded-lg border border-ink-700/60 bg-ink-800/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-cream-100">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <span className="rounded-full border border-gold-500/20 bg-gold-500/10 px-2 py-1 text-[10px] capitalize text-gold-400">{order.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                  <p className="mt-1 text-sm font-semibold text-cream-50">{formatINR(order.total_amount)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-xl border border-gold-500/20 bg-gold-500/5 p-5 text-sm text-neutral-300">
        Inventory value currently represented in the catalog: <span className="font-semibold text-gold-400">{catalogLoading ? '—' : formatINR(inventoryValue)}</span>
      </div>
    </div>
  );
}
