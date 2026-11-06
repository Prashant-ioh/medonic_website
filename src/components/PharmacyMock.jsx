import { Bell, MessageCircle, Pill, Printer } from 'lucide-react';

const lines = [
  { name: 'Dolo 650', pack: '15 tab · B#DL2291', qty: 2, amount: '60.00' },
  { name: 'Azithral 500', pack: '5 tab · B#AZ8817', qty: 1, amount: '118.50' },
  { name: 'Cetirizine 10mg', pack: '10 tab · B#CT1043', qty: 1, amount: '22.00' },
];

/** A small, static mock of a MediSlip Pharmacy bill, used as product imagery. */
export const BillCard = ({ className = '' }) => (
  <div className={`w-[300px] rounded-2xl bg-white p-4 text-ink-900 shadow-2xl shadow-ink-900/20 ring-1 ring-border ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Pill className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-extrabold">MediSlip Pharmacy</p>
          <p className="text-[10px] text-text-secondary">Counter 1 · Rahul</p>
        </div>
      </div>
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
        Bill #4821
      </span>
    </div>

    <ul className="mt-3 divide-y divide-border text-xs">
      {lines.map((l) => (
        <li key={l.name} className="flex items-center justify-between py-2">
          <div>
            <p className="font-bold">{l.name}</p>
            <p className="text-[10px] text-text-secondary">{l.pack}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{l.amount}</p>
            <p className="text-[10px] text-text-secondary">× {l.qty}</p>
          </div>
        </li>
      ))}
    </ul>

    <div className="mt-2 space-y-1 border-t border-border pt-2 text-xs">
      <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span>₹200.50</span></div>
      <div className="flex justify-between text-text-secondary"><span>GST 12%</span><span>₹24.06</span></div>
      <div className="flex justify-between text-sm font-extrabold"><span>Total</span><span>₹224.56</span></div>
    </div>

    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold">
      <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2">
        <Printer className="h-3.5 w-3.5" /> Print
      </span>
      <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-mint py-2 text-brand-navy">
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </span>
    </div>
  </div>
);

export const ExpiryChip = ({ className = '' }) => (
  <div className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10 ring-1 ring-border ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
      <Bell className="h-4 w-4" />
    </span>
    <div className="leading-tight">
      <p className="text-sm font-bold text-ink-900">12 batches expiring</p>
      <p className="text-xs text-text-secondary">in the next 30 days · return now</p>
    </div>
  </div>
);
