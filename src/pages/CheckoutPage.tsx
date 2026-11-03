import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Smartphone, Wallet, Lock, Check, ChevronRight,
  ShieldCheck, MapPin, Package, Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getProductById, formatINR } from '@/data/products';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
type Step = 'address' | 'payment' | 'confirmation';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, discount, total, deliveryFee, appliedCoupon, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('address');
  const [processing, setProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; total: number } | null>(null);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    pincode: '',
    house: '',
    area: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-ink-800 flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-neutral-600" />
        </div>
        <h1 className="text-3xl font-serif text-cream-50 mb-3">Nothing to Checkout</h1>
        <p className="text-sm text-neutral-400 mb-6 max-w-md">
          Your shopping bag is empty. Add some items before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          Start Shopping
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = Object.values(address).some(v => !v.trim());
    if (missing) {
      showToast('Please fill in all address fields', 'error');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in before placing an order.', 'error');
      navigate('/auth');
      return;
    }
    setProcessing(true);

    try {
      const shippingAddress = {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        pincode: address.pincode,
        house: address.house,
        area: address.area,
        city: address.city,
        state: address.state,
      };

      const isCod = paymentMethod === 'cod';
      const orderInsert: Record<string, unknown> = {
        status: isCod ? 'confirmed' : 'pending',
        total_amount: total,
        subtotal,
        discount,
        shipping_cost: deliveryFee,
        coupon_code: appliedCoupon?.code ?? null,
        payment_method: paymentMethod,
        payment_status: 'pending',
        payment_provider: isCod ? 'cod' : 'razorpay',
        shipping_address: shippingAddress,
        user_id: user.id,
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => {
        const product = getProductById(item.productId);
        return {
          order_id: orderData.id,
          product_id: item.productId,
          product_name: product?.name ?? 'Unknown',
          product_image: product?.image ?? null,
          brand: product?.brand ?? '',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: product?.price ?? 0,
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (!isCod) {
        await openRazorpayCheckout(orderData.id, address);
        setProcessing(false);
        return;
      }

      setOrderResult({ id: orderData.id.slice(0, 8).toUpperCase(), total });
      setProcessing(false);
      setStep('confirmation');
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_err) {
      setProcessing(false);
      showToast('We could not start this payment. Please try again.', 'error');
    }
  };

  const openRazorpayCheckout = async (orderId: string, shipping: typeof address) => {
    const { data, error } = await supabase.functions.invoke('create-payment-order', { body: { orderId } });
    if (error || !data?.razorpayOrderId || !data?.keyId) {
      throw new Error(data?.error ?? 'Payment gateway is not configured yet.');
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Payment gateway could not be loaded.'));
      document.body.appendChild(script);
    });
    if (!window.Razorpay) throw new Error('Payment gateway could not be loaded.');

    const razorpay = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'LUXORA',
      description: 'LUXORA marketplace order',
      order_id: data.razorpayOrderId,
      prefill: { name: shipping.fullName, email: shipping.email, contact: shipping.phone },
      theme: { color: '#d7ad5b' },
      method: { upi: true, card: true, netbanking: true },
      handler: async response => {
        const result = await supabase.functions.invoke('verify-payment', {
          body: {
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        });
        if (result.error || !result.data?.verified) {
          showToast('Payment received but verification is still pending. Please check your order shortly.', 'error');
          return;
        }
        setOrderResult({ id: orderId.slice(0, 8).toUpperCase(), total });
        setStep('confirmation');
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      modal: { ondismiss: () => showToast('Payment cancelled. Your order remains pending.', 'error') },
    });
    razorpay.open();
  };

  if (step === 'confirmation' && orderResult) {
    return (
      <div className="min-h-screen mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-serif text-cream-50 mb-3">Order Confirmed!</h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed successfully and a confirmation has been sent to your email.
          </p>
        </div>

        <div className="bg-ink-900 border border-gold-500/20 rounded-xl p-6 space-y-4 animate-fade-in-up">
          <div className="flex justify-between items-center pb-4 border-b border-ink-700">
            <div>
              <p className="text-xs text-neutral-400">Order Number</p>
              <p className="text-lg font-serif text-gold-400">{orderResult.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">Amount Paid</p>
              <p className="text-lg font-semibold text-cream-50">{formatPrice(orderResult.total)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-gold-400" />
              Shipping to: {address.city}, {address.state}
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Package className="w-4 h-4 text-gold-400" />
              Estimated delivery: 3-5 business days
            </div>
          </div>
          <div className="pt-4 border-t border-ink-700 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/track-order')}
              className="flex-1 py-3 bg-ink-800 border border-ink-700 text-cream-100 text-sm font-medium rounded-lg hover:border-gold-500/40 transition-colors"
            >
              Track This Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-gold-300 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Bag
      </Link>
      <h1 className="text-3xl font-serif text-cream-50 mb-2">Checkout</h1>

      <div className="flex items-center gap-2 mb-8 text-sm">
        <span className={step === 'address' ? 'text-gold-400 font-medium' : 'text-neutral-500'}>Address</span>
        <ChevronRight className="w-4 h-4 text-neutral-600" />
        <span className={step === 'payment' ? 'text-gold-400 font-medium' : 'text-neutral-500'}>Payment</span>
        <ChevronRight className="w-4 h-4 text-neutral-600" />
        <span className={step === 'confirmation' ? 'text-gold-400 font-medium' : 'text-neutral-500'}>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gold-400" />
                <h2 className="text-lg font-serif text-cream-50">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={address.fullName} onChange={v => setAddress({ ...address, fullName: v })} placeholder="Aarav Sharma" />
                <Field label="Phone Number" value={address.phone} onChange={v => setAddress({ ...address, phone: v })} placeholder="+91 98765 43210" />
                <Field label="Email" value={address.email} onChange={v => setAddress({ ...address, email: v })} placeholder="aarav@example.com" type="email" />
                <Field label="PIN Code" value={address.pincode} onChange={v => setAddress({ ...address, pincode: v })} placeholder="110001" />
              </div>
              <Field label="House / Flat / Building" value={address.house} onChange={v => setAddress({ ...address, house: v })} placeholder="Flat 402, Skyline Residency" />
              <Field label="Area / Street / Sector" value={address.area} onChange={v => setAddress({ ...address, area: v })} placeholder="Sector 18, Vasant Vihar" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" value={address.city} onChange={v => setAddress({ ...address, city: v })} placeholder="New Delhi" />
                <Field label="State" value={address.state} onChange={v => setAddress({ ...address, state: v })} placeholder="Delhi" />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-gold-400" />
                <h2 className="text-lg font-serif text-cream-50">Payment Method</h2>
              </div>
              <div className="space-y-3">
                <PaymentOption active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={CreditCard} title="Credit / Debit Card" subtitle="Visa, Mastercard, RuPay, Amex" />
                {paymentMethod === 'card' && (
                  <div className="bg-ink-800/50 border border-ink-700 rounded-lg p-4 space-y-4 animate-fade-in">
                    <Field label="Card Number" value={card.number} onChange={v => setCard({ ...card, number: formatCardNumber(v) })} placeholder="1234 5678 9012 3456" />
                    <Field label="Name on Card" value={card.name} onChange={v => setCard({ ...card, name: v })} placeholder="AARAV SHARMA" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry (MM/YY)" value={card.expiry} onChange={v => setCard({ ...card, expiry: formatExpiry(v) })} placeholder="12/28" />
                      <Field label="CVV" value={card.cvv} onChange={v => setCard({ ...card, cvv: v.replace(/\D/g, '').slice(0, 4) })} placeholder="123" type="password" />
                    </div>
                  </div>
                )}
                <PaymentOption active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} icon={Smartphone} title="UPI" subtitle="Google Pay, PhonePe, Paytm, BHIM" />
                {paymentMethod === 'upi' && (
                  <div className="bg-ink-800/50 border border-ink-700 rounded-lg p-4 space-y-4 animate-fade-in">
                    <Field label="UPI ID" value={upiId} onChange={setUpiId} placeholder="aarav@okhdfcbank" />
                    <div className="flex flex-wrap gap-2">
                      {['@okhdfcbank', '@oksbi', '@okaxis', '@ybl'].map(suffix => (
                        <button key={suffix} type="button" onClick={() => setUpiId(prev => prev.includes('@') ? prev : prev + suffix)} className="text-xs px-3 py-1.5 bg-ink-700 text-neutral-300 rounded-full hover:bg-ink-600 transition-colors">
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <PaymentOption active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} icon={Wallet} title="Cash on Delivery" subtitle="Pay in cash when your order arrives" />
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Your payment information is encrypted and secure. This is a test transaction — no real charges will be made.
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('address')} className="px-6 py-3.5 bg-ink-800 border border-ink-700 text-cream-100 text-sm font-medium rounded-lg hover:border-gold-500/40 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={processing} className="flex-1 py-3.5 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {processing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Processing Payment...</>
                  ) : (
                    <>Pay {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-ink-900 border border-ink-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-serif text-cream-50">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scroll pr-1">
              {items.map(item => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                    <img src={product.image} alt={product.name} className="w-14 h-18 object-cover rounded-md shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gold-400">{product.brand}</p>
                      <p className="text-sm text-cream-100 truncate">{product.name}</p>
                      <p className="text-xs text-neutral-500">{item.size} · {item.color} · Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm text-cream-50 shrink-0">{formatPrice(product.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-ink-700 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-neutral-300"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400"><span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span><span>−{formatPrice(discount)}</span></div>
              )}
              <div className="flex justify-between text-neutral-300"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span className="text-green-400">FREE</span> : formatPrice(deliveryFee)}</span></div>
            </div>
            <div className="border-t border-ink-700 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-medium text-cream-100">Total</span>
                <span className="text-2xl font-semibold text-cream-50">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 text-right">≈ {formatINR(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-neutral-400 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-sm text-cream-100 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors" />
    </div>
  );
}

function PaymentOption({ active, onClick, icon: Icon, title, subtitle }: { active: boolean; onClick: () => void; icon: typeof CreditCard; title: string; subtitle: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-all text-left ${active ? 'border-gold-500/50 bg-gold-500/5' : 'border-ink-700 bg-ink-800/30 hover:border-ink-600'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-gold-500 text-ink-950' : 'bg-ink-700 text-neutral-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${active ? 'text-gold-400' : 'text-cream-100'}`}>{title}</p>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${active ? 'border-gold-500 bg-gold-500' : 'border-ink-600'}`}>
        {active && <Check className="w-3 h-3 text-ink-950 mx-auto mt-0.5" />}
      </div>
    </button>
  );
}
