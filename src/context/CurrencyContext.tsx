import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', label: 'INR', rate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD', rate: 0.012 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR', rate: 0.011 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP', rate: 0.0094 },
  AED: { code: 'AED', symbol: 'AED ', label: 'AED', rate: 0.044 },
};

const STORAGE_KEY = 'velora-currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInr: number) => string;
  convert: (amountInr: number) => number;
  currencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      return saved && saved in CURRENCIES ? saved : 'INR';
    } catch {
      return 'INR';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
  }, []);

  const convert = useCallback(
    (amountInr: number) => {
      const info = CURRENCIES[currency];
      return amountInr * info.rate;
    },
    [currency],
  );

  const formatPrice = useCallback(
    (amountInr: number) => {
      const info = CURRENCIES[currency];
      const converted = amountInr * info.rate;
      if (currency === 'INR') {
        return info.symbol + Math.round(converted).toLocaleString('en-IN');
      }
      return info.symbol + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    [currency],
  );

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    formatPrice,
    convert,
    currencies: Object.values(CURRENCIES),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
