import { create } from "zustand";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceStore {
  items: InvoiceItem[];
  taxRate: number;
  addItem: () => void;
  updateItem: (id: string, field: string, value: string | number) => void;
  removeItem: (id: string) => void;
  setTaxRate: (rate: number) => void;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  reset: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
  taxRate: 18,

  addItem: () =>
    set((state) => ({
      items: [
        ...state.items,
        {
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    })),

  updateItem: (id, field, value) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  setTaxRate: (rate) => set({ taxRate: rate }),
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.amount, 0),
  getTaxAmount: () => (get().getSubtotal() * get().taxRate) / 100,
  getTotal: () => get().getSubtotal() + get().getTaxAmount(),
  reset: () =>
    set({
      items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
    }),
}));
