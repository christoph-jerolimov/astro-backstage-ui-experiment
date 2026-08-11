/** Invoices and plan facts, shared by the three billing pages. */
export interface InvoiceLine {
  description: string;
  quantity: number;
  unit: number;
}

export interface Invoice {
  id: string;
  period: string;
  issued: string;
  due: string;
  status: 'paid' | 'open' | 'failed';
  lines: InvoiceLine[];
}

const SEATS = { description: 'Team plan · developer seats', unit: 40 };

export const INVOICES: Invoice[] = [
  { id: 'INV-2026-08', period: 'August 2026', issued: 'Aug 1, 2026', due: 'Aug 15, 2026', status: 'open',
    lines: [{ ...SEATS, quantity: 8 }, { description: 'Build minutes over 10,000', quantity: 2400, unit: 0.008 }] },
  { id: 'INV-2026-07', period: 'July 2026', issued: 'Jul 1, 2026', due: 'Jul 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 7 }, { description: 'Build minutes over 10,000', quantity: 1750, unit: 0.008 }] },
  { id: 'INV-2026-06', period: 'June 2026', issued: 'Jun 1, 2026', due: 'Jun 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 7 }] },
  { id: 'INV-2026-05', period: 'May 2026', issued: 'May 1, 2026', due: 'May 15, 2026', status: 'failed',
    lines: [{ ...SEATS, quantity: 6 }, { description: 'Support retainer', quantity: 1, unit: 200 }] },
  { id: 'INV-2026-04', period: 'April 2026', issued: 'Apr 1, 2026', due: 'Apr 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 6 }] },
  { id: 'INV-2026-03', period: 'March 2026', issued: 'Mar 1, 2026', due: 'Mar 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 5 }] },
  { id: 'INV-2026-02', period: 'February 2026', issued: 'Feb 1, 2026', due: 'Feb 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 5 }] },
  { id: 'INV-2026-01', period: 'January 2026', issued: 'Jan 1, 2026', due: 'Jan 15, 2026', status: 'paid',
    lines: [{ ...SEATS, quantity: 4 }] },
];

export function invoiceTotal(invoice: Invoice) {
  return invoice.lines.reduce((sum, line) => sum + line.quantity * line.unit, 0);
}

/** Two decimal places, no currency library for a demo. */
export function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export const USAGE = {
  buildMinutes: { used: 12400, included: 10000, unit: 'build minutes' },
  seats: { used: 8, included: 10 },
  storage: { used: 41, included: 100, unit: 'GB of artifacts' },
};
