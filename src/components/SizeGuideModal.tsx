import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const clothingSizes = [
  { size: 'XS', chest: '84-88', waist: '66-70', hips: '90-94' },
  { size: 'S', chest: '88-92', waist: '70-74', hips: '94-98' },
  { size: 'M', chest: '92-96', waist: '74-78', hips: '98-102' },
  { size: 'L', chest: '96-102', waist: '78-84', hips: '102-108' },
  { size: 'XL', chest: '102-108', waist: '84-90', hips: '108-114' },
  { size: 'XXL', chest: '108-114', waist: '90-96', hips: '114-120' },
];

const suitSizes = [
  { size: '38', chest: '96', waist: '80', drop: 'Slim' },
  { size: '40', chest: '100', waist: '84', drop: 'Slim' },
  { size: '42', chest: '104', waist: '88', drop: 'Regular' },
  { size: '44', chest: '108', waist: '92', drop: 'Regular' },
  { size: '46', chest: '112', waist: '96', drop: 'Classic' },
];

const footwearSizes = [
  { india: '6', uk: '6', eu: '39', cm: '24.5' },
  { india: '7', uk: '7', eu: '40.5', cm: '25.5' },
  { india: '8', uk: '8', eu: '42', cm: '26.5' },
  { india: '9', uk: '9', eu: '43', cm: '27.5' },
  { india: '10', uk: '10', eu: '44', cm: '28.5' },
  { india: '11', uk: '11', eu: '45', cm: '29.5' },
];

const kidsSizes = [
  { size: '2-3Y', height: '92-98', chest: '52-54' },
  { size: '4-5Y', height: '104-110', chest: '55-57' },
  { size: '6-7Y', height: '116-122', chest: '58-62' },
  { size: '8-9Y', height: '128-134', chest: '63-67' },
  { size: '10-11Y', height: '140-146', chest: '68-72' },
];

const tabs = [
  { key: 'clothing', label: 'Clothing (cm)' },
  { key: 'suits', label: 'Suits (cm)' },
  { key: 'footwear', label: 'Footwear' },
  { key: 'kids', label: 'Kids (cm)' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('clothing');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative bg-ink-900 border border-gold-500/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-scale-in flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700">
          <h2 className="text-xl font-serif text-cream-50">Size Guide</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-cream-100 hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4 border-b border-ink-800 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.key ? 'text-gold-400' : 'text-neutral-400 hover:text-cream-100'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-400" />
              )}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto custom-scroll px-6 py-5 flex-1">
          {activeTab === 'clothing' && (
            <SizeTable
              headers={['Size', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)']}
              rows={clothingSizes.map(s => [s.size, s.chest, s.waist, s.hips])}
            />
          )}
          {activeTab === 'suits' && (
            <SizeTable
              headers={['Size', 'Chest (cm)', 'Waist (cm)', 'Fit']}
              rows={suitSizes.map(s => [s.size, s.chest, s.waist, s.drop])}
            />
          )}
          {activeTab === 'footwear' && (
            <SizeTable
              headers={['India', 'UK', 'EU', 'Foot Length (cm)']}
              rows={footwearSizes.map(s => [s.india, s.uk, s.eu, s.cm])}
            />
          )}
          {activeTab === 'kids' && (
            <SizeTable
              headers={['Size', 'Height (cm)', 'Chest (cm)']}
              rows={kidsSizes.map(s => [s.size, s.height, s.chest])}
            />
          )}

          <div className="mt-6 bg-ink-800/50 border border-ink-700/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">How to Measure</h4>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span><span className="text-cream-100">Chest:</span> Measure around the fullest part, keeping the tape level.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span><span className="text-cream-100">Waist:</span> Measure around your natural waistline.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span><span className="text-cream-100">Hips:</span> Measure around the fullest part of your hips.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span><span className="text-cream-100">Foot Length:</span> Measure from heel to longest toe.</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-neutral-500 mt-4">
            Measurements are in centimeters. If you're between sizes, we recommend sizing up for a relaxed fit or sizing down for a slim fit.
          </p>
        </div>
      </div>
    </div>
  );
}

function SizeTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold-500/20">
            {headers.map(h => (
              <th key={h} className="text-left py-3 px-3 text-gold-400 font-medium uppercase text-xs tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ink-800 hover:bg-ink-800/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`py-3 px-3 ${j === 0 ? 'text-cream-50 font-medium' : 'text-neutral-300'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
